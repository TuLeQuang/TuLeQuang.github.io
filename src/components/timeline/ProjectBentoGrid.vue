<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import BentoProjectCard from './BentoProjectCard.vue'
import FilterBar from './FilterBar.vue'
import { resumeData } from '@/data/resume'
import { useFocus } from '@/composables/useFocus'
import { keyClientsOf } from '@/utils/customers'
import { projectMatchesFocus } from '@/utils/focusMatch'
import type { FilterOption, Project, ProjectTrack, SkillCategory } from '@/types'

const props = defineProps<{ track: ProjectTrack }>()

const { t } = useI18n()
const { focus } = useFocus()
const active = ref('all')

const projects = computed(() => resumeData.projects.filter(p => p.tracks.includes(props.track)))

/** id = 'all' | 'company:X' | 'customer:X' | 'domain:X' */
const matchesFilter = (project: Project, id: string): boolean => {
  if (id === 'all') return true
  const [kind, value] = id.split(':')
  if (kind === 'company') return project.company === value
  if (kind === 'customer') return project.customer === value
  return project.domain === value
}

/**
 * Each employer (newest first) followed by its key clients nested under it
 * (CMC Global → Samsung), then domains on the Analyst track. Empty options are hidden.
 */
const options = computed<FilterOption[]>(() => {
  const byCompany = [...resumeData.companies].reverse().flatMap(company => {
    const parentId = `company:${company.name}`
    const clients = keyClientsOf(company.name).map(client => ({
      id: `customer:${client.id}`,
      label: client.name,
      parentId,
      hint: t('card.clientOf', { customer: client.name, company: company.name })
    }))
    return [{ id: parentId, label: company.name }, ...clients]
  })
  const domains =
    props.track === 'analyst' ? resumeData.baDomains.map(d => ({ id: `domain:${d}`, label: t(`domains.${d}`) })) : []
  const counted = [...byCompany, ...domains].map(o => ({
    ...o,
    count: projects.value.filter(p => matchesFilter(p, o.id)).length
  }))
  return [{ id: 'all', label: '', count: projects.value.length }, ...counted].filter(o => o.count > 0)
})

/** Filter buttons are an explicit user choice; focus never hides cards. */
const visible = computed(() => projects.value.filter(p => matchesFilter(p, active.value)))

/** Any focus (skill / company / domain / achievement) highlights matching cards — the rest stay untouched. */
const isHighlighted = (project: Project): boolean => (focus.value ? projectMatchesFocus(project, focus.value) : false)

const matchCategory = computed<SkillCategory | null>(() =>
  focus.value?.kind === 'skill' ? (focus.value.value as SkillCategory) : null
)
</script>

<template>
  <div class="lg:col-span-8 flex flex-col gap-space-lg">
    <FilterBar :options="options" :active="active" :tone="track" @select="active = $event" />
    <TransitionGroup
      tag="div"
      class="relative grid grid-cols-1 md:grid-cols-2 gap-space-lg"
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-2"
      leave-active-class="transition duration-150 ease-in"
      leave-to-class="opacity-0"
      move-class="transition-transform duration-300"
    >
      <BentoProjectCard
        v-for="project in visible"
        :key="project.slug"
        :project="project"
        :track="track"
        :highlighted="isHighlighted(project)"
        :match-category="matchCategory"
      />
    </TransitionGroup>
  </div>
</template>
