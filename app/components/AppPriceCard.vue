<template>
	<div class="bg-white p-6 rounded-lg border flex flex-col">
		<h3 class="text-xl font-semibold mb-2">{{ title }}</h3>
		<p class="text-3xl font-bold mb-4">
			{{ price
			}}<span v-if="per" class="text-lg text-gray-500">/{{ per }}</span>
		</p>
		<ul class="space-y-2 flex-grow mb-6">
			<li v-for="feature in features" :key="feature" class="flex items-center">
				<UIcon name="i-heroicons-check" class="text-green-500 mr-2" />
				{{ feature }}
			</li>
		</ul>
		<UButton block to="https://app.loanlink.nl/aanmelden">{{ cta }}</UButton>
	</div>
</template>

<script setup lang="ts">
withDefaults(
	defineProps<{
		title: string;
		price: string;
		features: string[];
		per?: string;
		cta?: string;
	}>(),
	{ cta: "Begin nu Gratis", per: undefined }
);
</script>
