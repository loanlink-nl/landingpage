# loanlink.nl — werkafspraken voor Claude

Dit is de publieke website van LoanLink (handelsnaam van CapitalManagementGroup B.V.).
Nuxt 3, gehost op **Railway**: alles wat in `main` komt, zet Railway automatisch live.
Technische details: zie `CONTEXT.md`.

## Wie werkt hier
Niet-technische collega's (o.a. Tycho) vragen wijzigingen in gewone taal.
Gebruik dan altijd de skill **website-wijziging** (`.claude/skills/website-wijziging/`).
Praat met hen in gewone, korte Nederlandse zinnen; geen paden, commando's of logs tenzij gevraagd.

## Harde regels (website-checklist Meta / AVG / Wft)
1. **Nooit direct op `main`.** Altijd een branch + pull request; Gustaaf keurt goed.
2. **Bedrijfsgegevens** staan op één plek: `app/utils/company.ts`. Footer, /contact en /privacy lezen daaruit.
   Schrijfwijze moet gelijk blijven aan KvK-uittreksel en Meta Business Portfolio. Alleen Gustaaf besluit over wijzigingen.
3. **Geen tracking zonder toestemming.** Zonder "Accepteren" in de cookiebanner: geen cookies of browseropslag voor statistiek of marketing, en de site werkt precies hetzelfde (geen cookiewall).
   De Meta-pixel laadt alleen na toestemming, via `app/plugins/cookieconsent.client.ts` (pixel-ID uit env `META_PIXEL_ID`).
   Iets nieuws toevoegen (andere pixel, Google Analytics, Hotjar, ingesloten video/kaarten/agenda's/formulieren van derden, externe scripts of lettertypen) is een besluit voor Gustaaf; daarna banner, `REVISION` in de bannercode en privacyverklaring mee aanpassen.
   PostHog loopt cookieloos via `app/plugins/posthog.client.ts` en de proxy `server/routes/data/`; die niet terugzetten naar `nuxt-posthog`.
4. **LoanLink is software, geen adviseur.** Geen teksten die persoonlijk hypotheekadvies geven ("deze hypotheek past bij jou"),
   geen rentes of bedragen als aanbod, geen garanties of overdreven claims ("altijd de laagste rente").
   Bedragen/rentes altijd met "indicatief, geen financieel advies".
5. **Privacyverklaring** (`app/pages/privacy.vue`) bijwerken bij elke wijziging in welke gegevens de site verzamelt of met wie die gedeeld worden; datum "Laatst bijgewerkt" aanpassen.
6. **Geen placeholders**, lorem ipsum of "binnenkort" op de live site; geen links naar pagina's die niet bestaan.
7. **Geen persoonsgegevens of bedragen in URL's** (bv. `?inkomen=50000`).

## Beschermde bestanden — alleen met akkoord van Gustaaf
Niet wijzigen in een gewone websitewijziging. CODEOWNERS vraagt dan automatisch Gustaafs review; samenvoegen in `main` kan pas na een goedkeuring (branchbeveiliging):
`scripts/check-site.mjs`, `.github/`, `CLAUDE.md`, `.claude/`, `nuxt.config.ts`, `app/plugins/`, `server/`,
`app/utils/company.ts`, `package.json`, `pnpm-lock.yaml`.
Faalt een controle om iets anders dan de gevraagde inhoud: de controle níet aanpassen of versoepelen, maar het probleem in de pull request melden.

## Bewijs
Een wijziging is pas klaar als dit groen is:
- `pnpm typecheck && pnpm lint && pnpm build`
- `pnpm check:site` tegen de lokale build (zie `scripts/check-site.mjs`; zet `BASE_URL`).
  De controle zoekt zelf alle pagina's en toetst o.a. bedrijfsgegevens, verboden claims, "indicatief" bij percentages,
  cookies/opslag, verzoeken naar andere partijen, browserfouten en mobiele breedte.
- de GitHub-check **Controle website** op de pull request
Na livegang draait **Live-controle loanlink.nl** automatisch tegen de echte site.
