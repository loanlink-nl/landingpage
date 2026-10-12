<template>
	<UApp>
		<NuxtPage />
	</UApp>
</template>

<script setup lang="ts">
// Versie-kenmerk voor de live-controle (welke commit draait er live?)
const { commitSha } = useRuntimeConfig().public;
useHead({
	meta: [{ name: "x-commit", content: (commitSha as string) || "onbekend" }],
});
</script>
