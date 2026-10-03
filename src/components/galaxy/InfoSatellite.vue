<template>
  <div 
    class="glass-card"
    :class="[positionClass, extraClass]"
    @mouseenter="$emit('hover', title)" 
    @mouseleave="$emit('hover', null)"
  >
    <h3 class="font-bold text-sm uppercase tracking-wider mb-2" :class="titleColorClass">{{ title }}</h3>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  titleColorClass?: string
  positionClass: string
  extraClass?: string
}

withDefaults(defineProps<Props>(), {
  titleColorClass: 'text-slate-400',
  extraClass: ''
})

defineEmits<{
  hover: [value: string | null]
}>()
</script>

<style scoped>
@reference 'tailwindcss';

.glass-card {
  @apply bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 z-10;
}
</style>
