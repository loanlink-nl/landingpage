<template>
	<footer
		class="border-t pt-8 pb-4 grid gap-6 sm:grid-cols-3 text-sm text-muted"
	>
		<div class="flex flex-col gap-1">
			<span class="font-semibold text-default">LoanLink</span>
			<span>Handelsnaam van {{ company.legalName }}</span>
			<span>KvK {{ company.kvk }}</span>
		</div>

		<address class="not-italic flex flex-col gap-1">
			<span class="font-semibold text-default">Contact</span>
			<span>{{ company.street }}</span>
			<span>{{ company.postalCity }}</span>
			<a :href="`mailto:${company.email}`" class="hover:text-primary-500">
				{{ company.email }}
			</a>
			<a :href="`tel:${company.phoneHref}`" class="hover:text-primary-500">
				{{ company.phone }}
			</a>
		</address>

		<div class="flex flex-col gap-1">
			<span class="font-semibold text-default">Juridisch</span>
			<ULink to="/privacy" class="hover:text-primary-500">
				Privacyverklaring
			</ULink>
			<button
				type="button"
				class="text-left hover:text-primary-500 cursor-pointer"
				@click="openCookieSettings"
			>
				Cookie-instellingen
			</button>
		</div>
	</footer>
</template>

<script setup lang="ts">
import { company } from "~/utils/company";

async function openCookieSettings() {
	const CookieConsent = await import("vanilla-cookieconsent");
	CookieConsent.showPreferences();
}
</script>
