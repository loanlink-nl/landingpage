<template>
	<div>
		<TheNavbar />
		<div class="mx-auto max-w-5xl px-4 py-8 flex flex-col gap-16">
			<article class="flex flex-col gap-6 max-w-3xl privacy">
				<h1 class="text-4xl font-bold">Privacyverklaring</h1>
				<p class="text-muted">Laatst bijgewerkt: {{ lastUpdated }}</p>

				<section>
					<h2>Wie zijn wij?</h2>
					<p>
						{{ company.tradeName }} is een handelsnaam van
						{{ company.legalName }}, {{ company.street }},
						{{ company.postalCode }} {{ company.city }} (KvK {{ company.kvk }}).
						Wij zijn verantwoordelijk voor de verwerking van persoonsgegevens
						via deze website. Contact:
						<a :href="`mailto:${company.email}`">{{ company.email }}</a> of
						<a :href="company.phoneHref">{{ company.phoneDisplay }}</a
						>.
					</p>
					<p>
						Deze verklaring gaat over de website loanlink.nl. Gebruiken
						hypotheekadviseurs de LoanLink-app voor gegevens van hun klanten,
						dan is de adviseur verantwoordelijk en is LoanLink verwerker. Die
						afspraken leggen we vast in een verwerkersovereenkomst; vraag die op
						via
						<a :href="`mailto:${company.email}`">{{ company.email }}</a
						>.
					</p>
				</section>

				<section>
					<h2>Welke gegevens, waarom en hoe lang?</h2>
					<table>
						<thead>
							<tr>
								<th>Gegevens</th>
								<th>Doel</th>
								<th>Grondslag</th>
								<th>Bewaartermijn</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>
									Websitebezoek: bezochte pagina's, klikken, verwijzende
									website, browser- en apparaattype. Uw IP-adres sturen we niet
									door naar onze analysedienst.
								</td>
								<td>Bezoekstatistieken om de website te verbeteren</td>
								<td>Gerechtvaardigd belang</td>
								<td>Maximaal 12 maanden</td>
							</tr>
							<tr>
								<td>
									Contact per e-mail of telefoon: naam, contactgegevens en de
									inhoud van uw bericht
								</td>
								<td>Uw vraag beantwoorden, een demo plannen</td>
								<td>Gerechtvaardigd belang</td>
								<td>Maximaal 2 jaar na het laatste contact</td>
							</tr>
							<tr>
								<td>
									Aanmelden voor de app: de gegevens die u bij aanmelding invult
								</td>
								<td>Uw account aanmaken en de dienst leveren</td>
								<td>Uitvoering van de overeenkomst</td>
								<td>
									Zolang uw account bestaat; factuurgegevens 7 jaar (wettelijke
									bewaarplicht)
								</td>
							</tr>
						</tbody>
					</table>
				</section>

				<section>
					<h2>Met wie delen we gegevens?</h2>
					<p>
						We verkopen geen gegevens. We schakelen leveranciers in die gegevens
						namens ons verwerken: PostHog (bezoekstatistieken, servers in de
						EU), Cloudflare (beveiliging en snelheid van de website; verwerkt
						daarvoor technisch uw IP-adres) en onze hosting- en
						e-mailleveranciers. Met hen hebben we verwerkersafspraken. Verwerkt
						een leverancier gegevens buiten de Europese Economische Ruimte, dan
						zorgen we voor passende waarborgen, zoals de modelcontractbepalingen
						van de Europese Commissie.
					</p>
					<p>
						We gebruiken op dit moment geen Meta-pixel en geen andere
						advertentietracking. Gaan we dat wel doen, dan vragen we eerst uw
						toestemming en passen we deze verklaring aan. Meta (Facebook,
						Instagram) noemen we dan hier als ontvanger.
					</p>
				</section>

				<section id="cookies">
					<h2>Cookies</h2>
					<p>
						Deze website plaatst geen tracking-, analyse- of marketingcookies.
						Onze bezoekstatistieken werken zonder cookies en zonder opslag in uw
						browser: we herkennen u niet bij een volgend bezoek, en we sturen
						geen cookies of IP-adres door naar onze analysedienst. Daarom vragen
						we geen toestemming via een cookiebanner.
					</p>
					<p>
						Bent u ingelogd in de LoanLink-app, dan leest de website één
						functionele cookie van de app (<code>isLoggedIn</code>) om de knop
						"Ga naar de app" te tonen. Die cookie is nodig voor die functie en
						wordt niet voor tracking gebruikt.
					</p>
				</section>

				<section>
					<h2>Uw rechten</h2>
					<p>
						U kunt ons vragen om inzage, correctie, verwijdering, beperking of
						overdracht van uw gegevens, en u kunt bezwaar maken tegen verwerking
						op basis van gerechtvaardigd belang. Mail naar
						<a :href="`mailto:${company.email}`">{{ company.email }}</a
						>; we reageren binnen een maand.
					</p>
					<p>
						Bent u niet tevreden over hoe wij met uw gegevens omgaan, dan kunt u
						een klacht indienen bij de
						<a
							href="https://autoriteitpersoonsgegevens.nl"
							target="_blank"
							rel="noopener"
						>
							Autoriteit Persoonsgegevens</a
						>.
					</p>
				</section>

				<section>
					<h2>Beveiliging</h2>
					<p>
						De website werkt alleen via een versleutelde verbinding (HTTPS).
						Toegang tot gegevens is beperkt tot medewerkers die die toegang
						nodig hebben.
					</p>
				</section>

				<section>
					<h2>Wijzigingen</h2>
					<p>
						We passen deze verklaring aan als onze verwerkingen veranderen.
						Bovenaan staat de datum van de laatste wijziging.
					</p>
				</section>
			</article>

			<TheFooter />
		</div>
	</div>
</template>

<script setup lang="ts">
const lastUpdated = "12 oktober 2026";

useSeoMeta({
	title: "Privacyverklaring",
	description:
		"Hoe LoanLink omgaat met persoonsgegevens en cookies op loanlink.nl.",
});
</script>

<style scoped>
.privacy h2 {
	font-size: 1.5rem;
	font-weight: 700;
	margin-bottom: 0.5rem;
}
.privacy p {
	margin-bottom: 0.75rem;
}
.privacy a {
	color: var(--ui-primary);
	text-decoration: underline;
}
.privacy table {
	width: 100%;
	border-collapse: collapse;
	font-size: 0.9rem;
	display: block;
	overflow-x: auto;
}
.privacy th,
.privacy td {
	border: 1px solid var(--color-gray-200);
	padding: 0.5rem;
	text-align: left;
	vertical-align: top;
}
.privacy th {
	background: var(--color-gray-50);
}
</style>
