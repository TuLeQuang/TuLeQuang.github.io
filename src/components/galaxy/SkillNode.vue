<template>
  <div 
    class="glass-card skill-node"
    :class="positionClass"
    @mouseenter="$emit('hover', label)" 
    @mouseleave="$emit('hover', null)"
    @click="$emit('click')"
  >
    <h3 class="font-bold text-lg mb-2" :class="colorClass">{{ label }}</h3>
    <div class="flex flex-wrap gap-1">
      <span v-for="skill in skills" :key="skill" class="text-xs bg-white/10 px-2 py-1 rounded">
        {{ skill }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label: string
  skills: string[]
  colorClass: string
  positionClass: string
}

defineProps<Props>()

defineEmits<{
  hover: [value: string | null]
  click: []
}>()
</script>

<style scoped>
@reference 'tailwindcss';

.glass-card {
  @apply bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4;
}

.skill-node {
  @apply cursor-pointer hover:scale-105 hover:bg-white/15 hover:border-white/40 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-300 z-10;
}
</style>
