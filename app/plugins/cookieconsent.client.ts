import "vanilla-cookieconsent/dist/cookieconsent.css";
import * as CookieConsent from "vanilla-cookieconsent";

/**
 * Cookiebanner (Telecommunicatiewet art. 11.7a / AVG).
 *
 * Eén keuze: "Alleen noodzakelijk" of "Accepteren". Accepteren = de Meta-pixel
 * mag laden (cookies van advertentiepartners). Zonder toestemming laadt er niets
 * van Meta. PostHog is cookieloos en valt hier niet onder (posthog.client.ts).
 *
 * Pixel-ID komt uit runtimeConfig.public.metaPixelId: env META_PIXEL_ID bij de
 * build, of NUXT_PUBLIC_META_PIXEL_ID tijdens het draaien. Leeg = geen pixel.
 *
 * Bekende beperking van de controle (scripts/check-site.mjs): op localhost kan
 * het wissen van cookies op het hoofddomein (.loanlink.nl) niet getoetst worden.
 *
 * Verandert er iets aan wat er na toestemming laadt? Verhoog dan REVISION,
 * zodat elke bezoeker opnieuw gevraagd wordt.
 */
const REVISION = 1;
const ADS = "advertenties";
const isMetaCookie = (name: string) => /^_fb[pc]$/.test(name);

export default defineNuxtPlugin(() => {
	const { metaPixelId } = useRuntimeConfig().public as { metaPixelId?: string };
	const router = useRouter();
	let pixelLoaded = false;

	function loadPixel() {
		if (pixelLoaded || !metaPixelId) return;
		pixelLoaded = true;
		// Officiële Meta-pixelcode, alleen na toestemming geladen.
		type Fbq = ((...args: unknown[]) => void) & {
			callMethod?: (...args: unknown[]) => void;
			queue: unknown[][];
			push: Fbq;
			loaded: boolean;
			version: string;
		};
		const w = window as unknown as { fbq?: Fbq; _fbq?: Fbq };
		if (!w.fbq) {
			const fbq = function (...args: unknown[]) {
				if (fbq.callMethod) fbq.callMethod(...args);
				else fbq.queue.push(args);
			} as Fbq;
			fbq.push = fbq;
			fbq.loaded = true;
			fbq.version = "2.0";
			fbq.queue = [];
			w.fbq = fbq;
			w._fbq = fbq;
			const script = document.createElement("script");
			script.async = true;
			script.src = "https://connect.facebook.net/en_US/fbevents.js";
			document.head.appendChild(script);
		}
		const fbq = w.fbq!;
		// Geen automatische knop-/formulierdetectie; alleen paginabezoeken.
		fbq("set", "autoConfig", false, metaPixelId);
		fbq("init", metaPixelId);
		fbq("track", "PageView");
		// Eén PageView per pagina: de eerste router-navigatie van Nuxt (zelfde pad)
		// niet nog eens tellen.
		let lastPath = window.location.pathname;
		router.afterEach((to) => {
			if (to.path === lastPath) return;
			lastPath = to.path;
			if (CookieConsent.acceptedCategory(ADS)) fbq("track", "PageView");
		});
	}

	// Wist cookies van Meta (op host én hoofddomein) en de pixel uit deze sessie.
	function clearAds() {
		const host = window.location.hostname;
		const parent = host.split(".").slice(-2).join(".");
		for (const cookie of document.cookie.split(";")) {
			const name = cookie.split("=")[0]?.trim();
			if (name && isMetaCookie(name)) {
				for (const domain of ["", `; domain=.${host}`, `; domain=.${parent}`]) {
					document.cookie = `${name}=; Max-Age=0; path=/${domain}`;
				}
			}
		}
	}

	function sync({ changed }: { changed: boolean }) {
		if (CookieConsent.acceptedCategory(ADS)) {
			loadPixel();
		} else {
			clearAds();
			// Pixel draaide al in deze pagina: herladen zodat hij echt weg is.
			if (changed && pixelLoaded) window.location.reload();
		}
	}

	void CookieConsent.run({
		revision: REVISION,
		onConsent: () => sync({ changed: false }),
		onChange: () => sync({ changed: true }),
		guiOptions: {
			consentModal: {
				layout: "box inline",
				position: "bottom left",
				flipButtons: true,
				equalWeightButtons: true,
			},
		},
		categories: {
			necessary: { enabled: true, readOnly: true },
			[ADS]: {
				autoClear: { cookies: [{ name: /^_fb[pc]$/ }] },
			},
		},
		language: {
			default: "nl",
			translations: {
				nl: {
					consentModal: {
						title: "Helpt u ons ontdekken welke campagnes werken?",
						description:
							'Met uw toestemming gebruiken we hiervoor cookies van advertentiepartners. <a href="/privacy#cookies">Privacyverklaring</a>',
						acceptAllBtn: "Accepteren",
						acceptNecessaryBtn: "Alleen noodzakelijk",
					},
					preferencesModal: { sections: [] },
				},
			},
		},
	}).then(() => {
		// Oude Meta-cookies zonder toestemming meteen opruimen.
		if (!CookieConsent.acceptedCategory(ADS)) clearAds();
	});
});
