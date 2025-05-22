<template>
	<section id="pricing" class="mb-16 pt-16 -mt-16">
		<h2 class="text-3xl font-bold text-center mb-8">Onze Prijzen</h2>
		<div class="grid md:grid-cols-2 gap-8">
			<div class="bg-white p-6 rounded-lg border">
				<h3 class="text-xl font-semibold mb-2">Basis</h3>
				<p class="text-3xl font-bold mb-4">
					€9<span class="text-lg text-gray-500">/maand</span>
				</p>
				<ul class="mb-6 space-y-2">
					<li class="flex items-center">
						<UIcon name="i-heroicons-check" class="text-green-500 mr-2" /> 5 uur
						audio per maand
					</li>
					<li class="flex items-center">
						<UIcon name="i-heroicons-check" class="text-green-500 mr-2" />
						Standaard nauwkeurigheid
					</li>
					<li class="flex items-center">
						<UIcon name="i-heroicons-check" class="text-green-500 mr-2" /> 3
						exportformaten
					</li>
				</ul>
				<UButton block>Aan de Slag</UButton>
			</div>
			<div class="bg-primary-50 p-6 rounded-lg border border-primary-200">
				<h3 class="text-xl font-semibold mb-2">Professioneel</h3>
				<p class="text-3xl font-bold mb-4">
					€29<span class="text-lg text-gray-500">/maand</span>
				</p>
				<ul class="mb-6 space-y-2">
					<li class="flex items-center">
						<UIcon name="i-heroicons-check" class="text-green-500 mr-2" />
						20 uur audio per maand
					</li>
					<li class="flex items-center">
						<UIcon name="i-heroicons-check" class="text-green-500 mr-2" />
						Verbeterde nauwkeurigheid
					</li>
					<li class="flex items-center">
						<UIcon name="i-heroicons-check" class="text-green-500 mr-2" />
						Alle exportformaten
					</li>
					<li class="flex items-center">
						<UIcon name="i-heroicons-check" class="text-green-500 mr-2" />
						Sprekeridentificatie
					</li>
				</ul>
				<UButton block color="primary">Aan de Slag</UButton>
			</div>
		</div>
	</section>
</template>
