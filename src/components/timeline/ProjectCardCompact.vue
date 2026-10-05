<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import AwardBadge from '@/components/common/AwardBadge.vue'
import { useProjectSheet } from '@/composables/useProjectSheet'
import { customerOf } from '@/utils/customers'
import type { Project, ProjectTrack, SkillCategory } from '@/types'
import { techMatchesSkill } from '@/utils/styleMaps'

/**
 * Mobile project card: compact summary, tap → ProjectSheet (full details).
 * Desktop keeps BentoProjectCard with its inline drawer.
 */
const props = defineProps<{
  project: Project
  track: ProjectTrack
  highlighted: boolean
  matchCategory: SkillCategory | null
}>()

const MAX_CHIPS = 4
const { t } = useI18n()
const { openProject } = useProjectSheet()

const isAnalyst = computed(() => props.track === 'analyst')
const owner = computed(() => customerOf(props.project).name)
const chips = computed(() =>
  isAnalyst.value
    ? (props.project.deliverables ?? []).map(code => ({
        key: code,
        label: t(`deliverables.${code}`),
        matched: props.matchCategory === 'analysis'
      }))
    : props.project.technologies.map(tech => ({
        key: tech,
        label: tech,
        matched: props.matchCategory !== null && techMatchesSkill(tech, props.matchCategory)
      }))
)
const shown = computed(() => chips.value.slice(0, MAX_CHIPS))
const extra = computed(() => chips.value.length - shown.value.length)

const accent = computed(() => (isAnalyst.value ? 'border-l-domain-ai' : 'border-l-primary-container'))
const ring = computed(() =>
  props.highlighted ? `ring-2 shadow-lg ${isAnalyst.value ? 'ring-domain-ai' : 'ring-primary-container'}` : ''
)
</script>

<template>
  <button
    :id="`${track}-${project.slug}`"
    type="button"
    class="scroll-mt-20 w-full text-left bg-content-bg rounded-xl shadow-md border-l-4 p-space-md flex flex-col gap-space-xs active:scale-[0.99] transition-all duration-300"
    :class="[accent, ring]"
    :aria-label="`${t(`projects.${project.slug}.title`)} — ${t('card.openDetails')}`"
    @click="openProject(project.slug, track)"
  >
    <span class="flex items-start justify-between gap-space-xs">
      <span class="text-headline-sm text-text-primary">{{ t(`projects.${project.slug}.title`) }}</span>
      <AwardBadge v-if="project.achievementId" :achievement-id="project.achievementId" />
    </span>

    <span class="text-label-sm text-text-muted">
      {{ t(`domains.${project.domain}`) }} · {{ t(`roles.${project.role}`) }} ·
      {{ t('common.team', { n: project.teamSize }) }} · {{ project.period }}
    </span>
    <span class="text-label-sm text-text-muted">{{ t('card.client') }}: {{ owner }}</span>

    <span class="text-body-md text-text-secondary line-clamp-2">{{ t(`projects.${project.slug}.summary`) }}</span>

    <span class="flex flex-wrap items-center gap-1 mt-1">
      <span
        v-for="chip in shown"
        :key="chip.key"
        class="px-2 py-0.5 rounded-full text-label-sm font-medium transition-colors"
        :class="chip.matched ? 'bg-primary-container text-on-primary-container' : 'bg-slate-100 text-text-secondary'"
      >{{ chip.label }}</span>
      <span v-if="extra > 0" class="px-2 py-0.5 rounded-full bg-slate-100 text-text-muted text-label-sm">
        {{ t('card.moreChips', { n: extra }) }}
      </span>
      <span class="ml-auto inline-flex items-center text-label-sm font-semibold" :class="isAnalyst ? 'text-domain-ai' : 'text-primary-container'">
        {{ t('card.openDetails') }}
        <span class="material-symbols-outlined text-[16px]" aria-hidden="true">chevron_right</span>
      </span>
    </span>
  </button>
</template>
