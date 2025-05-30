import { defineNuxtConfig } from "nuxt/config";
import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: [
		"@nuxt/content",
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
		url: "https://loanlink.nl",
		name: "LoanLink AdviesIntake",
	},
});
