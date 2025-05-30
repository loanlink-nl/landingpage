<template>
	<nav class="bg-white border-b sticky top-0 z-10">
		<div class="mx-auto max-w-5xl px-4 py-2 flex items-center justify-between">
			<div class="flex gap-6">
				<ULink :to="'/'" class="flex items-center" :exact>
					<img src="/loanlink.svg" alt="LoanLink Logo" class="h-10" />
				</ULink>
				<div class="hidden md:flex gap-6 self-center">
					<a href="#features" class="text-muted hover:text-primary-500">
						Features
					</a>
					<a href="#over-ons" class="text-muted hover:text-primary-500">
						Over ons
					</a>
					<a href="#prijzen" class="text-muted hover:text-primary-500">
						Prijzen
					</a>
				</div>
			</div>
			<div class="flex flex-row gap-2">
				<UButton
					size="sm"
					color="neutral"
					variant="outline"
					icon="logos:google-icon"
				>
					{{ ctaGoogle }}
				</UButton>
				<UButton size="sm" color="primary" trailing-icon="i-lucide-arrow-right">
					{{ ctaText }}
				</UButton>
			</div>
		</div>
	</nav>
</template>

<script setup lang="ts">
defineProps<{
	ctaGoogle: string;
	ctaText: string;
}>();
</script>
