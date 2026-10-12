import posthog from "posthog-js";
import type { CaptureResult } from "posthog-js";

/**
 * Cookieloze websitestatistiek (AVG / Telecommunicatiewet art. 11.7a).
 *
 * - persistence "memory": PostHog zet geen cookies en schrijft niets in
 *   localStorage/sessionStorage; elke paginalading is een nieuw, anoniem bezoek.
 * - geen sessie-opnames, geen surveys, geen extern geladen scripts.
 * - de proxy (server/routes/data) stuurt geen cookies en geen bezoekers-IP door.
 * - geen eigen identificatie-cookie (de vroegere nuxt-posthog-module zette
 *   "ph-identify"; die module is daarom vervangen door deze plugin).
 * - geen querystring, #-deel, klik-ID's (fbclid e.d.) of zoekwoorden naar PostHog
 *   (before_send hieronder); daar kunnen persoonsgegevens in staan.
 *
 * Tracking die wél iets op het apparaat opslaat (de Meta-pixel) loopt via de
 * cookiebanner: app/plugins/cookieconsent.client.ts. Zie /privacy.
 */

// Klik-ID's van advertentieplatformen en zoekwoorden: nooit naar PostHog,
// ook niet als $session_entry_… of $initial_… variant.
const DROP =
	/(^|_)(fbclid|gclid|gclsrc|dclid|gbraid|wbraid|gad_source|msclkid|twclid|li_fat_id|mc_cid|igshid|ttclid|rdt_cid|epik|qclid|sccid|irclid|_kx|ph_keyword)$/;

/** URL zonder querystring en #-deel; andere waarden (bijv. "$direct") ongewijzigd. */
function stripUrl(value: string): string {
	if (!/^(https?:\/\/|\/)/i.test(value)) return value;
	return value.split(/[?#]/)[0] ?? "";
}

function clean(props: Record<string, unknown> | undefined) {
	if (!props) return;
	for (const [key, value] of Object.entries(props)) {
		if (DROP.test(key)) Reflect.deleteProperty(props, key);
		else if (typeof value === "string") props[key] = stripUrl(value);
	}
}

function scrub(event: CaptureResult | null): CaptureResult | null {
	if (!event) return event;
	clean(event.properties as Record<string, unknown>);
	clean(event.$set as Record<string, unknown> | undefined);
	clean(event.$set_once as Record<string, unknown> | undefined);
	return event;
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
		before_send: scrub,
	});

	const router = useRouter();
	router.afterEach(() => {
		// Vuurt ook voor de eerste pagina (Nuxt doet bij app:created een router.replace).
		posthog.capture("$pageview");
	});
});
