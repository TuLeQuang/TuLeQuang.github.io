<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import BottomSheet from '@/components/common/BottomSheet.vue'
import AwardBadge from '@/components/common/AwardBadge.vue'
import DomainBadge from '@/components/common/DomainBadge.vue'
import { useProjectSheet } from '@/composables/useProjectSheet'
import { resumeData } from '@/data/resume'
import { customerOf } from '@/utils/customers'
import { roleStyles } from '@/utils/styleMaps'
import { useCv } from '@/composables/useCv'

/** Mobile project details. One instance in App.vue, driven by useProjectSheet(). */
const { t } = useI18n()
const cv = useCv()
const { current, closeProject } = useProjectSheet()

const project = computed(() => {
  const slug = current.value?.slug
  return slug ? resumeData.projects.find(p => p.slug === slug) ?? null : null
})
const isAnalyst = computed(() => current.value?.track === 'analyst')
const title = computed(() => (project.value ? cv.value.projects[project.value.slug]?.title ?? '' : ''))

const owner = computed(() => {
  if (!project.value) return ''
  const customer = customerOf(project.value)
  return customer.keyClient ? t('card.clientOf', { customer: customer.name, company: customer.company }) : customer.name
})
const responsibilities = computed(() =>
  project.value
    ? cv.value.projects[project.value.slug]?.responsibilities ?? []
    : []
)
const heading = 'text-label-sm text-text-muted uppercase tracking-wider block mb-1'
</script>

<template>
  <BottomSheet :open="!!project" :label="title" @close="closeProject">
    <article v-if="project" class="flex flex-col gap-space-md text-text-secondary text-body-md">
      <header class="flex flex-col gap-space-xs">
        <div class="flex flex-wrap items-center gap-space-xs">
          <DomainBadge :domain="project.domain" />
          <AwardBadge v-if="project.achievementId" :achievement-id="project.achievementId" />
        </div>
        <h3 class="text-headline-lg text-text-primary">{{ title }}</h3>
        <div class="flex flex-wrap items-center gap-space-xs text-label-sm">
          <span class="px-space-sm py-0.5 rounded-full font-bold" :class="roleStyles[project.role]">
            {{ cv.roles[project.role] }} · {{ t('common.team', { n: project.teamSize }) }}
          </span>
          <span class="text-text-muted">{{ project.period }}</span>
        </div>
        <p class="text-label-md text-text-muted">{{ t('card.client') }}: {{ owner }}</p>
      </header>

      <p class="text-body-lg leading-relaxed">{{ cv.projects[project.slug]?.summary }}</p>

      <section>
        <span :class="heading">{{ t('card.responsibilities') }}</span>
        <ul class="flex flex-col gap-1">
          <li v-for="(item, index) in responsibilities" :key="index">• {{ item }}</li>
        </ul>
      </section>

      <section v-if="project.deliverables?.length">
        <span :class="heading">{{ t('card.deliverables') }}</span>
        <div class="flex flex-wrap gap-space-xs">
          <span
            v-for="code in project.deliverables"
            :key="code"
            class="px-2 py-0.5 rounded-full bg-domain-ai/10 text-domain-ai text-label-sm font-semibold"
          >✓ {{ cv.deliverables[code] }}</span>
        </div>
      </section>

      <section>
        <span :class="heading">{{ t('card.techStack') }}</span>
        <div class="flex flex-wrap gap-1">
          <span
            v-for="tech in project.technologies"
            :key="tech"
            class="px-2 py-0.5 rounded-full text-label-sm font-medium"
            :class="isAnalyst ? 'bg-slate-100 text-text-secondary' : 'bg-primary-container/10 text-primary-container'"
          >{{ tech }}</span>
        </div>
      </section>
    </article>
  </BottomSheet>
</template>
