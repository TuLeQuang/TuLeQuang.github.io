<script setup lang="ts">
defineProps<{
  icon: string
  title: string
  /** Accent text class for the eyebrow, e.g. text-primary */
  accentClass: string
}>()
</script>

<template>
  <div class="rounded-xl border border-outline-variant/70 hover:border-outline/60 bg-surface-container-low/70 backdrop-blur-md p-space-md shadow-lg transition-all hover:-translate-y-1">
    <div class="flex items-center gap-space-xs text-label-sm uppercase font-bold tracking-wider mb-space-xs" :class="accentClass">
      <span class="material-symbols-outlined text-[16px]">{{ icon }}</span>
      {{ title }}
    </div>
    <slot />
  </div>
</template>
