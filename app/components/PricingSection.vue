<template>
	<section id="pricing" class="flex flex-col gap-4">
		<h2 class="text-3xl font-bold text-center">Onze Prijzen</h2>
		<span class="block text-center text-gray-500"
			>kies uit de volgende opties:</span
		>
		<div class="grid md:grid-cols-3 gap-8">
			<AppPriceCard
				title="Probeer gratis"
				price="€0"
				:features="['Eerste 10 gesprekken gratis']"
			/>

			<AppPriceCard
				title="Per gebruiker"
				price="€75"
				per="maand"
				:features="['Onbeperkt gebruik']"
			/>

			<AppPriceCard
				title="Per gesprek"
				price="€2"
				per="gesprek"
				:features="['€2 per gesprek']"
			/>
		</div>
	</section>
</template>
