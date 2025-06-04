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
		"nuxt-posthog",
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
		name: "LoanLink AdviesIntake",
	},
	posthog: {
		clientOptions: {
			api_host: `${baseUrl}/ingest`,
			ui_host: "https://eu.posthog.com",
		},
	},
	nitro: {
		preset: "bun",
	},
	routeRules: {
		"/ingest/static/**": { proxy: "https://eu-assets.i.posthog.com/static/**" },
		"/ingest/**": { proxy: "https://eu.i.posthog.com/**" },
	},
});
