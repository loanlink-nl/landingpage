<template>
	<div class="flex flex-col items-center">
		<a
			:href="socialLink"
			target="_blank"
			rel="noopener noreferrer"
			class="image-link peer mb-4"
		>
			<img
				:src="image"
				:alt="`Headshot`"
				class="w-24 h-24 rounded-full object-cover"
			/>
		</a>
		<a
			:href="socialLink"
			target="_blank"
			rel="noopener noreferrer"
			class="relative name-link"
		>
			<h3 class="font-semibold">{{ name }}</h3>
			<UIcon
				name="i-lucide-external-link"
				class="icon absolute text-dimmed top-1/2 left-full ml-1 -translate-y-1/2"
			/>
		</a>
		<h4 class="text-dimmed italic">{{ role }}</h4>
		<p v-if="description">{{ description }}</p>
	</div>
</template>

<script setup lang="ts">
defineProps<{
	name: string;
	role: string;
	description?: string;
	image: string;
	socialLink?: string;
}>();
</script>

<style scoped>
a.name-link .icon {
	display: none;
}

a.image-link:hover + a.name-link,
a.name-link:hover {
	text-decoration: underline;
}

a.image-link:hover + a.name-link .icon,
a.name-link:hover .icon {
	display: inline-block;
}
</style>
