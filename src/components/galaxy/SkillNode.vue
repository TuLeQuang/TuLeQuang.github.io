<script setup lang="ts">
import { computed } from 'vue'
import { useFocus } from '@/composables/useFocus'
import { accentStyles } from '@/utils/styleMaps'
import type { SkillCluster } from '@/types'
import { useCv } from '@/composables/useCv'

const props = defineProps<{
  cluster: SkillCluster
  /** Width classes differ per orbit position (code.html) */
  widthClass: string
}>()

const cv = useCv()
const { focus, focusSkill, setHovered } = useFocus()

const accent = computed(() => accentStyles[props.cluster.accent])
/** Highlight only — other nodes keep full opacity. */
const isActive = computed(() => focus.value?.kind === 'skill' && focus.value.value === props.cluster.id)
</script>

<template>
  <button
    type="button"
    :data-galaxy-node="cluster.id"
    :aria-pressed="isActive"
    class="block text-left rounded-xl border bg-surface-container/70 backdrop-blur-xl p-space-md shadow-xl transition-all duration-300 hover:scale-105 hover:bg-surface-container-high/90 focus-visible:outline-2 focus-visible:outline-primary"
    :class="[
      widthClass,
      accent.border,
      isActive ? 'scale-105 ring-2 ring-primary/70 bg-surface-container-high/90 shadow-[0_0_32px_rgba(96,165,250,0.35)]' : ''
    ]"
    @mouseenter="setHovered(cluster.id)"
    @mouseleave="setHovered(null)"
    @focus="setHovered(cluster.id)"
    @blur="setHovered(null)"
    @click="focusSkill(cluster.id)"
  >
    <span class="flex items-center justify-between gap-space-xs pb-space-xs">
      <span class="inline-flex items-center gap-space-xs text-label-md font-bold tracking-wider uppercase" :class="accent.text">
        <span class="material-symbols-outlined text-[18px]">{{ cluster.icon }}</span>
        {{ cv.clusters[cluster.id].label }}
      </span>
      <span class="px-space-xs py-0.5 rounded-full text-label-sm whitespace-nowrap" :class="accent.chip">
        {{ cv.clusters[cluster.id].tier }}
      </span>
    </span>
    <span class="block text-body-md text-on-surface font-semibold">{{ cluster.skills.join(', ') }}</span>
    <span class="block text-label-sm text-on-surface-variant pt-space-xs">{{ cv.clusters[cluster.id].desc }}</span>
  </button>
</template>
