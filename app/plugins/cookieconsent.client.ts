import "vanilla-cookieconsent/dist/cookieconsent.css";
import * as CookieConsent from "vanilla-cookieconsent";
import posthog from "posthog-js";

// Statistieken (PostHog) starten pas na toestemming voor "analytics".
export default defineNuxtPlugin(() => {
	const { publicKey } = useRuntimeConfig().public.posthog as {
		publicKey?: string;
	};
	const router = useRouter();
	let started = false;

	const isPosthogKey = (name: string) => /^(ph_|__ph|ph-identify)/.test(name);

	// Wist alle PostHog-opslag, ook die van vóór de cookiebanner.
	// Opslag kan geblokkeerd zijn (privémodus); dan gaat de rest gewoon door.
	function clearPosthogStorage() {
		for (const getStore of [() => localStorage, () => sessionStorage]) {
			try {
				const store = getStore();
				for (const key of Object.keys(store)) {
					if (isPosthogKey(key)) store.removeItem(key);
				}
			} catch {
				// opslag niet beschikbaar
			}
		}
		// PostHog zet cookies ook op het hoofddomein (.loanlink.nl), ook vanaf
		// een subdomein. Wis daarom op host én hoofddomein.
		const host = window.location.hostname;
		const parent = host.split(".").slice(-2).join(".");
		for (const cookie of document.cookie.split(";")) {
			const name = cookie.split("=")[0]?.trim();
			if (name && isPosthogKey(name)) {
				for (const domain of ["", `; domain=.${host}`, `; domain=.${parent}`]) {
					document.cookie = `${name}=; Max-Age=0; path=/${domain}`;
				}
			}
		}
	}

	function syncAnalytics() {
		const allowed = CookieConsent.acceptedCategory("analytics");
		if (allowed && publicKey) {
			if (!started) {
				posthog.init(publicKey, {
					api_host: `${window.location.origin}/data`,
					ui_host: "https://eu.posthog.com",
					capture_pageview: false,
					capture_pageleave: true,
				});
				router.afterEach((to) => {
					if (CookieConsent.acceptedCategory("analytics")) {
						posthog.capture("$pageview", { current_url: to.fullPath });
					}
				});
				started = true;
				posthog.capture("$pageview");
			}
		} else if (!allowed) {
			if (started) {
				// Toestemming ingetrokken: eerst PostHog stilzetten, zodat er bij
				// het herladen geen pageleave meer gaat en niets wordt teruggeschreven.
				posthog.set_config({ disable_persistence: true, capture_pageleave: false });
				posthog.opt_out_capturing();
			}
			clearPosthogStorage();
			if (started) window.location.reload();
		}
	}

	void CookieConsent.run({
		onConsent: syncAnalytics,
		onChange: syncAnalytics,
		guiOptions: {
			consentModal: {
				layout: "box inline",
				position: "bottom left",
				flipButtons: true,
			},
			preferencesModal: { layout: "box", flipButtons: true },
		},
		categories: {
			necessary: { enabled: true, readOnly: true },
			analytics: {
				autoClear: { cookies: [{ name: /^(ph_|__ph|ph-identify)/ }] },
			},
		},
		language: {
			default: "nl",
			translations: {
				nl: {
					consentModal: {
						title: "Cookies op loanlink.nl",
						description:
							'Met uw toestemming gebruiken we cookies om te zien hoe de site wordt gebruikt, zodat we hem kunnen verbeteren. <a href="/privacy">Privacyverklaring</a>',
						acceptAllBtn: "Alles accepteren",
						acceptNecessaryBtn: "Alleen noodzakelijk",
						showPreferencesBtn: "Zelf kiezen",
					},
					preferencesModal: {
						title: "Cookievoorkeuren",
						acceptAllBtn: "Alles accepteren",
						acceptNecessaryBtn: "Alleen noodzakelijk",
						savePreferencesBtn: "Keuze opslaan",
						closeIconLabel: "Sluiten",
						sections: [
							{
								description:
									"Kies welke cookies we mogen gebruiken. U kunt uw keuze altijd wijzigen via de link in de footer.",
							},
							{
								title: "Noodzakelijk",
								description:
									"Nodig om de site te laten werken en uw cookiekeuze te onthouden.",
								linkedCategory: "necessary",
							},
							{
								title: "Statistieken",
								description:
									"Met PostHog zien we welke pagina's worden bekeken, zodat we de site kunnen verbeteren. De gegevens blijven in de EU.",
								linkedCategory: "analytics",
							},
						],
					},
				},
			},
		},
	}).then(() => {
		// Oude PostHog-data van vóór de banner meteen wissen, ook als de
		// bezoeker nog niet gekozen heeft.
		if (!CookieConsent.acceptedCategory("analytics")) clearPosthogStorage();
	});
});
