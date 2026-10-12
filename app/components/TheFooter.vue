<template>
	<footer class="border-t pt-8 pb-4 text-sm text-muted flex flex-col gap-6">
		<div class="grid gap-6 sm:grid-cols-3">
			<div class="flex flex-col gap-1">
				<img src="/loanlink.svg" alt="LoanLink" class="h-8 w-fit mb-2" />
				<span>
					{{ company.tradeName }} is een handelsnaam van {{ company.legalName }}
				</span>
			</div>

			<address class="not-italic flex flex-col gap-1">
				<span class="font-semibold text-default">{{ company.legalName }}</span>
				<span>{{ company.street }}</span>
				<span>{{ company.postalCode }} {{ company.city }}</span>
				<a :href="company.phoneHref" class="hover:text-primary-500">
					{{ company.phoneDisplay }}
				</a>
				<a :href="`mailto:${company.email}`" class="hover:text-primary-500">
					{{ company.email }}
				</a>
				<span>KvK {{ company.kvk }}</span>
				<span>Btw {{ company.vat }}</span>
			</address>

			<nav class="flex flex-col gap-1" aria-label="Footer">
				<NuxtLink to="/contact" class="hover:text-primary-500"
					>Contact</NuxtLink
				>
				<NuxtLink to="/privacy" class="hover:text-primary-500">
					Privacyverklaring
				</NuxtLink>
				<NuxtLink to="/privacy#cookies" class="hover:text-primary-500">
					Cookies
				</NuxtLink>
			</nav>
		</div>

		<p class="text-xs">
			LoanLink is software voor hypotheekadviseurs. LoanLink geeft zelf geen
			hypotheekadvies en bemiddelt niet in hypotheken. Bedragen en rentes op
			deze website zijn indicatief en geen financieel advies.
		</p>
	</footer>
</template>
