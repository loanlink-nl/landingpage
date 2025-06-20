<template>
	<ClientOnly>
		<audio
			ref="audio"
			class="w-full"
			controls
			@timeupdate="updateTime"
			@seeking="updateTime"
		>
			<source src="/demo.mp3" />
			Je browser ondersteunt geen audio element.
		</audio>
	</ClientOnly>
</template>

<script setup lang="ts">
import { useTemplateRef } from "vue";

const props = defineProps<{ modelValue: number }>();
const emit = defineEmits<{
	"update:modelValue": [number];
}>();

const audioPlayerRef = useTemplateRef<HTMLAudioElement>("audio");
const lastEmitted = ref<number | undefined>();

watch(
	() => props.modelValue,
	(newValue) => {
		if (newValue === lastEmitted.value || !audioPlayerRef.value) {
			return;
		}

		audioPlayerRef.value.currentTime = newValue;
	},
	{ immediate: true }
);

function updateTime() {
	const newTime = audioPlayerRef.value?.currentTime ?? 0;
	lastEmitted.value = newTime;
	emit("update:modelValue", newTime);
}
</script>
