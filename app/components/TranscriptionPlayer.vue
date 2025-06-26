<template>
	<div class="bg-gray-50 p-6 rounded-lg border">
		<div class="grid md:grid-cols-3 items-stretch gap-8">
			<div class="flex flex-col justify-between relative">
				<h3 class="text-lg font-semibold">Opgenomen gesprek</h3>
				<AudioPlayer v-model="currentTime" />

				<div
					class="absolute start-1/2 -bottom-7 md:start-auto md:bottom-auto md:-end-7 md:top-1/2 md:-rotate-90"
				>
					<UIcon name="i-lucide-chevron-down" class="text-lg text-muted" />
				</div>
			</div>

			<div class="relative h-80 flex flex-col">
				<h3 class="text-lg font-semibold">Transcriptie</h3>
				<span class="text-sm block text-muted mb-2">
					klik op een regel om naar dat deel van de audio te springen
				</span>
				<div
					ref="transcriptionContainer"
					class="overflow-y-auto rounded border text-muted relative"
					style="scroll-padding-top: 16px"
				>
					<div
						v-for="(segment, index) in transcription"
						:key="index"
						class="bg-muted odd:bg-white py-3 px-5 cursor-pointer"
						:class="{
							'text-primary-700 bg-primary-50 rounded':
								currentSegmentIndex === index,
						}"
						@click="currentTime = segment.start"
					>
						<p
							:ref="
								(el: HTMLElement | null) => {
									if (el) segmentRefs[index] = el;
								}
							"
							:data-start="segment.start"
							:data-end="segment.end"
						>
							{{ segment.text }}
						</p>
					</div>
				</div>

				<div
					class="absolute start-1/2 -bottom-7 md:start-auto md:bottom-auto md:-end-7 md:top-1/2 md:-rotate-90"
				>
					<UIcon name="i-lucide-chevron-down" class="text-lg text-muted" />
				</div>
			</div>

			<div class="relative h-80 flex flex-col">
				<h3 class="text-lg font-semibold mb-2">Samenvatting</h3>
                <!-- eslint-disable-next-line vue/no-v-html -->
                <div 
					class="markdown overflow-y-auto bg-white rounded border text-muted relative py-3 px-5"
                    v-html="htmlSanitized"></div>
            </div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { asyncComputed } from "@vueuse/core";

const transcription = ref([
	{
		start: 7,
		end: 10,
		text: "In deze aflevering van Woningmarkt TV praat ik nog een keer met Jeroen Verbeek.",
	},
	{
		start: 10,
		end: 17,
		text: "Hij is financieel adviseur en ik praat met hem over de NHG, want de laatste tijd hoor je daar steeds meer nieuwsberichten over.",
	},
	{ start: 17, end: 20, text: "Maar Jeroen en NHG, wat is dat eigenlijk?" },
	{
		start: 20,
		end: 28,
		text: "De NHG staat voor Nationale Hypotheekgarantie en die staat borg voor je als je gedwongen moet verkopen.",
	},
	{
		start: 28,
		end: 33,
		text: "Als je je huis gedwongen moet verkopen als gevolg van bijvoorbeeld echtscheiding of werkeloosheid of arbeidsongeschiktheid.",
	},
	{
		start: 33,
		end: 42,
		text: "Als je hypotheek dan hoger is dan de verkoopprijs van je huis, dus je hebt een verlies, dan wordt dat verlies betaald door de NHG.",
	},
	{ start: 42, end: 43, text: "Aan de bank." },
	{ start: 43, end: 44, text: "Aan de bank dus eigenlijk." },
	{
		start: 44,
		end: 50,
		text: "Als je een hypotheek met NHG hebt, dan loopt de bank niet zoveel risico.",
	},
	{ start: 50, end: 51, text: "Geen enkel risico zelfs." },
	{
		start: 51,
		end: 54,
		text: "En dat belonen ze met een korting op de rente.",
	},
	{
		start: 54,
		end: 57,
		text: "Dus als ik een NHG hypotheek heb, betaal ik minder rente dan iemand zonder.",
	},
	{ start: 57, end: 59, text: "En dat geeft helemaal juist." },
	{ start: 59, end: 61, text: "Dus dat is wel een voordeel als ik dat heb." },
	{ start: 61, end: 62, text: "Een heel groot voordeel." },
	{
		start: 62,
		end: 70,
		text: "Plus die garantie natuurlijk achter je dat als je in betalingsproblemen komt en gedwongen moet verkopen, dat je dan uit het brand bent.",
	},
	{ start: 70, end: 72, text: "Ja." },
	{
		start: 72,
		end: 75,
		text: "Nou hoor je de laatste tijd dat er iets gaat veranderen.",
	},
	{ start: 75, end: 76, text: "Ik hoor verschillende bedragen." },
	{ start: 76, end: 79, text: "265.350." },
	{ start: 79, end: 81, text: "Vertel eens, hoe zit dat?" },
	{
		start: 81,
		end: 88,
		text: "Tot 1 januari 2012 is een hypotheek met NHG te krijgen tot € 350.000.",
	},
	{
		start: 88,
		end: 96,
		text: "Dat betekent dat je een woning kunt kopen met een hypotheek met NHG van maximaal € 324.000.",
	},
	{ start: 96, end: 97, text: "Kosten koper." },
	{
		start: 97,
		end: 102,
		text: "Vanaf 2012 is die tijdelijke verhoging die eindigt.",
	},
	{
		start: 102,
		end: 109,
		text: "Dan is de hypotheek grens voor leningen met nog IS nog maar € 265.000.",
	},
	{
		start: 109,
		end: 118,
		text: "En dat betekent dat je nog maar een woning met een hypotheek met NHG kunt kopen voor € 245.000.",
	},
	{
		start: 118,
		end: 134,
		text: "En Maar als als ik jou goed begrijp, dan betekent dat dus dat vanaf 1 januari ik met die rente, korting en de zekerheid dat ik niet met een restschuld blijft zitten als er alsmaar iets gebeurt, dat ik dan een maximaal huis wat ik nu kan kopen tot 324 nul.",
	},
	{
		start: 134,
		end: 138,
		text: "Dat dat na 1 januari wordt verlaagd naar een maximumbedrag van 245.000.",
	},
	{
		start: 138,
		end: 140,
		text: "Helemaal juist Ja, dat is wel een heel groot verschil.",
	},
	{
		start: 140,
		end: 150,
		text: "En ik kan me nu ook beter beter begrijpen waarom er zoveel commotie over is in de media en dat we eigenlijk met z'n allen hopen dat die tijdelijke verhoging nog een poosje doorgezet wordt.",
	},
	{
		start: 150,
		end: 151,
		text: "Dat zou wel heel goed zijn voor de woningmarkt.",
	},
	{ start: 151, end: 153, text: "Ja, ja." },
	{
		start: 153,
		end: 156,
		text: "Nou ja, laten we afwachten wat in ieder geval daarmee gaat gebeuren.",
	},
	{ start: 156, end: 160, text: "Ja, dank je." },
]);

const summary = `# Klantsituatie en Woonwens
- **Klant:** Marc (S2), een alleenstaande koper.
- **Woonwens:** Een woning aan de Verlengde Hereweg in Groningen met een vraagprijs van € 385.000.
- **Zorg:** De klant twijfelt of de gewenste woning financieel haalbaar is.

# Financiële Analyse en Maximale Hypotheek
- **Inkomen:** Bruto jaarsalaris van € 52.000 uit een vast contract als projectmanager, zonder bijverdiensten.
- **Eigen middelen:** € 25.000 spaargeld.
- **Maximale hypotheek:** Op basis van het inkomen berekend op circa € 235.000.
- **Totaal beschikbaar vermogen:** € 260.000 (maximale hypotheek + spaargeld).
- **Conclusie:** De gewenste woning van € 385.000 is financieel niet haalbaar.

# Bijkomende Kosten en Realistisch Budget
- **Kosten Koper (k.k.):** De adviseur (S1) licht toe dat er bijkomende kosten zijn (overdrachtsbelasting, notaris, taxatie) van ongeveer 2% van de koopsom.
  - Deze kosten kunnen niet worden meegefinancierd en moeten uit eigen middelen worden betaald.
- **Realistisch aankoopbudget:** De adviseur stelt een maximaal aankoopbudget van € 255.000 voor.
  - Dit budget biedt voldoende ruimte om de Kosten Koper te dekken en een buffer over te houden voor eventuele verbouwingen.
- **Woningmarkt Groningen:** De adviseur merkt op dat er in dit segment nog woningen te vinden zijn in wijken als Vinkhuizen en Beijum.

# Renteopties en Indicatie Maandlasten
- **Renteopties besproken:**
  - 10 jaar vast: ca. 3,5%
  - 20 jaar vast: ca. 3,75%
- **Beslissing klant:** De klant kiest voor de zekerheid van een rentevaste periode van 20 jaar.
- **Rekenvoorbeeld maandlasten (op basis van een hypotheek van € 230.000 en 20 jaar vast tegen 3,65%):**
  - **Bruto:** ca. € 1.065 per maand.
  - **Netto:** ca. € 840 per maand (na hypotheekrenteaftrek).
- **Extra kosten:** De adviseur benadrukt dat de klant als huiseigenaar rekening moet houden met onderhoudskosten van circa € 100 - € 150 per maand.

# Vervolgstappen
- **Marc (klant):**
  - Gaat op zoek naar een woning met een maximaal aankoopbudget van € 255.000.
  - Verzamelt de benodigde documenten voor de hypotheekaanvraag:
    - Laatste drie loonstroken
    - Werkgeversverklaring (advies is deze nu al aan te vragen)
    - Kopie paspoort
  - Neemt contact op met de adviseur zodra hij een bod wil uitbrengen.
  - Gaat geen nieuwe financiële verplichtingen aan (zoals een leaseauto of lening) die de leencapaciteit kunnen beïnvloeden.
- **Hypotheekadviseur (S1):**
  - Stuurt de klant een e-mail met een overzicht van de besproken bedragen.
  - Start de hypotheekaanvraag (trajectduur ca. 4-5 weken) zodra de klant een geschikte woning heeft gevonden en een seintje geeft.`;

const htmlSanitized = asyncComputed(async () => {
	const markdown = await marked.parse(summary);

	const res = DOMPurify.sanitize(markdown);

	return res;
}, "");

const transcriptionContainer = ref<HTMLElement | null>(null);
const segmentRefs: HTMLElement[] = [];
const currentTime = ref(0);
const currentSegmentIndex = ref(-1);

// Find the current segment based on time
const findCurrentSegment = (time: number): number => {
	for (let i = 0; i < transcription.value.length; i++) {
		const segment = transcription.value[i];
		if (segment && time >= segment.start && time < segment.end) {
			return i;
		}
	}
	return -1;
};

watch(currentTime, (time) => {
	const newSegmentIndex = findCurrentSegment(time);
	if (newSegmentIndex !== currentSegmentIndex.value) {
		currentSegmentIndex.value = newSegmentIndex;
	}
});

// Scroll to the active segment when it changes
// watch(currentSegmentIndex, (newIndex) => {
// 	if (newIndex >= 0) {
// 		console.log(newIndex);
//
// 		// // Use a more direct approach with scrollIntoView
// 		// setTimeout(() => {
// 		// 	if (segmentRefs[newIndex]) {
// 		// 		segmentRefs[newIndex].scrollIntoView({
// 		// 			behavior: 'smooth',
// 		// 			block: 'start',
// 		// 			inline: 'nearest'
// 		// 		});
// 		// 	}
// 		// }, 50);
// 	}
// });
</script>

<style scoped>
/* Custom scrollbar for the transcription container */
.overflow-y-auto::-webkit-scrollbar {
	width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
	background: #f1f1f1;
	border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
	background: #ccc;
	border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
	background: #aaa;
}
</style>
