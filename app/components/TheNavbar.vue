<template>
	<nav class="bg-white border-b sticky top-0 z-10">
		<div class="mx-auto max-w-5xl px-4 py-2 flex items-center justify-between">
			<div class="flex gap-6">
				<ULink :to="'/'" class="flex items-center">
					<img src="/loanlink.svg" alt="LoanLink Logo" class="h-10" />
				</ULink>
				<div class="hidden md:flex gap-6 self-center">
					<a
						:href="`${anchorBase}#features`"
						class="text-muted hover:text-primary-500"
					>
						Features
					</a>
					<a
						:href="`${anchorBase}#over-ons`"
						class="text-muted hover:text-primary-500"
					>
						Over ons
					</a>
					<a
						:href="`${anchorBase}#prijzen`"
						class="text-muted hover:text-primary-500"
					>
						Prijzen
					</a>
				</div>
			</div>
			<div class="flex items-center gap-2">
				<UDropdownMenu :items="menuItems" class="md:hidden">
					<UButton
						icon="i-lucide-menu"
						color="neutral"
						variant="ghost"
						size="sm"
						aria-label="Menu"
					/>
				</UDropdownMenu>
				<AppCTAS v-if="!isLoggedIn" size="sm" />
				<UButton
					v-else
					size="sm"
					to="https://app.loanlink.nl"
					color="primary"
					trailing-icon="i-lucide-arrow-right"
				>
					Ga naar de app
				</UButton>
			</div>
		</div>
	</nav>
</template>

<script setup lang="ts">
const isLoggedIn = useCookie("isLoggedIn");
// Op subpagina's (contact, privacy) moeten de ankers naar de homepage wijzen.
const route = useRoute();
const anchorBase = computed(() => (route.path === "/" ? "" : "/"));
// Mobiel menu (de tekstlinks hierboven zijn alleen vanaf md zichtbaar).
const menuItems = [
	{ label: "Features", to: "/#features" },
	{ label: "Over ons", to: "/#over-ons" },
	{ label: "Prijzen", to: "/#prijzen" },
	{ label: "Contact", to: "/contact" },
];
</script>
