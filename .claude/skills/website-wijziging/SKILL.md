---
name: website-wijziging
description: Voert een gevraagde wijziging aan loanlink.nl uit voor een niet-technische collega — van verzoek in gewone taal tot pull request met proefcontrole. Gebruik bij "pas de website aan", "zet ... op de site", "verander de tekst", "nieuwe pagina", "klopt dit op de website".
---

# Website-wijziging (loanlink.nl)

De vrager is niet technisch. Jij doet alle techniek; de vrager beslist alleen over inhoud.
Lees eerst `CLAUDE.md` in deze repo — de harde regels daar gaan altijd voor.

## 1. Begrijp het verzoek
- Vat in één zin samen wat er op de site verandert, zoals een bezoeker het ziet.
- Ontbreekt iets wat je echt nodig hebt (exacte tekst, welk nummer, welke pagina)? Stel één korte vraag. Anders niet vragen.

## 2. Toets aan de regels vóór je bouwt
Stop en leg het voor aan Gustaaf (niet zelf beslissen) als het verzoek:
- tracking, cookies, een pixel of een externe dienst toevoegt;
- bedrijfsgegevens wijzigt (naam, adres, KvK, btw, telefoon, e-mail);
- tekst bevat die als persoonlijk advies, rente-aanbod, garantie of "laagste rente" leest;
- rentes, maandlasten of bedragen toont (mag alleen als indicatie, met "indicatief, geen financieel advies");
- reviews, testimonials of klantcitaten toevoegt (alleen echte, met toestemming);
- LoanLink vergelijkt met concurrenten;
- foto's van personen toevoegt (toestemming van die persoon nodig);
- om persoonsgegevens vraagt via een formulier, of iets van een andere partij insluit (video, kaart, agenda, formulier, chat);
- een bestand uit de lijst "Beschermde bestanden" in `CLAUDE.md` moet wijzigen.
Zeg dan in gewone taal waarom, en wat wel kan.

## 3. Bouw
- Nieuwe branch vanaf de laatste `main`, naam `wijziging/<kort-onderwerp>`.
- Pas alleen aan wat nodig is. Bedrijfsgegevens alleen in `app/utils/company.ts`.
- Verandert wat de site verzamelt of deelt → werk `app/pages/privacy.vue` bij.

## 4. Bewijs
Draai en laat alles groen worden. Herstel alleen je eigen inhoudswijziging; faalt een controle om iets anders,
pas dan de controle níet aan maar meld het in de pull request.
1. `pnpm install --frozen-lockfile` en (eenmalig) `pnpm exec playwright install chromium`; controleer dat `bun` er is
2. `pnpm typecheck && pnpm lint`
3. `SITE_URL=http://localhost:3000 POSTHOG_API_KEY=phc_test META_PIXEL_ID=000000000000000 pnpm build`
4. Start de build (`PORT=3000 bun .output/server/index.mjs &`) en draai `BASE_URL=http://localhost:3000 EXPECT_ANALYTICS=1 EXPECT_PIXEL=1 pnpm check:site`
5. Maak een schermafbeelding (desktop én mobiel, 375px breed) van elke gewijzigde pagina en bekijk die zelf: ziet het eruit zoals gevraagd?

## 5. Pull request
- Push de branch en open een pull request naar `main`.
- Titel: wat de bezoeker ziet veranderen.
- Beschrijving in gewone taal: wat er veranderd is, op welke pagina's, welke controles groen zijn, en wat Gustaaf nog moet beslissen (of "niets").
- Nooit zelf mergen. Gustaaf keurt goed; daarna zet Railway het automatisch live en draait de live-controle.

## 6. Terugmelden aan de vrager
Kort, gewone taal, geen techniek:
- Wat er verandert op de site.
- "Gustaaf moet het nog goedkeuren; daarna staat het binnen een paar minuten live."
- Eventuele open vraag.
