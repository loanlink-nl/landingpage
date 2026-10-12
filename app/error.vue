<template>
	<div>
		<TheNavbar />
		<div class="mx-auto max-w-5xl px-4 py-8 flex flex-col gap-16">
			<section class="flex flex-col gap-4 items-start">
				<h1 class="text-4xl font-bold">
					{{
						error?.statusCode === 404
							? "Pagina niet gevonden"
							: "Er ging iets mis"
					}}
				</h1>
				<p class="text-muted">Deze pagina bestaat niet (meer).</p>
				<UButton color="primary" @click="clearError({ redirect: '/' })">
					Naar de homepage
				</UButton>
			</section>
			<TheFooter />
		</div>
	</div>
</template>

<script setup lang="ts">
import type { NuxtError } from "#app";
defineProps<{ error: NuxtError }>();
</script>
