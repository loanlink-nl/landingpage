<template>
	<section class="bg-primary-50 p-8 rounded-lg text-center">
		<h2 class="text-3xl font-bold mb-4">Klaar om te Beginnen?</h2>
		<p class="text-xl text-muted mb-6 max-w-2xl mx-auto">
			Probeer AdviesIntake gratis uit en ontdek hoe makkelijk je jouw gesprekken
			kan vastleggen.
		</p>
		<div class="flex flex-row justify-center gap-2">
			<UButton
				size="lg"
				color="neutral"
				variant="outline"
				icon="logos:google-icon"
			>
				{{ ctaGoogle }}
			</UButton>
			<UButton size="lg" color="primary" trailing-icon="i-lucide-arrow-right">
				{{ ctaText }}
			</UButton>
		</div>
	</section>
</template>

<script setup lang="ts">
defineProps<{
	ctaGoogle: string;
	ctaText: string;
}>();
</script>
