<template>
	<section class="flex flex-col items-center text-center">
		<h1 class="text-4xl md:text-6xl font-bold mb-4">
			{{ headline }}
		</h1>
		<p class="text-xl md:text-2xl text-muted mb-8 max-w-3xl">
			{{ subheadline }}
		</p>
		<div class="flex flex-col gap-4">
			<div class="flex flex-row gap-2">
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
		</div>
	</section>
</template>

<script setup lang="ts">
defineProps<{
	headline: string;
	subheadline: string;
	ctaGoogle: string;
	ctaText: string;
}>();
</script>
