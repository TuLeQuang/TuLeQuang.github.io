<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { resumeData } from '@/data/resume'
import { useFocus } from '@/composables/useFocus'
import { useProjectSheet } from '@/composables/useProjectSheet'
import { CAREER_START, careerYears } from '@/utils/experience'
import { scrollToSection } from '@/utils/sections'
import type { DeliverableCode } from '@/types'

/**
 * Mobile-only section ② (Q-M1, Q-M2): six BA strengths, each backed by a fact from the CV.
 * Numbers are computed from data — no invented metrics.
 */
const { t } = useI18n()
const { focusSkill, focusCompany, focusAchievement } = useFocus()
const { openProject } = useProjectSheet()
const { projects, baDomains, achievements } = resumeData

const baProjects = projects.filter(p => p.tracks.includes('analyst'))
const award = achievements.find(a => a.id === 'best-project-2025')
const kit: DeliverableCode[] = ['wbs', 'srs', 'useCase', 'wireframe', 'mockup', 'proposal']

const items = [
  {
    key: 'bilingual', icon: 'translate',
    params: { n: careerYears(), start: CAREER_START },
    action: () => scrollToSection('the-pivot-story')
  },
  { key: 'deliverables', icon: 'description', params: {}, action: () => focusSkill('analysis') },
  {
    key: 'presale', icon: 'co_present',
    params: { n: baProjects.length },
    action: () => focusCompany('CMC Global', 'track', 'analyst')
  },
  {
    key: 'domains', icon: 'hub',
    params: { n: baDomains.length, domains: baDomains.map(d => t(`domains.${d}`)).join(' · ') },
    action: () => scrollToSection('the-analyst')
  },
  { key: 'feasible', icon: 'construction', params: {}, action: () => openProject('fleet-management', 'analyst') },
  {
    key: 'recognized', icon: 'emoji_events',
    params: {
      award: award ? t(`achievements.${award.id}`) : '',
      project: award?.projectSlug ? t(`projects.${award.projectSlug}.title`) : ''
    },
    action: () => award && focusAchievement(award.id)
  }
]
</script>

<template>
  <div id="ba-strengths" class="relative z-10 w-full mt-space-2xl scroll-mt-16" aria-labelledby="ba-strengths-title">
    <span class="text-label-sm text-secondary uppercase tracking-wider font-semibold">{{ t('strengths.eyebrow') }}</span>
    <h2 id="ba-strengths-title" class="text-headline-xl-mobile text-on-surface mt-space-xs mb-space-md">{{ t('strengths.title') }}</h2>

    <ul class="flex flex-col gap-space-sm">
      <li v-for="item in items" :key="item.key">
        <button
          type="button"
          class="w-full min-h-[88px] text-left rounded-xl border border-outline-variant/40 border-l-4 border-l-domain-ai bg-surface-container/70 backdrop-blur-md p-space-md flex items-start gap-space-sm active:bg-surface-container-high transition-colors"
          @click="item.action"
        >
          <span class="material-symbols-outlined text-[22px] text-secondary mt-0.5" aria-hidden="true">{{ item.icon }}</span>
          <span class="flex-1 min-w-0 flex flex-col gap-1">
            <span class="text-headline-sm text-on-surface">{{ t(`strengths.items.${item.key}.title`) }}</span>
            <span class="text-body-md text-on-surface-variant">{{ t(`strengths.items.${item.key}.proof`, item.params) }}</span>
            <span v-if="item.key === 'deliverables'" class="flex flex-wrap gap-1 mt-1">
              <span
                v-for="code in kit"
                :key="code"
                class="px-2 py-0.5 rounded-full bg-secondary-container/40 text-secondary-fixed text-label-sm font-medium"
              >✓ {{ t(`deliverables.${code}`) }}</span>
            </span>
          </span>
          <span class="material-symbols-outlined text-[18px] text-on-surface-variant mt-1" aria-hidden="true">chevron_right</span>
        </button>
      </li>
    </ul>
  </div>
</template>
