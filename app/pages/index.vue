<template>
	<div>
		<!-- Navbar -->
		<nav class="bg-white border-b sticky top-0 z-10">
			<div
				class="mx-auto max-w-5xl px-4 py-2 flex items-center justify-between"
			>
				<div class="flex gap-6">
					<a href="/" class="flex items-center">
						<img src="/loanlink.svg" alt="LoanLink Logo" class="h-10" />
					</a>
					<div class="hidden md:flex gap-6 self-center">
						<a href="#features" class="text-gray-600 hover:text-primary-500">
							Features
						</a>
						<a href="#pricing" class="text-gray-600 hover:text-primary-500">
							Tarieven
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
					<UButton
						size="sm"
						color="primary"
						trailing-icon="i-lucide-arrow-right"
					>
						{{ ctaText }}
					</UButton>
				</div>
			</div>
		</nav>

		<div class="mx-auto max-w-5xl px-4 py-8">
			<section class="flex flex-col items-center text-center mb-16 pt-8">
				<h1 class="text-4xl md:text-6xl font-bold mb-4">
					{{ headline }}
				</h1>
				<p class="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl">
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
						<UButton
							size="lg"
							color="primary"
							trailing-icon="i-lucide-arrow-right"
						>
							{{ ctaText }}
						</UButton>
					</div>
				</div>
			</section>

			<span class="block text-center text-gray-500">
				of kijk hier hoe het werkt:
			</span>

			<section id="transcription-demo" class="mb-16 pt-4">
				<TranscriptionPlayer />
			</section>

			<section id="features" class="mb-16 pt-16 -mt-16">
				<h2 class="text-3xl font-bold text-center mb-8">
					Waarom transcriberen met LoanLink?
				</h2>
				<div class="grid md:grid-cols-3 gap-8">
					<div class="bg-white p-6 rounded-lg border">
						<UIcon
							name="i-heroicons-check-badge"
							class="text-primary-500 text-3xl mb-4"
						/>
						<h3 class="text-xl font-semibold mb-2">Nauwkeurig</h3>
						<p>
							Omdat we speciaal ontwikkellen voor hypotheekadviseurs zijn we de
							beste in
						</p>
					</div>
					<div class="bg-white p-6 rounded-lg border">
						<UIcon
							name="i-heroicons-clock"
							class="text-primary-500 text-3xl mb-4"
						/>
						<h3 class="text-xl font-semibold mb-2">Razendsnel</h3>
						<p>
							Transcribeer uren audio in minuten met onze hoogwaardige
							verwerkingsengine.
						</p>
					</div>
					<div class="bg-white p-6 rounded-lg border">
						<UIcon
							name="i-heroicons-lock-closed"
							class="text-primary-500 text-3xl mb-4"
						/>
						<h3 class="text-xl font-semibold mb-2">Veilig & Privé</h3>
						<p>
							Onze dataverwerkers zijn ISO 27001 gecertificeerd en trainen
							<strong>nooit</strong>
							op jouw data.
						</p>
					</div>
				</div>
			</section>

			<PricingSection />

			<section class="bg-primary-50 p-8 rounded-lg text-center">
				<h2 class="text-3xl font-bold mb-4">Klaar om te Beginnen?</h2>
				<p class="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
					Probeer LoanLink gratis uit en ontdek hoe makkelijk je jouw gesprekken
					vast kan leggen.
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
					<UButton
						size="lg"
						color="primary"
						trailing-icon="i-lucide-arrow-right"
					>
						{{ ctaText }}
					</UButton>
				</div>
			</section>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import TranscriptionPlayer from "../components/TranscriptionPlayer.vue";

const headline = "Minder typen, beter adviseren";
const subheadline = "Snel en nauwkeurig al je adviesgesprekken vastleggen.";

const ctaGoogle = "Begin met Google";
const ctaText = "Krijg 10 gesprekken gratis";

// Handle smooth scrolling for anchor links
onMounted(() => {
	document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
		anchor.addEventListener(
			"click",
			function (this: HTMLAnchorElement, e: Event) {
				e.preventDefault();

				const targetId = this.getAttribute("href");
				if (!targetId) return;

				const targetElement = document.querySelector(targetId) as HTMLElement;
				if (!targetElement) return;

				// Custom smooth scroll with faster animation
				const start = window.pageYOffset;
				const target = targetElement.offsetTop - 80; // Offset for navbar height
				const distance = target - start;
				const duration = 150; // Ultra-fast duration (150ms)
				let startTime: number | null = null;

				function animation(currentTime: number) {
					if (startTime === null) startTime = currentTime;
					const timeElapsed = currentTime - startTime;
					const progress = Math.min(timeElapsed / duration, 1);
					const ease = (t: number) =>
						t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // Ease in-out quadratic

					window.scrollTo(0, start + distance * ease(progress));

					if (timeElapsed < duration) {
						requestAnimationFrame(animation);
					}
				}

				requestAnimationFrame(animation);
			}
		);
	});
});
</script>
