<template>
	<div class="bg-white p-6 rounded-lg border">
		<UIcon :name="icon" class="text-primary-500 text-3xl mb-4" />
		<h3 class="text-xl font-semibold mb-2">{{ title }}</h3>
		<p>
			{{ description }}
		</p>
	</div>
</template>

<script setup lang="ts">
defineProps<{
	icon: string;
	title: string;
	description: string;
}>();
</script>
