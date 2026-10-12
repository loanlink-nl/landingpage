/**
 * Sitecontrole voor loanlink.nl — draait bij elke pull request (lokale build)
 * en na elke livegang (tegen https://loanlink.nl).
 *
 *   BASE_URL=http://localhost:3000 node scripts/check-site.mjs
 *   BASE_URL=https://loanlink.nl EXPECT_ANALYTICS=1 EXPECT_COMMIT=<sha> node scripts/check-site.mjs
 *
 * Toetst de website-checklist (Meta-verificatie, AVG, Wft) op ÁLLE pagina's die
 * vanaf de homepage bereikbaar zijn. Dit bestand wijzigen = langs Gustaaf (CODEOWNERS).
 */
import { gunzipSync } from "node:zlib";
import { chromium } from "playwright";

const base = (process.env.BASE_URL ?? "http://localhost:3000").replace(
	/\/$/,
	""
);
const origin = new URL(base);
const expectAnalytics = process.env.EXPECT_ANALYTICS === "1";
const expectCommit = process.env.EXPECT_COMMIT ?? "";
const extraHosts = (process.env.EXTRA_HOSTS ?? "").split(",").filter(Boolean);
// EXPECT_PIXEL=1: de build heeft een (test-)pixel-ID; na "Accepteren" moet de pixel laden.
const expectPixel = process.env.EXPECT_PIXEL === "1";
// Herkenbaar als controle (PostHog: filter deze user-agent als intern verkeer).
const userAgent =
	"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36 loanlink-controle";

// Vaste waarden — bewust NIET uit company.ts gelezen, zodat een fout daar opvalt.
const COMPANY = {
	legalName: "CapitalManagementGroup B.V.",
	kvk: "KvK 88986039",
	vat: "NL864845145B01",
	street: "Ilpendammerstraat 17",
	city: "1023 AS Amsterdam",
	email: "info@loanlink.nl",
};
// Afgesproken bannertekst (Gustaaf, 12-10-2026).
const BANNER_TITLE = "Helpt u ons ontdekken welke campagnes werken?";
const BANNER_TEXT =
	"Met uw toestemming gebruiken we hiervoor cookies van advertentiepartners.";
const FOOTER_MUST = [...Object.values(COMPANY), "geen hypotheekadvies"];
// Wft/reclame: claims die LoanLink niet mag doen.
const FORBIDDEN = [
	/laagste rente/i,
	/gegarandeerd/i,
	/\bgarantie\b/i,
	/persoonlijk (hypotheek)?advies/i,
	/advies op maat/i,
	/past bij jou/i,
	/lorem ipsum/i,
	/under construction/i,
	/\bTODO\b/,
	/binnenkort beschikbaar/i,
];

let fails = 0;
const ok = (cond, msg) => {
	console.log(`${cond ? "OK  " : "FOUT"} ${msg}`);
	if (!cond) fails++;
};
const footerText = async (page) =>
	(await page.locator("footer").count())
		? await page.locator("footer").first().innerText()
		: "";

const browser = await chromium.launch();

// 0. Draait de verwachte versie?
if (expectCommit) {
	const ctx = await browser.newContext({ userAgent });
	const page = await ctx.newPage();
	await page.goto(base + "/");
	const live = await page
		.locator('meta[name="x-commit"]')
		.getAttribute("content")
		.catch(() => null);
	ok(
		live === expectCommit,
		`live versie is ${expectCommit.slice(0, 7)} (gevonden: ${live?.slice(0, 7) ?? "geen"})`
	);
	await ctx.close();
	if (live !== expectCommit) {
		await browser.close();
		console.log("\nNieuwe versie (nog) niet live");
		process.exit(2);
	}
}

// 1. Alle pagina's vinden (vanaf de homepage, recursief, alleen eigen site)
const pages = new Set(["/"]);
{
	const ctx = await browser.newContext({ userAgent });
	const page = await ctx.newPage();
	const queue = ["/"];
	while (queue.length && pages.size < 50) {
		const path = queue.shift();
		const res = await page.goto(base + path);
		if (!res || res.status() !== 200) continue;
		for (const h of await page.$$eval("a[href]", (as) =>
			as.map((a) => a.href)
		)) {
			const u = new URL(h);
			if (u.host !== origin.host) continue;
			const p = u.pathname.replace(/\/$/, "") || "/";
			if (!pages.has(p)) {
				pages.add(p);
				queue.push(p);
			}
		}
	}
	await ctx.close();
}
ok(
	["/", "/contact", "/privacy"].every((p) => pages.has(p)),
	`pagina's gevonden: ${[...pages].join(", ")}`
);

// 2. Elke pagina, desktop en mobiel
for (const vp of [
	{ name: "desktop", width: 1280, height: 900 },
	{ name: "mobiel", width: 375, height: 800 },
]) {
	let eventsSent = 0;
	const ctx = await browser.newContext({ viewport: vp, userAgent });
	// PostHog negeert geautomatiseerde browsers (webdriver / HeadlessChrome); zonder dit
	// gaat er nooit een event over de lijn en toetsen we niets.
	await ctx.addInitScript(() => {
		Object.defineProperty(navigator, "webdriver", { get: () => false });
		Object.defineProperty(navigator, "userAgentData", { get: () => undefined });
	});
	// Alle statistiekverkeer (/data/...) beantwoordt de controle zelf: niets gaat naar
	// PostHog (geen vervuiling, geen afhankelijkheid van een echte sleutel in CI).
	await ctx.route(
		(url) => url.origin === origin.origin && url.pathname.startsWith("/data/"),
		(route) => {
			if (
				/^\/data\/(e|i\/v0\/e|batch)\//.test(
					new URL(route.request().url()).pathname
				)
			)
				eventsSent++;
			return route.fulfill({
				status: 200,
				contentType: "application/json",
				body: "{}",
			});
		}
	);
	const page = await ctx.newPage();
	const thirdParty = new Set();
	const errors = [];
	page.on("request", (r) => {
		const u = new URL(r.url());
		if (!["http:", "https:"].includes(u.protocol)) return;
		if (u.host !== origin.host && !extraHosts.includes(u.host))
			thirdParty.add(u.host);
	});
	page.on("pageerror", (e) => errors.push(e.message));
	page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

	for (const path of pages) {
		const res = await page.goto(base + path, { waitUntil: "networkidle" });
		ok(
			res?.status() === 200,
			`${vp.name} ${path}: pagina laadt (status ${res?.status()})`
		);
		const footer = await footerText(page);
		for (const s of FOOTER_MUST)
			ok(footer.includes(s), `${vp.name} ${path}: footer bevat "${s}"`);
		const sw = await page.evaluate(() => document.documentElement.scrollWidth);
		ok(sw <= vp.width, `${vp.name} ${path}: niet breder dan scherm (${sw}px)`);
		const body = await page.locator("body").innerText();
		for (const re of FORBIDDEN)
			ok(!re.test(body), `${vp.name} ${path}: geen "${re.source}"`);
		// Elk percentage moet in zijn eigen blok (dichtstbijzijnde section/article)
		// bij "indicatief" staan; één disclaimer elders op de pagina telt niet.
		const zonderDisclaimer = await page.evaluate(() => {
			const missing = [];
			const walker = document.createTreeWalker(
				document.querySelector("main") ?? document.body,
				NodeFilter.SHOW_TEXT
			);
			for (let n = walker.nextNode(); n; n = walker.nextNode()) {
				if (!/\d\s?%/.test(n.textContent ?? "")) continue;
				const el = n.parentElement;
				if (!el || el.closest("footer")) continue;
				const block = el.closest("section, article, main") ?? document.body;
				if (!/indicatief/i.test(block.innerText))
					missing.push((n.textContent ?? "").trim().slice(0, 40));
			}
			return missing;
		});
		ok(
			zonderDisclaimer.length === 0,
			`${vp.name} ${path}: elk percentage staat bij "indicatief" (${zonderDisclaimer.join(" | ") || "ok"})`
		);
		ok(
			!/[?&](inkomen|bsn|salaris|email|naam)=/i.test(page.url()),
			`${vp.name} ${path}: geen persoonsgegevens in URL`
		);
	}
	await page.waitForTimeout(5000); // PostHog verstuurt in batches
	const cookies = await ctx.cookies();
	ok(
		cookies.length === 0,
		`${vp.name}: geen cookies (${cookies.map((c) => c.name).join(", ") || "geen"})`
	);
	const storage = await page.evaluate(() => [
		...Object.keys(localStorage),
		...Object.keys(sessionStorage),
	]);
	ok(
		storage.length === 0,
		`${vp.name}: geen browseropslag (${storage.join(", ") || "geen"})`
	);
	ok(
		thirdParty.size === 0,
		`${vp.name}: geen verzoeken naar andere partijen (${[...thirdParty].join(", ") || "geen"})`
	);
	ok(
		errors.length === 0,
		`${vp.name}: geen fouten in de browser (${errors.slice(0, 3).join(" | ") || "geen"})`
	);
	if (expectAnalytics) {
		ok(
			eventsSent > 0,
			`${vp.name}: bezoekstatistiek verstuurt events (${eventsSent})`
		);
	}
	await ctx.close();
}

// 3. 404
{
	const ctx = await browser.newContext({ userAgent });
	const page = await ctx.newPage();
	const res = await page.goto(`${base}/deze-pagina-bestaat-niet`);
	ok(res?.status() === 404, "onbekende pagina geeft 404");
	ok(
		(await footerText(page)).includes(COMPANY.kvk),
		"404-pagina toont bedrijfsgegevens"
	);
	await ctx.close();
}
// 4. Cookiebanner en Meta-pixel: niets van Meta vóór toestemming of na weigeren,
//    weigeren even makkelijk als accepteren, keuze te wijzigen via de footer.
{
	const isMeta = (u) => /(^|\.)(facebook\.(com|net))$/.test(new URL(u).host);
	const metaCookies = async (ctx) =>
		(await ctx.cookies())
			.filter((c) => /^_fb[pc]$/.test(c.name))
			.map((c) => c.name);
	const newCtx = async () => {
		const ctx = await browser.newContext({ userAgent });
		await ctx.addInitScript(() =>
			Object.defineProperty(navigator, "webdriver", { get: () => false })
		);
		// De controle beantwoordt Meta zelf: niets gaat echt naar Meta. De nep-pixel
		// zet een _fbp-cookie zoals de echte, zodat het opruimen getoetst wordt.
		const hits = [];
		await ctx.route(isMeta, (route) => {
			hits.push(route.request().url());
			return route.fulfill({
				status: 200,
				contentType: "application/javascript",
				body: "document.cookie='_fbp=fb.1.controle; path=/; max-age=7776000';window.fbq&&(window.fbq.callMethod=function(){});",
			});
		});
		await ctx.route(
			(url) =>
				url.origin === origin.origin && url.pathname.startsWith("/data/"),
			(route) => route.fulfill({ status: 200, body: "{}" })
		);
		return { ctx, hits };
	};
	const banner = "#cc-main .cm";

	// a. Weigeren
	{
		const { ctx, hits } = await newCtx();
		const page = await ctx.newPage();
		await page.goto(base + "/", { waitUntil: "networkidle" });
		const visible = await page
			.waitForSelector(banner, { state: "visible", timeout: 8000 })
			.then(() => true)
			.catch(() => false);
		ok(visible, "cookiebanner verschijnt bij eerste bezoek");
		const accept = page.locator('#cc-main [data-role="all"]');
		const reject = page.locator('#cc-main [data-role="necessary"]');
		ok(
			(await accept.count()) === 1 && (await reject.count()) === 1,
			'banner heeft "Accepteren" en "Alleen noodzakelijk"'
		);
		const buttons = (
			await page.locator("#cc-main .cm button").allInnerTexts()
		).map((t) => t.trim());
		ok(
			buttons.length === 2 &&
				buttons.includes("Accepteren") &&
				buttons.includes("Alleen noodzakelijk"),
			`banner heeft precies twee knoppen (${buttons.join(" | ")})`
		);
		const bannerText = visible ? await page.locator(banner).innerText() : "";
		ok(
			bannerText.includes(BANNER_TITLE) && bannerText.includes(BANNER_TEXT),
			"bannertekst is de afgesproken tekst"
		);
		ok(
			!(await page.evaluate(() =>
				document.documentElement.classList.contains("disable--interaction")
			)),
			"geen cookiewall: de site blijft bruikbaar terwijl de banner openstaat"
		);
		if (visible) {
			const [a, r] = [await accept.boundingBox(), await reject.boundingBox()];
			ok(
				a &&
					r &&
					Math.abs(a.height - r.height) < 2 &&
					Math.abs(a.width - r.width) < 2,
				"weigeren is even groot als accepteren"
			);
		}
		ok(hits.length === 0, "niets van Meta geladen vóór een keuze");
		if (visible) await reject.click();
		await page.goto(base + "/privacy", { waitUntil: "networkidle" });
		ok(hits.length === 0, "na weigeren: niets van Meta geladen");
		ok(!(await page.isVisible(banner)), "na weigeren: banner blijft weg");
		ok(
			(await metaCookies(ctx)).length === 0,
			"na weigeren: geen cookies van Meta"
		);
		await page.click('footer button:has-text("Cookie-instellingen")');
		ok(
			await page
				.waitForSelector(banner, { state: "visible", timeout: 5000 })
				.then(() => true)
				.catch(() => false),
			'"Cookie-instellingen" in de footer toont de banner opnieuw'
		);
		await ctx.close();
	}

	// b. Accepteren en daarna intrekken via de footer
	if (expectPixel) {
		const { ctx, hits } = await newCtx();
		const page = await ctx.newPage();
		await page.goto(base + "/", { waitUntil: "networkidle" });
		await page.click('#cc-main [data-role="all"]');
		await page.waitForTimeout(1500);
		ok(hits.length > 0, "na accepteren: Meta-pixel laadt");
		ok(
			(await metaCookies(ctx)).length > 0,
			"na accepteren: cookie van Meta gezet"
		);
		await page.click('footer button:has-text("Cookie-instellingen")');
		await page.waitForSelector(banner, { state: "visible" });
		await Promise.all([
			page.waitForNavigation(),
			page.click('#cc-main [data-role="necessary"]'),
		]);
		await page.waitForLoadState("networkidle");
		const before = hits.length;
		await page.goto(base + "/contact", { waitUntil: "networkidle" });
		ok(
			(await metaCookies(ctx)).length === 0,
			"na intrekken: cookie van Meta verwijderd"
		);
		ok(hits.length === before, "na intrekken: pixel laadt niet meer");
		await ctx.close();
	}
}

// 5. Wat er naar de bezoekstatistiek gaat: geen querystring, #-deel, klik-ID's,
//    e-mailadressen of zoekwoorden, ook niet als de bezoeker die in de URL meebrengt.
if (expectAnalytics) {
	const MARK = "CONTROLE7Q";
	const ctx = await browser.newContext({
		userAgent,
		extraHTTPHeaders: { referer: `https://www.google.com/search?q=${MARK}` },
	});
	await ctx.addInitScript(() => {
		Object.defineProperty(navigator, "webdriver", { get: () => false });
		Object.defineProperty(navigator, "userAgentData", { get: () => undefined });
	});
	const bodies = [];
	await ctx.route(
		(url) => url.origin === origin.origin && url.pathname.startsWith("/data/"),
		(route) => {
			const req = route.request();
			const buf = req.postDataBuffer();
			if (buf) {
				let text = "";
				try {
					text =
						new URL(req.url()).searchParams.get("compression") === "gzip-js"
							? gunzipSync(buf).toString("utf8")
							: buf.toString("utf8");
					const form = new URLSearchParams(text).get("data");
					if (form) text = Buffer.from(form, "base64").toString("utf8");
				} catch {
					text = buf.toString("utf8");
				}
				bodies.push(text);
			}
			return route.fulfill({
				status: 200,
				contentType: "application/json",
				body: "{}",
			});
		}
	);
	const page = await ctx.newPage();
	await page.goto(
		`${base}/?fbclid=${MARK}&gclid=${MARK}&email=controle%40voorbeeld.nl#${MARK}`,
		{ waitUntil: "networkidle" }
	);
	await page.goto(`${base}/privacy?naam=${MARK}`, { waitUntil: "networkidle" });
	await page.waitForTimeout(5000);
	const all = bodies.join("\n");
	ok(
		bodies.length > 0,
		`statistiek-inhoud gecontroleerd (${bodies.length} verzoeken)`
	);
	ok(
		!all.includes(MARK) && !all.includes("controle@voorbeeld.nl"),
		"statistiek bevat geen querystring-, klik-ID- of zoekwoordgegevens"
	);
	ok(
		!/https?:\/\/[^"\s]*[?#]/.test(all),
		"statistiek bevat geen URL's met querystring of #-deel"
	);
	await ctx.close();
}

await browser.close();

console.log(
	fails ? `\n${fails} controle(s) mislukt` : "\nAlle controles geslaagd"
);
process.exit(fails ? 1 : 0);
