<script setup lang="ts">
defineProps<{
  label: string
  /** Display value, e.g. "8 yrs" */
  value: string
  /** 0..1 */
  ratio: number
  barClass: string
}>()
</script>

<template>
  <div>
    <div class="flex justify-between text-label-md text-text-secondary mb-1">
      <span>{{ label }}</span>
      <span>{{ value }}</span>
    </div>
    <div class="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
      <div
        class="h-full rounded-full transition-[width] duration-700 ease-out"
        :class="barClass"
        :style="{ width: `${Math.round(ratio * 100)}%` }"
      />
    </div>
  </div>
</template>
