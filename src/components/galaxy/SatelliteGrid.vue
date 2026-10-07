<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import InfoSatellite from './InfoSatellite.vue'
import { resumeData } from '@/data/resume'
import { useFocus } from '@/composables/useFocus'
import { keyClientsOf } from '@/utils/customers'
import { companyYears } from '@/utils/experience'
import type { CompanyId } from '@/types'
import { useCv } from '@/composables/useCv'

const { t } = useI18n()
const cv = useCv()
const { focus, focusCompany, focusCustomer, focusAchievement } = useFocus()
const { education, companies, achievements, projects } = resumeData

const isFocused = (kind: 'company' | 'customer' | 'achievement', value: string): boolean =>
  focus.value?.kind === kind && focus.value.value === value

const isCompanyActive = (companyName: CompanyId): boolean => {
  if (isFocused('company', companyName)) return true
  if (focus.value?.kind === 'customer' && keyClientsOf(companyName).some(c => c.id === focus.value?.value)) return true
  return false
}

/** "(AI Agent)" / "(CMC Global)" suffix: linked project title, otherwise the company. */
const achievementContext = (projectSlug: string | undefined, company: string): string => {
  const project = projects.find(p => p.slug === projectSlug)
  return project ? cv.value.projects[project.slug]?.title ?? project.slug : company
}

const iconColor = ['text-tertiary', 'text-primary', 'text-gold-light']
const rowButton = 'w-full rounded-md px-1 -mx-1 transition-colors hover:bg-surface-container-high/70 text-left'
</script>

<template>
  <div class="w-full grid grid-cols-1 md:grid-cols-3 gap-space-md lg:gap-space-lg mt-1 z-20">
    <InfoSatellite icon="school" :title="t('galaxy.satellites.education')" accent-class="text-primary">
      <h4 class="text-headline-sm text-on-surface">{{ cv.education.school }}</h4>
      <p class="text-body-md text-on-surface-variant">{{ cv.education.major }} ({{ education.period }})</p>
      <div class="mt-space-xs inline-flex items-center gap-1 text-label-md text-tertiary font-semibold">
        <span>{{ t('galaxy.education.gpa', { gpa: education.gpa }) }}</span>
      </div>
    </InfoSatellite>

    <InfoSatellite icon="timeline" :title="t('galaxy.satellites.tenures')" accent-class="text-secondary">
      <div class="flex flex-col gap-1">
        <div
          v-for="company in companies"
          :key="company.name"
          class="flex flex-col text-body-md rounded-md p-1 -mx-1 transition-colors"
          :class="[
            isCompanyActive(company.name)
              ? 'bg-surface-container-high ring-1 ring-secondary/50'
              : 'hover:bg-surface-container-high/50'
          ]"
        >
          <button
            type="button"
            class="w-full flex justify-between items-center gap-space-sm text-left cursor-pointer"
            @click="focusCompany(company.name)"
          >
            <span class="text-on-surface font-semibold hover:text-secondary transition-colors">{{ company.name }}</span>
            <span class="text-on-surface-variant text-label-sm text-right">
              {{ t('common.yearsApprox', { n: companyYears(company) }) }} • {{ cv.companies[company.i18nKey]?.role }}
            </span>
          </button>
          <!-- Samsung is a client of CMC Global, not an employer -->
          <div v-if="keyClientsOf(company.name).length" class="flex items-center gap-1 text-label-sm text-secondary/90 mt-0.5">
            <span class="material-symbols-outlined text-[14px]" aria-hidden="true">subdirectory_arrow_right</span>
            <span>{{ t('galaxy.keyClientsLabel') }}</span>
            <button
              v-for="client in keyClientsOf(company.name)"
              :key="client.id"
              type="button"
              class="font-semibold underline decoration-secondary/50 hover:text-secondary-fixed transition-colors cursor-pointer px-1 rounded hover:bg-secondary/20"
              :class="isFocused('customer', client.id) ? 'bg-secondary/30 text-secondary-fixed ring-1 ring-secondary/70 font-bold' : ''"
              @click.stop="focusCustomer(client.id)"
            >
              {{ client.name }}
            </button>
          </div>
        </div>
      </div>
    </InfoSatellite>

    <InfoSatellite icon="military_tech" :title="t('galaxy.satellites.accolades')" accent-class="text-tertiary">
      <div class="flex flex-col gap-1 text-label-md">
        <button
          v-for="(achievement, index) in achievements"
          :key="achievement.id"
          type="button"
          class="flex items-center gap-1.5 text-on-surface font-medium py-0.5"
          :class="[rowButton, isFocused('achievement', achievement.id) ? 'bg-surface-container-high ring-1 ring-tertiary/50' : '']"
          @click="focusAchievement(achievement.id)"
        >
          <span :class="iconColor[index % iconColor.length]">{{ achievement.icon }}</span>
          {{ cv.achievements[achievement.id] }} ({{ achievementContext(achievement.projectSlug, achievement.company) }})
        </button>
      </div>
    </InfoSatellite>
  </div>
</template>
