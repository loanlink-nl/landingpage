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
import { chromium } from "playwright";

const base = (process.env.BASE_URL ?? "http://localhost:3000").replace(
	/\/$/,
	""
);
const origin = new URL(base);
const expectAnalytics = process.env.EXPECT_ANALYTICS === "1";
const expectCommit = process.env.EXPECT_COMMIT ?? "";
const extraHosts = (process.env.EXTRA_HOSTS ?? "").split(",").filter(Boolean);
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
	// Events van deze controle nooit echt doorsturen: tellen, en zelf "ok" antwoorden,
	// zodat de dagelijkse controle de bezoekstatistiek niet vervuilt.
	await ctx.route(/\/data\/(e|i\/v0\/e|batch)\//, (route) => {
		eventsSent++;
		return route.fulfill({
			status: 200,
			contentType: "application/json",
			body: '{"status":1}',
		});
	});
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
		const main = body.replace(footer, "");
		if (/\d\s?%/.test(main))
			ok(
				/indicatief/i.test(main),
				`${vp.name} ${path}: percentages staan erbij als "indicatief"`
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
await browser.close();

console.log(
	fails ? `\n${fails} controle(s) mislukt` : "\nAlle controles geslaagd"
);
process.exit(fails ? 1 : 0);
