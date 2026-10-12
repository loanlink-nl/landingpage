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
export default defineNuxtPlugin(() => {
	const config = useRuntimeConfig().public;
	if (!config.posthogKey) return;

	posthog.init(config.posthogKey as string, {
		api_host: config.posthogApiHost as string,
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
	});

	const router = useRouter();
	router.afterEach(() => {
		// Vuurt ook voor de eerste pagina (Nuxt doet bij app:created een router.replace).
		posthog.capture("$pageview");
	});
});
