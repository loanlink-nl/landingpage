<template>
	<div>
		<TheNavbar :cta-google :cta-text />

		<div class="mx-auto max-w-5xl px-4 py-8 flex flex-col gap-16">
			<HeaderSection
				:cta-google
				:cta-text
				:headline
				:subheadline
				class="pt-8"
			/>

			<section id="transcription-demo" class="flex flex-col gap-4">
				<span class="block text-center text-gray-500">
					of kijk hier hoe het werkt:
				</span>

				<TranscriptionPlayer />
			</section>

			<USPSection />

			<AboutSection />

			<PricingSection />

			<CTASection :cta-google :cta-text />

			<TheFooter />
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import TranscriptionPlayer from "../components/TranscriptionPlayer.vue";

const headline = "Minder typen, beter adviseren";
const subheadline =
	"Snel en nauwkeurig al je adviesgesprekken vastleggen met AdviesIntake van LoanLink.";

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
