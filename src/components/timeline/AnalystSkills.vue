<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import ProgressBar from '@/components/common/ProgressBar.vue'
import TechChip from '@/components/common/TechChip.vue'
import { resumeData } from '@/data/resume'
import { useFocus } from '@/composables/useFocus'
import { skillRatio, skillYears } from '@/utils/experience'
import type { DeliverableCode } from '@/types'

const { t } = useI18n()
const { focus, focusSkill } = useFocus()

const skills = resumeData.skills.filter(s => s.category === 'analysis')
const kit: DeliverableCode[] = ['wbs', 'srs', 'wireframe', 'proposal', 'useCase', 'mockup']
const isFocused = computed(() => focus.value?.kind === 'skill' && focus.value.value === 'analysis')
const toggle = (): void => focusSkill('analysis', 'none')
</script>

<template>
  <div
    v-reveal
    role="button"
    tabindex="0"
    class="bg-content-surface p-space-lg sm:p-space-xl rounded-xl shadow-xs flex flex-col justify-between transition-all duration-300 cursor-pointer hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-domain-ai"
    :class="isFocused ? 'ring-2 ring-domain-ai/60 bg-content-bg shadow-md' : 'hover:bg-content-bg/70'"
    @click="toggle"
    @keydown.enter="toggle"
  >
    <div>
      <div class="flex items-center gap-space-xs text-domain-ai-text text-headline-sm mb-space-md">
        <span class="material-symbols-outlined text-[20px]">assignment</span>
        <span>{{ t('analyst.competencies') }}</span>
      </div>
      <div class="flex flex-col gap-space-sm">
        <ProgressBar
          v-for="skill in skills"
          :key="skill.name"
          :label="skill.name"
          :value="t('common.years', { n: skillYears(skill) })"
          :ratio="skillRatio(skill)"
          bar-class="bg-domain-ai"
        />
      </div>
    </div>

    <div class="mt-space-lg pt-space-md">
      <span class="text-label-sm text-text-muted uppercase tracking-wider block mb-space-xs">{{ t('analyst.deliverableKit') }}</span>
      <div class="flex flex-wrap gap-space-xs">
        <TechChip
          v-for="code in kit"
          :key="code"
          :label="`✓ ${t(`deliverables.${code}`)}`"
          tone="deliverable"
          :matched="isFocused"
        />
      </div>
    </div>
  </div>
</template>
