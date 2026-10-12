<template>
	<div>
		<TheNavbar />
		<div class="mx-auto max-w-5xl px-4 py-8 flex flex-col gap-16">
			<section class="flex flex-col gap-6 max-w-2xl">
				<h1 class="text-4xl font-bold">Contact</h1>
				<p class="text-lg text-muted">
					Vragen over LoanLink, een demo of uw account? Bel of mail ons.
				</p>

				<dl class="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-2">
					<dt class="font-semibold">Telefoon</dt>
					<dd>
						<a
							:href="company.phoneHref"
							class="text-primary-600 hover:underline"
						>
							{{ company.phoneDisplay }}
						</a>
					</dd>
					<dt class="font-semibold">E-mail</dt>
					<dd>
						<a
							:href="`mailto:${company.email}`"
							class="text-primary-600 hover:underline"
						>
							{{ company.email }}
						</a>
					</dd>
					<dt class="font-semibold">Adres</dt>
					<dd>
						{{ company.legalName }}<br />
						{{ company.street }}<br />
						{{ company.postalCode }} {{ company.city }}
					</dd>
					<dt class="font-semibold">KvK</dt>
					<dd>{{ company.kvk }}</dd>
					<dt class="font-semibold">Btw</dt>
					<dd>{{ company.vat }}</dd>
				</dl>

				<p class="text-muted">
					{{ company.tradeName }} is een handelsnaam van
					{{ company.legalName }}.
				</p>
			</section>

			<TheFooter />
		</div>
	</div>
</template>

<script setup lang="ts">
useSeoMeta({
	title: "Contact",
	description: "Contactgegevens van LoanLink (CapitalManagementGroup B.V.).",
});
</script>
