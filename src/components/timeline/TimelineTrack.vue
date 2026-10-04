<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import AwardBadge from '@/components/common/AwardBadge.vue'
import { useFocus } from '@/composables/useFocus'
import { milestoneMatchesFocus } from '@/utils/focusMatch'
import type { TimelineMilestone } from '@/types'

const props = defineProps<{
  milestones: TimelineMilestone[]
  title: string
  icon: string
  iconClass: string
  /** Colour of the vertical rail (before: pseudo-element) */
  railClass: string
  /** Dot colour per row, newest first (code.html) */
  dotClasses: string[]
}>()

const { t } = useI18n()
const { focus } = useFocus()

/** Newest first */
const rows = computed(() => [...props.milestones].reverse())

/** Milestones related to the current focus get highlighted; the others stay as they are. */
const matches = computed(() => {
  const f = focus.value
  return new Set(f ? rows.value.filter(m => milestoneMatchesFocus(m, f)).map(m => m.id) : [])
})

const isPulsing = (m: TimelineMilestone): boolean =>
  focus.value?.kind === 'achievement' && focus.value.value === m.achievementId

const isAnalyst = computed(() => props.iconClass.includes('domain-ai'))
const ringTone = computed(() => (isAnalyst.value ? 'ring-domain-ai/50' : 'ring-primary-container/30'))
</script>

<template>
  <div v-reveal class="lg:col-span-4 bg-content-surface p-space-lg rounded-xl shadow-xs lg:sticky lg:top-28">
    <div class="flex items-center gap-space-xs text-headline-sm text-text-primary mb-space-md">
      <span class="material-symbols-outlined text-[20px]" :class="iconClass">{{ icon }}</span>
      <span>{{ title }}</span>
    </div>
    <div
      class="relative pl-space-md flex flex-col gap-space-lg before:content-[''] before:absolute before:top-2 before:bottom-2 before:left-[11px] before:w-0.5"
      :class="railClass"
    >
      <div
        v-for="(milestone, index) in rows"
        :key="milestone.id"
        class="relative pl-space-md rounded-lg transition-all duration-300"
        :class="matches.has(milestone.id) ? ['bg-content-bg shadow-md ring-1 py-space-xs pr-space-xs', ringTone] : ''"
      >
        <span
          class="absolute -left-[19px] top-1 w-4 h-4 rounded-full bg-content-bg shadow-xs flex items-center justify-center"
          :class="{ 'animate-pulse-glow': isPulsing(milestone) }"
        >
          <span class="w-2 h-2 rounded-full" :class="dotClasses[index] ?? 'bg-slate-300'" />
        </span>
        <div class="text-label-sm text-text-muted">{{ milestone.year }}</div>
        <div class="text-headline-sm text-text-primary flex flex-wrap items-center gap-1">
          <span>{{ t(`milestones.${milestone.id}.title`) }}</span>
          <AwardBadge v-if="milestone.achievementId" :achievement-id="milestone.achievementId" :pulse="isPulsing(milestone)" />
        </div>
        <p class="text-body-md text-text-secondary mt-1">{{ t(`milestones.${milestone.id}.desc`) }}</p>
      </div>
    </div>
  </div>
</template>
