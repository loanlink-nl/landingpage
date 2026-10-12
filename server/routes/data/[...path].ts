import type { H3Event } from "h3";

/**
 * Proxy naar PostHog EU voor de cookieloze websitestatistiek.
 * Stuurt alleen de headers door die PostHog nodig heeft (allowlist). Daardoor gaan
 * nooit mee: cookies (bijv. die van app.loanlink.nl op .loanlink.nl), Authorization,
 * Referer (volledige pagina-URL) en het IP-adres van de bezoeker (X-Forwarded-For e.d.).
 */
const ALLOW = [
	"accept",
	"accept-encoding",
	"content-encoding",
	"content-type",
	"user-agent",
];

// PostHog-batches zijn klein; grotere verzoeken weigeren we (geheugen beschermen).
const MAX_BODY_BYTES = 1024 * 1024;

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
		if (ALLOW.includes(key.toLowerCase()) && value)
			headers[key] = String(value);
	}

	const hasBody = ["POST", "PUT", "PATCH"].includes(event.method);
	const body = hasBody ? await readLimitedBody(event) : undefined;

	return sendProxy(event, target, {
		fetchOptions: { method: event.method, headers, body },
	});
});

// Leest de body in stukken en stopt zodra hij groter wordt dan MAX_BODY_BYTES,
// ook als er geen Content-Length is (chunked); zo blijft het geheugengebruik begrensd.
async function readLimitedBody(
	event: H3Event
): Promise<Uint8Array<ArrayBuffer> | undefined> {
	const tooLarge = () =>
		createError({ statusCode: 413, statusMessage: "Payload Too Large" });
	if (Number(getRequestHeader(event, "content-length") ?? 0) > MAX_BODY_BYTES)
		throw tooLarge();
	const stream = getRequestWebStream(event);
	if (!stream) return undefined;
	const reader = stream.getReader();
	const chunks: Uint8Array[] = [];
	let size = 0;
	for (;;) {
		const { done, value } = await reader.read();
		if (done) break;
		size += value.byteLength;
		if (size > MAX_BODY_BYTES) {
			await reader.cancel();
			throw tooLarge();
		}
		chunks.push(value);
	}
	const out = new Uint8Array(new ArrayBuffer(size));
	let offset = 0;
	for (const c of chunks) {
		out.set(c, offset);
		offset += c.byteLength;
	}
	return out;
}
