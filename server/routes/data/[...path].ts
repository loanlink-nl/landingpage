/**
 * Proxy naar PostHog EU voor de cookieloze websitestatistiek.
 * Haalt vóór het doorsturen weg:
 * - cookies (bijv. die van app.loanlink.nl op .loanlink.nl)
 * - het IP-adres van de bezoeker (X-Forwarded-For e.d.), zodat PostHog alleen
 *   het serveradres ziet en geen IP of locatie van de bezoeker kan opslaan.
 */
const STRIP = [
	"cookie",
	"x-forwarded-for",
	"x-real-ip",
	"forwarded",
	"cf-connecting-ip",
	"true-client-ip",
];

// proxyRequest() voegt altijd alle originele headers weer toe; daarom sendProxy() met
// een eigen, geschoonde headerset.
export default defineEventHandler(async (event) => {
	// Uit de ruwe URL, zodat een slash aan het eind (PostHog: /e/, /decide/) blijft staan.
	const url = getRequestURL(event);
	const path = url.pathname.replace(/^\/data\//, "");
	const search = url.search;
	// POSTHOG_UPSTREAM alleen voor de test (echo-server); in productie leeg.
	const upstream = process.env.POSTHOG_UPSTREAM;
	const target = upstream
		? `${upstream}/${path}${search}`
		: path.startsWith("static/")
			? `https://eu-assets.i.posthog.com/${path}${search}`
			: `https://eu.i.posthog.com/${path}${search}`;

	const headers: Record<string, string> = {};
	for (const [key, value] of Object.entries(getProxyRequestHeaders(event))) {
		if (!STRIP.includes(key.toLowerCase()) && value)
			headers[key] = String(value);
	}

	const body = ["POST", "PUT", "PATCH"].includes(event.method)
		? new Uint8Array((await readRawBody(event, false)) ?? [])
		: undefined;

	return sendProxy(event, target, {
		fetchOptions: { method: event.method, headers, body },
	});
});
