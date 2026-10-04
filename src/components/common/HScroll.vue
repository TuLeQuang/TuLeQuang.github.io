<script setup lang="ts">
/** Horizontal snap scroller with faded edges (mobile strips: quick profile, year rail, chips). */
withDefaults(defineProps<{ tag?: string; label?: string }>(), { tag: 'div', label: undefined })
</script>

<template>
  <component
    :is="tag"
    :aria-label="label"
    class="no-scrollbar mask-fade-x flex gap-space-sm overflow-x-auto snap-x snap-mandatory scroll-px-gutter-mobile px-gutter-mobile -mx-gutter-mobile py-1"
  >
    <slot />
  </component>
</template>
