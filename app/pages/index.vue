<template>
	<div class="container mx-auto px-4 py-8">
		<!-- Hero Section -->
		<section class="flex flex-col items-center text-center mb-16">
			<h1 class="text-4xl md:text-6xl font-bold mb-4">
				Transform Speech to Text with LoanLink Transcription
			</h1>
			<p class="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl">
				Fast, accurate, and secure audio transcription powered by advanced AI
				technology.
			</p>
			<div class="flex flex-col sm:flex-row gap-4">
				<UButton size="lg" color="primary">Start Transcribing Now</UButton>
				<UButton size="lg" variant="outline">View Demo</UButton>
			</div>
		</section>

		<!-- Features Section -->
		<section class="mb-16">
			<h2 class="text-3xl font-bold text-center mb-8">Key Features</h2>
			<div class="grid md:grid-cols-3 gap-8">
				<div class="bg-white p-6 rounded-lg shadow-md">
					<UIcon
						name="i-heroicons-clock"
						class="text-primary-500 text-3xl mb-4"
					/>
					<h3 class="text-xl font-semibold mb-2">Lightning Fast</h3>
					<p>
						Transcribe hours of audio in minutes with our high-performance
						processing engine.
					</p>
				</div>
				<div class="bg-white p-6 rounded-lg shadow-md">
					<UIcon
						name="i-heroicons-check-badge"
						class="text-primary-500 text-3xl mb-4"
					/>
					<h3 class="text-xl font-semibold mb-2">Highly Accurate</h3>
					<p>
						Industry-leading 98% accuracy with support for multiple accents and
						specialized terminology.
					</p>
				</div>
				<div class="bg-white p-6 rounded-lg shadow-md">
					<UIcon
						name="i-heroicons-lock-closed"
						class="text-primary-500 text-3xl mb-4"
					/>
					<h3 class="text-xl font-semibold mb-2">Secure & Private</h3>
					<p>
						Enterprise-grade security with end-to-end encryption and strict data
						privacy controls.
					</p>
				</div>
			</div>
		</section>

		<!-- How It Works Section -->
		<section class="mb-16">
			<h2 class="text-3xl font-bold text-center mb-8">How It Works</h2>
			<div class="grid md:grid-cols-3 gap-8">
				<div class="text-center">
					<div
						class="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4"
					>
						<span class="text-primary-500 font-bold text-xl">1</span>
					</div>
					<h3 class="text-xl font-semibold mb-2">Upload</h3>
					<p>Upload your audio or video files in any common format.</p>
				</div>
				<div class="text-center">
					<div
						class="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4"
					>
						<span class="text-primary-500 font-bold text-xl">2</span>
					</div>
					<h3 class="text-xl font-semibold mb-2">Process</h3>
					<p>Our AI transcribes your content with high accuracy.</p>
				</div>
				<div class="text-center">
					<div
						class="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4"
					>
						<span class="text-primary-500 font-bold text-xl">3</span>
					</div>
					<h3 class="text-xl font-semibold mb-2">Download</h3>
					<p>Get your transcription in multiple formats (TXT, SRT, DOCX).</p>
				</div>
			</div>
		</section>

		<!-- Pricing Section -->
		<section class="mb-16">
			<h2 class="text-3xl font-bold text-center mb-8">
				Simple, Transparent Pricing
			</h2>
			<div class="grid md:grid-cols-3 gap-8">
				<div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
					<h3 class="text-xl font-semibold mb-2">Basic</h3>
					<p class="text-3xl font-bold mb-4">
						$9<span class="text-lg text-gray-500">/month</span>
					</p>
					<ul class="mb-6 space-y-2">
						<li class="flex items-center">
							<UIcon name="i-heroicons-check" class="text-green-500 mr-2" /> 5
							hours of audio per month
						</li>
						<li class="flex items-center">
							<UIcon name="i-heroicons-check" class="text-green-500 mr-2" />
							Standard accuracy
						</li>
						<li class="flex items-center">
							<UIcon name="i-heroicons-check" class="text-green-500 mr-2" /> 3
							export formats
						</li>
					</ul>
					<UButton block>Get Started</UButton>
				</div>
				<div
					class="bg-primary-50 p-6 rounded-lg shadow-md border border-primary-200 transform scale-105"
				>
					<div
						class="bg-primary-500 text-white text-xs font-bold uppercase py-1 px-2 rounded-full inline-block mb-2"
					>
						Most Popular
					</div>
					<h3 class="text-xl font-semibold mb-2">Professional</h3>
					<p class="text-3xl font-bold mb-4">
						$29<span class="text-lg text-gray-500">/month</span>
					</p>
					<ul class="mb-6 space-y-2">
						<li class="flex items-center">
							<UIcon name="i-heroicons-check" class="text-green-500 mr-2" /> 20
							hours of audio per month
						</li>
						<li class="flex items-center">
							<UIcon name="i-heroicons-check" class="text-green-500 mr-2" />
							Enhanced accuracy
						</li>
						<li class="flex items-center">
							<UIcon name="i-heroicons-check" class="text-green-500 mr-2" /> All
							export formats
						</li>
						<li class="flex items-center">
							<UIcon name="i-heroicons-check" class="text-green-500 mr-2" />
							Speaker identification
						</li>
					</ul>
					<UButton block color="primary">Get Started</UButton>
				</div>
				<div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
					<h3 class="text-xl font-semibold mb-2">Enterprise</h3>
					<p class="text-3xl font-bold mb-4">
						$99<span class="text-lg text-gray-500">/month</span>
					</p>
					<ul class="mb-6 space-y-2">
						<li class="flex items-center">
							<UIcon name="i-heroicons-check" class="text-green-500 mr-2" /> 100
							hours of audio per month
						</li>
						<li class="flex items-center">
							<UIcon name="i-heroicons-check" class="text-green-500 mr-2" />
							Highest accuracy
						</li>
						<li class="flex items-center">
							<UIcon name="i-heroicons-check" class="text-green-500 mr-2" />
							Custom vocabulary
						</li>
						<li class="flex items-center">
							<UIcon name="i-heroicons-check" class="text-green-500 mr-2" /> API
							access
						</li>
						<li class="flex items-center">
							<UIcon name="i-heroicons-check" class="text-green-500 mr-2" />
							Priority support
						</li>
					</ul>
					<UButton block>Get Started</UButton>
				</div>
			</div>
		</section>

		<!-- Testimonials Section -->
		<section class="mb-16">
			<h2 class="text-3xl font-bold text-center mb-8">
				What Our Customers Say
			</h2>
			<div class="grid md:grid-cols-2 gap-8">
				<div class="bg-white p-6 rounded-lg shadow-md">
					<div class="flex items-center mb-4">
						<div class="text-yellow-400 flex">
							<UIcon v-for="i in 5" :key="i" name="i-heroicons-star" />
						</div>
					</div>
					<p class="mb-4 italic">
						"LoanLink Transcription has revolutionized our podcast production
						workflow. The accuracy is impressive and it saves us hours of manual
						work each week."
					</p>
					<div class="flex items-center">
						<div class="font-semibold">Sarah Johnson</div>
						<div class="text-gray-500 ml-2">Podcast Producer</div>
					</div>
				</div>
				<div class="bg-white p-6 rounded-lg shadow-md">
					<div class="flex items-center mb-4">
						<div class="text-yellow-400 flex">
							<UIcon v-for="i in 5" :key="i" name="i-heroicons-star" />
						</div>
					</div>
					<p class="mb-4 italic">
						"As a journalist, I need reliable transcription for interviews.
						LoanLink delivers accurate results even with challenging audio
						conditions and different accents."
					</p>
					<div class="flex items-center">
						<div class="font-semibold">Michael Chen</div>
						<div class="text-gray-500 ml-2">Investigative Reporter</div>
					</div>
				</div>
			</div>
		</section>

		<!-- CTA Section -->
		<section class="bg-primary-50 p-8 rounded-lg text-center">
			<h2 class="text-3xl font-bold mb-4">Ready to Get Started?</h2>
			<p class="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
				Join thousands of satisfied users who trust LoanLink Transcription for
				their audio-to-text needs.
			</p>
			<UButton size="lg" color="primary">Start Your Free Trial</UButton>
		</section>
	</div>
</template>

<script setup lang="ts">
// Component setup
</script>
