<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import ProgressBar from '@/components/common/ProgressBar.vue'
import { resumeData } from '@/data/resume'
import { useBreakpoint } from '@/composables/useBreakpoint'
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

/** Mobile: one column at a time. The tab follows a skill focused elsewhere (Galaxy, chips). */
const { isMobile } = useBreakpoint()
const tab = ref<SkillCategory>('frontend')
watch(focus, f => {
  const match = f?.kind === 'skill' ? columns.find(c => c.id === f.value) : undefined
  if (match) tab.value = match.id
})
const current = computed(() => columns.find(c => c.id === tab.value) ?? columns[0])
const selectTab = (id: SkillCategory): void => {
  tab.value = id
  toggle(id)
}
</script>

<template>
  <!-- Mobile: segmented tabs -->
  <div v-if="isMobile" v-reveal class="p-space-md bg-content-surface rounded-xl shadow-xs flex flex-col gap-space-md">
    <div class="grid grid-cols-3 gap-1 p-1 rounded-lg bg-content-bg" role="tablist">
      <button
        v-for="column in columns"
        :key="column.id"
        type="button"
        role="tab"
        class="min-h-11 rounded-md text-label-md font-semibold inline-flex items-center justify-center gap-1 transition-all"
        :class="column.id === current?.id ? ['bg-content-surface shadow-xs', column.titleClass, isFocused(column.id) ? ['ring-2', column.ringClass] : ''] : 'text-text-secondary'"
        :aria-selected="column.id === current?.id"
        @click="selectTab(column.id)"
      >
        <span class="material-symbols-outlined text-[18px]" aria-hidden="true">{{ column.icon }}</span>
        {{ t(`builder.skills.${column.id}`) }}
      </button>
    </div>
    <div v-if="current" role="tabpanel" class="flex flex-col gap-space-sm">
      <ProgressBar
        v-for="skill in skillsOf(current.id)"
        :key="skill.name"
        :label="skill.name"
        :value="t('common.years', { n: skillYears(skill) })"
        :ratio="skillRatio(skill)"
        :bar-class="current.barClass"
      />
    </div>
  </div>

  <div v-else v-reveal class="grid grid-cols-1 md:grid-cols-3 gap-space-lg p-space-lg sm:p-space-xl bg-content-surface rounded-xl shadow-xs">
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
