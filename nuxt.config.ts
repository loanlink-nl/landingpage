import { defineNuxtConfig } from "nuxt/config";
import tailwindcss from "@tailwindcss/vite";

const baseUrl = import.meta.env.RAILWAY_PUBLIC_DOMAIN
	? `https://${import.meta.env.RAILWAY_PUBLIC_DOMAIN}`
	: "https://loanlink.nl";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: [
		"@nuxt/eslint",
		"@nuxt/fonts",
		"@nuxt/icon",
		"@nuxt/image",
		"@nuxt/scripts",
		"@nuxt/ui",
		"nuxt-seo-utils",
		"nuxt-og-image",
	],
	devtools: { enabled: true },
	future: {
		compatibilityVersion: 4,
	},
	compatibilityDate: "2024-04-03",
	ssr: true,
	vite: {
		plugins: [tailwindcss()],
	},
	css: ["~/assets/main.css"],
	site: {
		url: baseUrl,
		name: "LoanLink Adviesintake",
	},
	runtimeConfig: {
		public: {
			// Zelfde env-variabele als voorheen (nuxt-posthog), zodat de deploy niet verandert.
			posthogKey: process.env.POSTHOG_API_KEY ?? "",
			posthogApiHost: `${baseUrl}/data`,
		},
	},
	nitro: {
		preset: "bun",
	},
	// /data/** → PostHog EU gaat via server/routes/data/[...path].ts,
	// die cookies en het IP-adres van de bezoeker eruit haalt.
	icon: {
		// Geen iconen live ophalen bij api.iconify.design (derde partij ziet dan het IP).
		fallbackToApi: false,
	},
	ui: {
		colorMode: false,
	},
});
