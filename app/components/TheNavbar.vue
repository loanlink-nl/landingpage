<template>
	<nav class="bg-white border-b sticky top-0 z-10">
		<div class="mx-auto max-w-5xl px-4 py-2 flex items-center justify-between">
			<div class="flex gap-6">
				<ULink :to="'/'" class="flex items-center">
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
			<AppCTAS size="sm" />
		</div>
	</nav>
</template>
