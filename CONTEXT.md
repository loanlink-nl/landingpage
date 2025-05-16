# LoanLink Landing Page Development Context

## Commands

- Build: `pnpm build`
- Dev server: `pnpm dev`
- Preview: `pnpm preview`
- Generate static site: `pnpm generate`
- Lint: `pnpm lint` (inferred from @nuxt/eslint module)
- Typecheck: `pnpm typecheck` (inferred from TypeScript dependency)

## Tech Stack

- Nuxt 3 with TypeScript
- @nuxt/content for content management
- @nuxt/ui for UI components
- Vue 3 Composition API with `<script setup>` syntax

## Code Style

- Use TypeScript for type safety
- Component props should have explicit types and defaults
- Use Vue 3 Composition API with `<script setup>` syntax
- Follow Vue SFC structure: `<template>`, `<script>`, `<style>` in that order
- Use scoped styles with component-specific CSS
- Use ref() for reactive primitives
- Follow kebab-case for component filenames and HTML attributes
- Use PascalCase for component imports and definitions
- Error handling: use try/catch or Nuxt's createError utility
