<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { resumeData } from '@/data/resume'
import { cvMeta, fill, useCv } from '@/composables/useCv'
import { useFocus } from '@/composables/useFocus'
import { useProjectSheet } from '@/composables/useProjectSheet'
import { CAREER_START, careerYears } from '@/utils/experience'
import { scrollToSection } from '@/utils/sections'

/**
 * Mobile-only section ② (Q-M1, Q-M2): six BA strengths, each backed by a fact from the CV.
 * Numbers are computed from data — no invented metrics.
 */
const { t } = useI18n()
const cv = useCv()
const { focusSkill, focusCompany, focusAchievement } = useFocus()
const { openProject } = useProjectSheet()
const { projects, baDomains, achievements, companies } = resumeData

const baProjects = projects.filter(p => p.tracks.includes('analyst'))
/** BA award = the analyst-track achievement tied to a project. */
const award = achievements.find(a => a.track === 'analyst' && a.projectSlug)
/** Pre-sale happens at the current employer (last company in the CV). */
const currentCompany = companies[companies.length - 1]?.name ?? ''
const kit = cvMeta.strengthsKit
const feasibleProject = cvMeta.strengthProjects.feasible

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
    action: () => focusCompany(currentCompany, 'track', 'analyst')
  },
  {
    key: 'domains', icon: 'hub',
    params: { n: baDomains.length, domains: () => baDomains.map(d => cv.value.domains[d]).join(' · ') },
    action: () => scrollToSection('the-analyst')
  },
  { key: 'feasible', icon: 'construction', params: {}, action: () => feasibleProject && openProject(feasibleProject, 'analyst') },
  {
    key: 'recognized', icon: 'emoji_events',
    params: {
      award: () => (award ? cv.value.achievements[award.id] : ''),
      project: () => (award?.projectSlug ? cv.value.projects[award.projectSlug]?.title ?? '' : '')
    },
    action: () => award && focusAchievement(award.id)
  }
]

/** Params may be lazy (locale-dependent CV texts) → resolved at render time. */
const proofOf = (item: (typeof items)[number]): string =>
  fill(
    cv.value.narrative.strengths[item.key]?.proof ?? '',
    Object.fromEntries(Object.entries(item.params).map(([k, v]) => [k, typeof v === 'function' ? v() : v]))
  )
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
            <span class="text-headline-sm text-on-surface">{{ cv.narrative.strengths[item.key]?.title }}</span>
            <span class="text-body-md text-on-surface-variant">{{ proofOf(item) }}</span>
            <span v-if="item.key === 'deliverables'" class="flex flex-wrap gap-1 mt-1">
              <span
                v-for="code in kit"
                :key="code"
                class="px-2 py-0.5 rounded-full bg-secondary-container/40 text-secondary-fixed text-label-sm font-medium"
              >✓ {{ cv.deliverables[code] }}</span>
            </span>
          </span>
          <span class="material-symbols-outlined text-[18px] text-on-surface-variant mt-1" aria-hidden="true">chevron_right</span>
        </button>
      </li>
    </ul>
  </div>
</template>
