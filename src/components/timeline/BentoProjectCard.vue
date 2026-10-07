<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AwardBadge from '@/components/common/AwardBadge.vue'
import DomainBadge from '@/components/common/DomainBadge.vue'
import TechChip from '@/components/common/TechChip.vue'
import ProjectDrawer from './ProjectDrawer.vue'
import { useFocus } from '@/composables/useFocus'
import { customerOf } from '@/utils/customers'
import { isDualRole, roleStyles, techMatchesSkill } from '@/utils/styleMaps'
import type { Project, ProjectTrack, SkillCategory } from '@/types'
import { useCv } from '@/composables/useCv'

const props = defineProps<{
  project: Project
  track: ProjectTrack
  /** Matches the current focus → ring + lift (other cards are not dimmed) */
  highlighted: boolean
  /** Galaxy skill currently focused → matching chips light up */
  matchCategory: SkillCategory | null
}>()

const { t } = useI18n()
const cv = useCv()
const { focusTech } = useFocus()
const open = ref(false)

const isFeatured = computed(() => props.project.layout === 'featured')
const isAnalyst = computed(() => props.track === 'analyst')
const customer = computed(() => customerOf(props.project))
/** Key client → "Samsung · client of CMC Global"; otherwise the customer name (Vccorp, CMC's Customer). */
const owner = computed(() =>
  customer.value.keyClient
    ? t('card.clientOf', { customer: customer.value.name, company: customer.value.company })
    : customer.value.name
)
const chips = computed(() =>
  isAnalyst.value
    ? (props.project.deliverables ?? []).map(code => ({ key: code, label: cv.value.deliverables[code], matched: props.matchCategory === 'analysis' }))
    : props.project.technologies.map(tech => ({
        key: tech,
        label: tech,
        matched: props.matchCategory !== null && techMatchesSkill(tech, props.matchCategory)
      }))
)

const stateClass = computed(() =>
  props.highlighted ? `scale-[1.02] shadow-xl ring-2 ${isAnalyst.value ? 'ring-domain-ai' : 'ring-primary-container'}` : ''
)
const titleHover = computed(() => (isAnalyst.value ? 'group-hover:text-domain-ai' : 'group-hover:text-primary-container'))
</script>

<template>
  <article
    :id="`${track}-${project.slug}`"
    class="scroll-mt-24 md:scroll-mt-28 bg-content-bg rounded-xl shadow-md transition-all duration-300 group cursor-pointer flex flex-col justify-between"
    :class="[
      project.layout ? 'md:col-span-2' : '',
      isFeatured ? 'p-space-lg sm:p-space-xl hover:shadow-xl' : 'p-space-lg hover:shadow-lg',
      stateClass
    ]"
    @click="open = !open"
  >
    <div>
      <!-- Featured header: badges left, period right -->
      <div v-if="isFeatured" class="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs mb-space-sm">
        <div class="flex items-center gap-space-xs flex-wrap">
          <DomainBadge :domain="project.domain" />
          <AwardBadge v-if="project.achievementId" :achievement-id="project.achievementId" />
          <span class="px-space-sm py-0.5 rounded-full bg-slate-100 text-text-secondary text-label-sm font-medium">{{ owner }}</span>
          <span class="px-space-sm py-0.5 rounded-full text-label-sm font-bold" :class="roleStyles[project.role]">
            {{ cv.roles[project.role] }} · {{ t('common.team', { n: project.teamSize }) }}
          </span>
        </div>
        <span class="text-label-sm text-text-muted whitespace-nowrap">{{ project.period }}</span>
      </div>
      <!-- Standard header: domain left, award / dual role / owner right -->
      <div v-else class="flex items-center justify-between gap-space-xs mb-space-xs">
        <DomainBadge :domain="project.domain" />
        <AwardBadge v-if="project.achievementId" :achievement-id="project.achievementId" />
        <span v-else-if="isDualRole(project.role)" class="px-2 py-0.5 rounded-full text-label-sm font-bold" :class="roleStyles[project.role]">
          {{ t('card.dualRole') }}
        </span>
        <span v-else class="text-label-sm text-text-muted">{{ owner }}</span>
      </div>

      <component
        :is="isFeatured ? 'h3' : 'h4'"
        class="text-text-primary transition-colors"
        :class="[isFeatured ? 'text-headline-lg' : 'text-headline-md', titleHover]"
      >
        {{ cv.projects[project.slug]?.title }}
      </component>
      <p class="text-text-secondary mt-space-xs" :class="isFeatured ? 'text-body-lg leading-relaxed' : 'text-body-md'">
        {{ cv.projects[project.slug]?.summary }}
      </p>

      <div class="flex flex-wrap" :class="isFeatured ? 'gap-space-xs mt-space-md' : 'gap-1 mt-space-sm'">
        <TechChip
          v-for="chip in chips"
          :key="chip.key"
          :label="chip.label"
          :size="isFeatured ? 'md' : 'sm'"
          :tone="isAnalyst && isFeatured ? 'deliverable' : 'neutral'"
          :matched="chip.matched"
          :clickable="!isAnalyst"
          @select="focusTech(chip.key)"
        />
      </div>
    </div>

    <div>
      <div v-if="!isFeatured" class="mt-space-md pt-space-xs flex flex-wrap items-center justify-between gap-x-space-sm text-text-muted text-label-sm">
        <span>{{ t('card.roleLine', { role: cv.roles[project.role] }) }}</span>
        <span>{{ t('card.teamSize', { n: project.teamSize }) }} · {{ project.period }}</span>
      </div>
      <ProjectDrawer
        :slug="project.slug"
        :open="open"
        :tone="track"
        :deliverables="project.deliverables"
        :matched="matchCategory === 'analysis'"
        @toggle="open = !open"
      />
    </div>
  </article>
</template>
