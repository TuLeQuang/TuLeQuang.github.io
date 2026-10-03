<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import ProgressBar from '@/components/common/ProgressBar.vue'
import { resumeData } from '@/data/resume'
import { useFocus } from '@/composables/useFocus'
import { skillRatio, skillYears } from '@/utils/experience'
import { accentStyles } from '@/utils/styleMaps'
import type { ClusterAccent, SkillCategory } from '@/types'

const { t } = useI18n()
const { focus, focusSkill } = useFocus()

/** Colour follows the matching Galaxy node's accent, so each skill keeps one colour everywhere. */
const accentOf = (id: SkillCategory): ClusterAccent =>
  resumeData.skillClusters.find(c => c.id === id)?.accent ?? 'primary'

const columns = ([
  { id: 'frontend', icon: 'web' },
  { id: 'backend', icon: 'dns' },
  { id: 'database', icon: 'storage' }
] as const).map(c => {
  const accent = accentStyles[accentOf(c.id)]
  return { ...c, titleClass: accent.lightText, barClass: accent.lightBar, ringClass: accent.lightRing }
})

const skillsOf = (category: SkillCategory) => resumeData.skills.filter(s => s.category === category)
const isFocused = (category: SkillCategory): boolean => focus.value?.kind === 'skill' && focus.value.value === category
/** Click again on the same column turns the highlight off (toggle handled by useFocus). */
const toggle = (category: SkillCategory): void => focusSkill(category, 'none')
</script>

<template>
  <div v-reveal class="grid grid-cols-1 md:grid-cols-3 gap-space-lg p-space-lg sm:p-space-xl bg-content-surface rounded-xl shadow-xs">
    <button
      v-for="column in columns"
      :key="column.id"
      type="button"
      class="group flex flex-col gap-space-md text-left rounded-lg p-space-sm -m-space-sm cursor-pointer transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container"
      :class="isFocused(column.id) ? ['ring-2 bg-content-bg shadow-md', column.ringClass] : 'hover:bg-content-bg/70'"
      :aria-pressed="isFocused(column.id)"
      :title="t('builder.skillToggle', { label: t(`builder.skills.${column.id}`) })"
      @click="toggle(column.id)"
    >
      <div class="flex items-center gap-space-xs text-headline-sm pb-space-xs w-full" :class="column.titleClass">
        <span class="material-symbols-outlined text-[20px]">{{ column.icon }}</span>
        <span>{{ t(`builder.skills.${column.id}`) }}</span>
        <span
          class="material-symbols-outlined text-[18px] ml-auto transition-opacity duration-300"
          :class="isFocused(column.id) ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'"
          aria-hidden="true"
        >{{ isFocused(column.id) ? 'check_circle' : 'ads_click' }}</span>
      </div>
      <div class="flex flex-col gap-space-sm w-full">
        <ProgressBar
          v-for="skill in skillsOf(column.id)"
          :key="skill.name"
          :label="skill.name"
          :value="t('common.years', { n: skillYears(skill) })"
          :ratio="skillRatio(skill)"
          :bar-class="column.barClass"
        />
      </div>
    </button>
  </div>
</template>
