<template>
	<div class="flex flex-row gap-2">
		<!-- <UButton :size color="neutral" variant="outline" icon="logos:google-icon"> -->
		<!-- 	{{ ctaGoogle }} -->
		<!-- </UButton> -->
		<UButton
			:size
			to="https://app.loanlink.nl/aanmelden"
			color="primary"
			trailing-icon="i-lucide-arrow-right"
		>
			{{ ctaText }}
		</UButton>
	</div>
</template>

<script setup lang="ts">
defineProps<{
	size?: "xs" | "sm" | "md" | "lg" | "xl";
}>();

// const ctaGoogle = "Begin met Google";
const ctaText = "Krijg 10 gesprekken gratis";
</script>
