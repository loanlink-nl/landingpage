<template>
	<div class="bg-gray-50 p-6 rounded-lg border">
		<div class="grid lg:grid-cols-3 items-stretch gap-8">
			<div class="flex flex-col justify-between relative">
				<h3 class="text-lg font-semibold">Opgenomen gesprek</h3>
				<AudioPlayer v-model="currentTime" />

				<div
					class="absolute start-1/2 -bottom-7 lg:start-auto lg:bottom-auto lg:-end-7 lg:top-1/2 lg:-rotate-90"
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
						@click="currentTime = segment.startTime"
					>
						<p
							:ref="
								(el: HTMLElement | null) => {
									if (el) segmentRefs[index] = el;
								}
							"
							:data-start="segment.startTime"
						>
							{{ segment.sentence }}
						</p>
					</div>
				</div>

				<div
					class="absolute start-1/2 -bottom-7 lg:start-auto lg:bottom-auto lg:-end-7 lg:top-1/2 lg:-rotate-90"
				>
					<UIcon name="i-lucide-chevron-down" class="text-lg text-muted" />
				</div>
			</div>

			<div class="relative h-80 flex flex-col">
				<h3 class="text-lg font-semibold mb-2">Samenvatting</h3>
				<!-- eslint-disable vue/no-v-html -->
				<div
					class="markdown overflow-y-auto overflow-x-hidden bg-white rounded border text-muted relative py-3 px-5"
					v-html="markdown"
				></div>
				<!-- elsint-enable -->
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { marked } from "marked";

const transcription = ref([
	{
		sentence:
			"Hey Marc, goed dat we even kunnen bellen over je hypotheek mogelijkheden. Ik zie dat je een woning op het oog hebt in Groningen. Klopt dat?",
		speaker: "S1",
		startTime: 2.85,
	},
	{
		sentence:
			"Ja precies aan de Verlengde Hereweg. Vraagprijs is € 385.000. Maar ja, ik twijfel of dat wel haalbaar is met mijn. Mijn salaris.",
		speaker: "S2",
		startTime: 10.65,
	},
	{
		sentence:
			"Snap ik. Laten we dat even doorrekenen. Je werkt als projectmanager bij dat IT bedrijf in de stad toch? Met een bruto jaarsalaris van € 52.000?",
		speaker: "S1",
		startTime: 19.38,
	},
	{
		sentence:
			"Ja klopt. En gelukkig sinds vorig jaar een vast contract, maar verder geen bijverdiensten of zo. Oh ja, en ik heb nog € 25.000 gespaard.",
		speaker: "S2",
		startTime: 29.85,
	},
	{
		sentence:
			"Oké, even rekenen, een beetje inkomen kom ik op een maximale hypotheek van ongeveer 200 € 35.000. Tel daar je spaargeld bij op, dan zit je op 200 € 60.000 totaal. Dat is helaas niet genoeg voor die woning van 385.000.",
		speaker: "S1",
		startTime: 39.27,
	},
	{
		sentence:
			"Ja, jammer, dat was ik wel een beetje bang voor ja. Zijn er misschien nog andere opties?",
		speaker: "S2",
		startTime: 58.56,
	},
	{
		sentence:
			"Koop je alleen of met een partner? En heb je al nagedacht over de bijkomende kosten?",
		speaker: "S1",
		startTime: 65.4,
	},
	{
		sentence: "Ja, ik koop alleen. Welke bijkomende kosten bedoel je?",
		speaker: "S2",
		startTime: 70.59,
	},
	{
		sentence:
			"De kosten Koper overdrachtsbelasting Notaris taxatie. Dat is ongeveer 2% van de koopsom. Dus bij een woning van 300 35.000 zou je nog eens 77 € 100 kwijt zijn. Die moet je uit eigen zak betalen. Meefinancieren kan helaas niet.",
		speaker: "S1",
		startTime: 75.15,
	},
	{
		sentence:
			"Oei ja, dan heb ik wel echt een stuk minder budget dan ik dacht.",
		speaker: "S2",
		startTime: 94.44,
	},
	{
		sentence:
			"Inderdaad, realistisch gezien zou je moeten kijken naar woningen tot maximaal € 255.000. Dan hou je nog wat spaargeld over voor de kosten koper en eventuele verbouwingen. In Groningen zijn gelukkig nog wel betaalbare woningen te vinden, vooral in wijken als Vinkhuizen of Beijum.",
		speaker: "S1",
		startTime: 98.88,
	},
	{
		sentence:
			"Mmm ja, 255.000 is echt wel flink lager. En stel stel ik vind wat voor dat bedrag, wat ga ik dan per maand betalen?",
		speaker: "S2",
		startTime: 118.77,
	},
	{
		sentence:
			"Dat hangt af van hoe lang je de rente vastzet. Voor tien jaar vast betaal je nu ongeveer 3,5% rente, voor twintig jaar vast 3,75%. 75%. Waar denk je aan?",
		speaker: "S1",
		startTime: 128.91,
	},
	{
		sentence: "Mmm, ja, ik weet het eigenlijk niet. Wat. Wat zou jij doen?",
		speaker: "S2",
		startTime: 142.23,
	},
	{
		sentence:
			"Lastig te zeggen. Het blijft koffiedik kijken. De rente is historisch gezien nog steeds redelijk laag. Veel mensen kiezen voor de zekerheid van twintig jaar vast. Zeker als je van plan bent lang in de woning te blijven. Je bent 29, dus over twintig jaar ben je 49. Waarschijnlijk zit je dan nog volop in je carrière.",
		speaker: "S1",
		startTime: 146.31,
	},
	{
		sentence:
			"Hmm, oke, nou doe maar twintig jaar vast dan. Dat lijkt me wel fijn, die zekerheid. Wat? Wat wordt mijn maandlast dan ongeveer?",
		speaker: "S2",
		startTime: 167.58,
	},
	{
		sentence:
			"Bij een hypotheek van € 230.000 met twintig jaar vast tegen 3,65% betaal je ongeveer € 1.065 bruto per maand. Na hypotheekrenteaftrek blijven er netto ongeveer € 840 van over.",
		speaker: "S1",
		startTime: 177.06,
	},
	{
		sentence:
			"Oh, nou, dat valt best mee. Ik betaal nu € 1.100 huur voor mijn appartementje aan de Korreweg.",
		speaker: "S2",
		startTime: 196.56,
	},
	{
		sentence:
			"Ja, maar vergeet niet dat je als huiseigenaar ook onderhoud moet betalen. Reken op zo'n 100 tot € 150 per maand voor onderhoud en onvoorziene kosten. In Groningen heb je vaak oudere woningen die wat meer onderhoud vragen.",
		speaker: "S1",
		startTime: 203.82,
	},
	{
		sentence:
			"Mmm ja goed punt. Uhm ja dus ik moet wel echt die maximaal 255.000 aanhouden en wat moet ik doen als ik daar wat gevonden heb?",
		speaker: "S2",
		startTime: 217.23,
	},
	{
		sentence:
			"Zodra je een bod uitbrengt geef je mij een seintje. Dan start ik de hypotheekaanvraag. Zorg dat je deze documenten alvast verzamelt. Je laatste drie loonstroken. Een werkgeversverklaring, die kun je nu al gaan aanvragen en een kopie van je paspoort. Het hele traject duurt meestal 4 tot 5 weken.",
		speaker: "S1",
		startTime: 228.48,
	},
	{
		sentence:
			"Ah oké, top. Nou helder. Dan ga ik dit weekend even op Funda kijken. En nou ja, in elk geval met een budget in mijn hoofd.",
		speaker: "S2",
		startTime: 249.09,
	},
	{
		sentence:
			"Dat lijkt me een goed plan. En Mark, nog één tip ga geen gekke dingen doen zoals een auto leasen of een nieuwe telefoon op afbetaling kopen. Dat beïnvloed je hypotheek mogelijkheden. Bel me zodra je iets gevonden hebt, dan pakken we t snel op.",
		speaker: "S1",
		startTime: 257.64,
	},
	{
		sentence: "Ah top! Dank je! Nou spreek je snel weer.",
		speaker: "S2",
		startTime: 271.98,
	},
	{
		sentence:
			"Succes met zoeken. Ik wil je zo nog even een overzicht van alle bedragen.",
		speaker: "S1",
		startTime: 275.43,
	},
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

const markdown = marked.parse(summary);

const transcriptionContainer = ref<HTMLElement | null>(null);
const segmentRefs: HTMLElement[] = [];
const currentTime = ref(0);
const currentSegmentIndex = ref(-1);

// Find the current segment based on time
const findCurrentSegment = (time: number): number => {
	for (let i = 0; i < transcription.value.length; i++) {
		const segment = transcription.value[i];
		const nextSegment = transcription.value[i + 1];
		if (segment && (!nextSegment || nextSegment.startTime > time)) {
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
