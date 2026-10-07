<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { resumeData } from '@/data/resume'
import { useFocus } from '@/composables/useFocus'
import { skillYears } from '@/utils/experience'
import { accentStyles } from '@/utils/styleMaps'
import { scrollToSection, TRACK_SECTION } from '@/utils/sections'
import type { SkillCategory } from '@/types'
import { useCv } from '@/composables/useCv'

/**
 * Mobile skill map (section ③): 2×2 tiles + small hub, static SVG links instead of GalaxyConnections.
 * Tap 1 → select (tile + related links light up, details below). Tap 2 / button → focus + scroll.
 */
const { t } = useI18n()
const cv = useCv()
const { focus, focusSkill } = useFocus()

/** BA-first: Analysis is the first tile. Position = SVG anchor (tile centre, in % of the grid). */
const layout: { id: SkillCategory; x: number; y: number }[] = [
  { id: 'analysis', x: 25, y: 25 },
  { id: 'database', x: 75, y: 25 },
  { id: 'frontend', x: 25, y: 75 },
  { id: 'backend', x: 75, y: 75 }
]
/** Q13 bridges through the hub: FE ↔ BE, Analysis ↔ Data. */
const partner: Record<SkillCategory, SkillCategory> = {
  frontend: 'backend', backend: 'frontend', analysis: 'database', database: 'analysis'
}

const clusterOf = (id: SkillCategory) => resumeData.skillClusters.find(c => c.id === id)!
const selected = ref<SkillCategory | null>(null)
const hubPulse = ref(false)

const isActive = (id: SkillCategory): boolean =>
  selected.value === id || (focus.value?.kind === 'skill' && focus.value.value === id)
const isLit = (id: SkillCategory): boolean =>
  hubPulse.value || (selected.value !== null && (selected.value === id || partner[selected.value] === id))

/** useFocus toggles on repeat — if this skill is already focused, only scroll to its track. */
const openTrack = (id: SkillCategory): void => {
  if (focus.value?.kind === 'skill' && focus.value.value === id) scrollToSection(TRACK_SECTION[focus.value.track])
  else focusSkill(id)
}
const tap = (id: SkillCategory): void => {
  if (selected.value === id) openTrack(id)
  else selected.value = id
}
const pulseHub = (): void => {
  hubPulse.value = true
  setTimeout(() => (hubPulse.value = false), 1200)
}
const details = computed(() =>
  selected.value ? resumeData.skills.filter(s => s.category === selected.value) : []
)
</script>

<template>
  <div class="relative z-10 w-full mt-space-2xl">
    <h2 class="text-headline-xl-mobile text-on-surface mb-space-md">{{ t('skillsMap.title') }}</h2>

    <div class="relative grid grid-cols-2 gap-x-space-lg gap-y-space-2xl">
      <svg class="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <line
          v-for="node in layout"
          :key="node.id"
          x1="50" y1="50" :x2="node.x" :y2="node.y"
          :stroke="accentStyles[clusterOf(node.id).accent].stroke"
          vector-effect="non-scaling-stroke"
          stroke-linecap="round"
          class="transition-all duration-300"
          :stroke-width="isLit(node.id) ? 3 : 1.5"
          :stroke-opacity="isLit(node.id) ? 0.95 : 0.3"
          stroke-dasharray="4 4"
        />
      </svg>

      <button
        v-for="node in layout"
        :key="node.id"
        type="button"
        :aria-pressed="isActive(node.id)"
        class="relative min-h-[112px] rounded-xl border bg-surface-container/80 backdrop-blur-xl p-space-sm text-left flex flex-col gap-1 transition-all duration-300"
        :class="[
          accentStyles[clusterOf(node.id).accent].border,
          isActive(node.id) ? 'scale-[1.03] ring-2 ring-primary/60 bg-surface-container-high' : ''
        ]"
        @click="tap(node.id)"
      >
        <span class="material-symbols-outlined text-[22px]" :class="accentStyles[clusterOf(node.id).accent].text">{{ clusterOf(node.id).icon }}</span>
        <span class="text-headline-sm text-on-surface leading-tight">{{ cv.clusters[node.id].label }}</span>
        <span class="text-label-sm text-on-surface-variant line-clamp-2">{{ clusterOf(node.id).skills.slice(0, 3).join(' · ') }}</span>
      </button>

      <button
        type="button"
        class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-linear-to-tr from-primary-blue-dark to-secondary-container ring-4 ring-surface-container-high flex items-center justify-center text-xl shadow-lg z-10"
        :aria-label="t('skillsMap.hub')"
        @click="pulseHub"
      >
        <span aria-hidden="true">👨‍💻</span>
      </button>
    </div>

    <p v-if="!selected" class="mt-space-md text-label-md text-on-surface-variant/80 flex items-center gap-space-xs">
      <span class="material-symbols-outlined text-[16px] text-primary">touch_app</span>
      {{ t('skillsMap.tapHint') }}
    </p>

    <div v-else class="mt-space-md rounded-xl border border-outline-variant/40 bg-surface-container/70 backdrop-blur-md p-space-md">
      <p class="text-body-md text-on-surface-variant">{{ cv.clusters[selected].desc }}</p>
      <ul class="mt-space-sm flex flex-wrap gap-1">
        <li v-for="skill in details" :key="skill.name" class="px-2 py-0.5 rounded-full bg-surface-container-high text-label-sm text-on-surface">
          {{ skill.name }} · {{ t('common.years', { n: skillYears(skill) }) }}
        </li>
      </ul>
      <button
        type="button"
        class="mt-space-md w-full min-h-11 rounded-lg bg-primary-container text-on-primary-container text-label-md font-semibold inline-flex items-center justify-center gap-1"
        @click="openTrack(selected)"
      >
        {{ t('skillsMap.viewProjects') }}
        <span class="material-symbols-outlined text-[18px]">arrow_downward</span>
      </button>
    </div>
  </div>
</template>
