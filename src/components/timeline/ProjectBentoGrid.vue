<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import BentoProjectCard from './BentoProjectCard.vue'
import FilterBar from './FilterBar.vue'
import { resumeData } from '@/data/resume'
import { useFocus } from '@/composables/useFocus'
import { keyClientsOf } from '@/utils/customers'
import { projectMatchesFocus } from '@/utils/focusMatch'
import type { CompanyId, FilterOption, Project, ProjectDomain, ProjectTrack, SkillCategory } from '@/types'

const props = defineProps<{ track: ProjectTrack }>()

const { t } = useI18n()
const { focus, focusCompany, focusCustomer, focusDomain, clear } = useFocus()
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
 * Filter change: updates active filter and synchronizes focus to highlight timeline milestones (Req 2.3).
 */
const onFilterSelect = (id: string): void => {
  if (id === 'all' || active.value === id) {
    active.value = 'all'
    clear()
    return
  }
  active.value = id
  const [kind, value] = id.split(':')
  if (kind === 'company') {
    focusCompany(value as CompanyId, 'none', props.track)
  } else if (kind === 'customer') {
    focusCustomer(value, 'none')
  } else if (kind === 'domain') {
    focusDomain(value as ProjectDomain, 'none')
  }
}

/**
 * Each employer followed by its key clients nested under it (CMC Global → Samsung).
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

watch(
  () => focus.value,
  (currentFocus) => {
    if (!currentFocus) {
      active.value = 'all'
      return
    }
    if (currentFocus.kind === 'company') {
      const targetId = `company:${currentFocus.value}`
      if (options.value.some(o => o.id === targetId)) {
        active.value = targetId
      }
    } else if (currentFocus.kind === 'customer') {
      const targetId = `customer:${currentFocus.value}`
      if (options.value.some(o => o.id === targetId)) {
        active.value = targetId
      }
    } else if (currentFocus.kind === 'domain' && props.track === 'analyst') {
      const targetId = `domain:${currentFocus.value}`
      if (options.value.some(o => o.id === targetId)) {
        active.value = targetId
      }
    }
  },
  { immediate: true }
)

const visible = computed(() => projects.value.filter(p => matchesFilter(p, active.value)))

const isHighlighted = (project: Project): boolean => (focus.value ? projectMatchesFocus(project, focus.value) : false)

const matchCategory = computed<SkillCategory | null>(() =>
  focus.value?.kind === 'skill' ? (focus.value.value as SkillCategory) : null
)
</script>

<template>
  <div v-reveal class="lg:col-span-8 flex flex-col gap-space-lg">
    <FilterBar :options="options" :active="active" :tone="track" @select="onFilterSelect" />
    <TransitionGroup
      tag="div"
      class="relative grid grid-cols-1 md:grid-cols-2 gap-space-lg"
      enter-active-class="transition-all duration-500 ease-out"
      enter-from-class="opacity-0 translate-y-6 scale-[0.98]"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
      move-class="transition-all duration-500 ease-out"
    >
      <BentoProjectCard
        v-for="(project, index) in visible"
        :key="project.slug"
        :project="project"
        :track="track"
        :highlighted="isHighlighted(project)"
        :match-category="matchCategory"
        :style="{ transitionDelay: `${index * 60}ms` }"
      />
    </TransitionGroup>
  </div>
</template>
