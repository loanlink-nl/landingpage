import posthog from "posthog-js";

/**
 * Cookieloze websitestatistiek (AVG / Telecommunicatiewet art. 11.7a).
 *
 * - persistence "memory": PostHog zet geen cookies en schrijft niets in
 *   localStorage/sessionStorage; elke paginalading is een nieuw, anoniem bezoek.
 * - geen sessie-opnames, geen surveys, geen extern geladen scripts.
 * - de proxy (server/routes/data) stuurt geen cookies en geen bezoekers-IP door.
 * - geen eigen identificatie-cookie (de vroegere nuxt-posthog-module zette
 *   "ph-identify"; die module is daarom vervangen door deze plugin).
 *
 * Komt er ooit tracking die wél iets op het apparaat opslaat (bijv. de Meta-pixel),
 * dan pas na toestemming via een cookiebanner. Zie /privacy.
 */
const URL_PROPS = [
	"$current_url",
	"$referrer",
	"$initial_referrer",
	"$initial_current_url",
	"$pathname",
];

function stripQuery(value: string): string {
	try {
		const u = new URL(value, window.location.origin);
		return value.startsWith("/") ? u.pathname : `${u.origin}${u.pathname}`;
	} catch {
		return value.split(/[?#]/)[0] ?? "";
	}
}

export default defineNuxtPlugin(() => {
	const config = useRuntimeConfig().public;
	if (!config.posthogKey) return;

	posthog.init(config.posthogKey as string, {
		// Altijd via het eigen domein van de bezoeker (proxy server/routes/data).
		api_host: new URL("/data", window.location.origin).href,
		ui_host: "https://eu.posthog.com",
		persistence: "memory",
		disable_session_recording: true,
		capture_pageview: false,
		capture_pageleave: true,
		// Vastgezet in code, zodat een instelling in het PostHog-project
		// niet ongemerkt opslag op het apparaat aanzet.
		disable_surveys: true,
		disable_external_dependency_loading: true,
		autocapture: true,
		// Geen querystring of #-deel naar PostHog: daar kunnen persoonsgegevens in staan.
		sanitize_properties: (properties) => {
			for (const key of URL_PROPS) {
				const value = properties[key];
				if (typeof value === "string") properties[key] = stripQuery(value);
			}
			return properties;
		},
	});

	const router = useRouter();
	router.afterEach(() => {
		// Vuurt ook voor de eerste pagina (Nuxt doet bij app:created een router.replace).
		posthog.capture("$pageview");
	});
});
