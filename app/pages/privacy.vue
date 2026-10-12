<template>
	<div>
		<TheNavbar />

		<div class="mx-auto max-w-3xl px-4 py-8 flex flex-col gap-8">
			<article class="flex flex-col gap-6 leading-relaxed">
				<header class="flex flex-col gap-2">
					<h1 class="text-3xl font-bold">Privacyverklaring</h1>
					<p class="text-muted">Laatst bijgewerkt: {{ lastUpdated }}</p>
				</header>

				<section class="flex flex-col gap-2">
					<h2 class="text-xl font-semibold">Wie zijn wij?</h2>
					<p>
						LoanLink is een handelsnaam van {{ company.legalName }}, de
						verantwoordelijke voor de verwerking van persoonsgegevens via deze
						website.
					</p>
					<address class="not-italic">
						{{ company.legalName }}<br />
						{{ company.street }}<br />
						{{ company.postalCity }}<br />
						KvK {{ company.kvk }}<br />
						<a :href="`mailto:${company.email}`" class="text-primary-500">
							{{ company.email }}
						</a>
						<br />
						<a :href="`tel:${company.phoneHref}`" class="text-primary-500">
							{{ company.phone }}
						</a>
					</address>
				</section>

				<section class="flex flex-col gap-2">
					<h2 class="text-xl font-semibold">Over deze verklaring</h2>
					<p>
						Deze verklaring gaat over de website loanlink.nl. Voor het gebruik
						van de LoanLink-app (app.loanlink.nl) en voor LoanLink Woonstart
						gelden aparte afspraken en verklaringen.
					</p>
				</section>

				<section class="flex flex-col gap-2">
					<h2 class="text-xl font-semibold">Welke gegevens verwerken we?</h2>
					<ul class="list-disc pl-6 flex flex-col gap-1">
						<li>
							<strong>Websitebezoek.</strong> Met het analysepakket PostHog
							meten we hoe bezoekers de website gebruiken: welke pagina's ze
							bekijken, waar ze op klikken, het type apparaat en browser, en een
							van het IP-adres afgeleide globale locatie. PostHog geeft uw
							browser daarvoor een willekeurige bezoekers-ID.
						</li>
						<li>
							<strong>Contact.</strong> Als u ons mailt of belt, verwerken we
							uw naam, contactgegevens en de inhoud van uw bericht.
						</li>
					</ul>
				</section>

				<section class="flex flex-col gap-2">
					<h2 class="text-xl font-semibold">Waarvoor en op welke grondslag?</h2>
					<ul class="list-disc pl-6 flex flex-col gap-1">
						<li>
							Websitebezoek: om de website en ons aanbod te verbeteren. Dit doen
							we op basis van ons gerechtvaardigd belang.
						</li>
						<li>
							Contact: om uw vraag te beantwoorden. Dit doen we op basis van ons
							gerechtvaardigd belang, of om een overeenkomst met u voor te
							bereiden.
						</li>
					</ul>
					<p>
						We verkopen geen persoonsgegevens en gebruiken ze niet voor
						advertenties.
					</p>
				</section>

				<section class="flex flex-col gap-2">
					<h2 class="text-xl font-semibold">Cookies en vergelijkbare techniek</h2>
					<ul class="list-disc pl-6 flex flex-col gap-1">
						<li>
							<strong>PostHog</strong> plaatst een cookie en gebruikt de opslag
							in uw browser om bezoeken te herkennen.
						</li>
						<li>
							<strong>isLoggedIn</strong> is een functionele cookie van de
							LoanLink-app. De website leest die alleen uit om ingelogde
							gebruikers de knop "Ga naar de app" te tonen.
						</li>
					</ul>
				</section>

				<section class="flex flex-col gap-2">
					<h2 class="text-xl font-semibold">Wie ontvangt de gegevens?</h2>
					<p>
						PostHog verwerkt de analysegegevens namens ons op servers in de
						Europese Unie. De gegevens lopen via ons eigen domein naar PostHog.
						Verder delen we gegevens alleen als de wet dat verplicht.
					</p>
				</section>

				<section class="flex flex-col gap-2">
					<h2 class="text-xl font-semibold">Hoe lang bewaren we gegevens?</h2>
					<p>
						We bewaren gegevens niet langer dan nodig is voor het doel waarvoor
						we ze verzamelen. Contactberichten verwijderen we als ze niet meer
						nodig zijn voor de afhandeling van uw vraag of een lopende
						samenwerking.
					</p>
				</section>

				<section class="flex flex-col gap-2">
					<h2 class="text-xl font-semibold">Uw rechten</h2>
					<p>
						U kunt ons vragen om inzage, correctie, verwijdering of beperking
						van uw gegevens. U kunt ook bezwaar maken tegen de verwerking.
						Stuur daarvoor een mail naar
						<a :href="`mailto:${company.email}`" class="text-primary-500">
							{{ company.email }}</a
						>.
					</p>
					<p>
						Bent u het niet eens met hoe wij met uw gegevens omgaan, dan kunt u
						een klacht indienen bij de
						<a
							href="https://www.autoriteitpersoonsgegevens.nl"
							target="_blank"
							rel="noreferrer"
							class="text-primary-500"
							>Autoriteit Persoonsgegevens</a
						>.
					</p>
				</section>
			</article>

			<TheFooter />
		</div>
	</div>
</template>

<script setup lang="ts">
import { company } from "~/utils/company";

useSeoMeta({
	title: "Privacyverklaring",
	description: "Privacyverklaring van LoanLink (CapitalManagementGroup B.V.).",
});

const lastUpdated = "12 oktober 2026";
</script>
