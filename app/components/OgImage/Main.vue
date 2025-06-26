<script setup lang="ts">
/**
 * @credits Full Stack Heroes <https://fullstackheroes.com/>
 */

defineProps<{
	title: string;
	logo: string;
}>();
</script>

<template>
	<div
		:style="{
			backgroundImage: 'linear-gradient(to right, #3E2164, #6B3CA8, #3E2164)',
		}"
		class="h-full w-full flex items-start justify-start"
	>
		<div class="flex items-start justify-start h-full">
			<div class="flex flex-col justify-between w-full h-full p-20">
				<img :src="logo" height="100" width="200" class="object-contain" />
				<h1
					class="text-[60px] text-white font-bold text-left"
					style="display: block; line-clamp: 2; text-overflow: ellipsis"
				>
					{{ title }}
				</h1>
			</div>
		</div>
	</div>
</template>
