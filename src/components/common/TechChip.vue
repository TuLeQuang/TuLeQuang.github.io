<script setup lang="ts">
import { computed } from 'vue'

type Tone = 'neutral' | 'deliverable'

const props = defineProps<{
  label: string
  size?: 'md' | 'sm'
  tone?: Tone
  /** Highlighted because it matches the focused Galaxy skill */
  matched?: boolean
  /** Render as a button (Smart Tag → Galaxy node) */
  clickable?: boolean
}>()

const emit = defineEmits<{ select: [] }>()

const sizeClass = computed(() =>
  props.size === 'md' ? 'px-space-sm py-1 text-label-md' : 'px-2 py-0.5 text-label-sm'
)

const toneClass = computed(() => {
  if (props.tone === 'deliverable') {
    return props.matched
      ? 'bg-domain-ai text-white font-semibold'
      : 'bg-secondary-purple-light text-domain-ai-text font-medium'
  }
  return props.matched
    ? 'bg-primary-blue-light text-primary-blue-dark ring-2 ring-primary-container/40 font-semibold'
    : 'bg-slate-100 text-text-primary'
})
</script>

<template>
  <button
    v-if="clickable"
    type="button"
    class="rounded-sm transition-all hover:bg-primary-blue-light hover:text-primary-blue-dark"
    :class="[sizeClass, toneClass]"
    @click.stop="emit('select')"
  >
    {{ label }}
  </button>
  <span v-else class="rounded-sm transition-all" :class="[sizeClass, toneClass]">{{ label }}</span>
</template>
