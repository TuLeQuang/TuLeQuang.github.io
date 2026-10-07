<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ProgressBar from '@/components/common/ProgressBar.vue'
import TechChip from '@/components/common/TechChip.vue'
import { resumeData } from '@/data/resume'
import { useBreakpoint } from '@/composables/useBreakpoint'
import { useFocus } from '@/composables/useFocus'
import { skillRatio, skillYears } from '@/utils/experience'
import { cvMeta, useCv } from '@/composables/useCv'

const { t } = useI18n()
const cv = useCv()
const { focus, focusSkill } = useFocus()

const skills = resumeData.skills.filter(s => s.category === 'analysis')
const kit = cvMeta.deliverableKit
const isFocused = computed(() => focus.value?.kind === 'skill' && focus.value.value === 'analysis')
const toggle = (): void => focusSkill('analysis', 'none')

/** Mobile: the bars are collapsed by default so the deliverable kit is seen first. */
const { isMobile } = useBreakpoint()
const expanded = ref(false)
const showBars = computed(() => !isMobile.value || expanded.value)
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
      <button
        v-if="isMobile"
        type="button"
        class="w-full min-h-11 flex items-center justify-between text-label-md font-semibold text-domain-ai"
        :aria-expanded="expanded"
        aria-controls="analyst-competency-bars"
        @click.stop="expanded = !expanded"
        @keydown.enter.stop
      >
        <span>{{ expanded ? t('analyst.hideCompetencies') : t('analyst.showCompetencies') }}</span>
        <span class="material-symbols-outlined text-[18px] transition-transform duration-300" :class="{ 'rotate-180': expanded }">expand_more</span>
      </button>
      <div v-if="showBars" id="analyst-competency-bars" class="flex flex-col gap-space-sm">
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
          :label="`✓ ${cv.deliverables[code]}`"
          tone="deliverable"
          :matched="isFocused"
        />
      </div>
    </div>
  </div>
</template>
