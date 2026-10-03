<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import InfoSatellite from './InfoSatellite.vue'
import { resumeData } from '@/data/resume'
import { useFocus } from '@/composables/useFocus'
import { keyClientsOf } from '@/utils/customers'
import { companyYears } from '@/utils/experience'

const { t } = useI18n()
const { focus, focusCompany, focusAchievement } = useFocus()
const { education, companies, achievements, projects } = resumeData

const isFocused = (kind: 'company' | 'achievement', value: string): boolean =>
  focus.value?.kind === kind && focus.value.value === value

/** "(AI Agent)" / "(CMC Global)" suffix: linked project title, otherwise the company. */
const achievementContext = (projectSlug: string | undefined, company: string): string => {
  const project = projects.find(p => p.slug === projectSlug)
  return project ? t(`projects.${project.slug}.title`) : company
}

const iconColor = ['text-tertiary', 'text-primary', 'text-gold-light']
const rowButton = 'w-full rounded-md px-1 -mx-1 transition-colors hover:bg-surface-container-high/70 text-left'
</script>

<template>
  <div class="w-full grid grid-cols-1 md:grid-cols-3 gap-space-lg mt-space-3xl z-20">
    <InfoSatellite icon="school" :title="t('galaxy.satellites.education')" accent-class="text-primary">
      <h4 class="text-headline-sm text-on-surface">{{ t('galaxy.education.school') }}</h4>
      <p class="text-body-md text-on-surface-variant">{{ t('galaxy.education.major') }} ({{ education.period }})</p>
      <div class="mt-space-xs inline-flex items-center gap-1 text-label-md text-tertiary font-semibold">
        <span>{{ t('galaxy.education.gpa', { gpa: education.gpa }) }}</span>
      </div>
    </InfoSatellite>

    <InfoSatellite icon="timeline" :title="t('galaxy.satellites.tenures')" accent-class="text-secondary">
      <div class="flex flex-col gap-1">
        <button
          v-for="company in companies"
          :key="company.name"
          type="button"
          class="flex flex-col text-body-md"
          :class="[rowButton, isFocused('company', company.name) ? 'bg-surface-container-high ring-1 ring-secondary/50' : '']"
          @click="focusCompany(company.name)"
        >
          <span class="flex justify-between items-center gap-space-sm">
            <span class="text-on-surface font-semibold">{{ company.name }}</span>
            <span class="text-on-surface-variant text-label-sm text-right">
              {{ t('common.yearsApprox', { n: companyYears(company) }) }} • {{ t(`companies.${company.i18nKey}.role`) }}
            </span>
          </span>
          <!-- Samsung is a client of CMC Global, not an employer -->
          <span v-if="keyClientsOf(company.name).length" class="flex items-center gap-0.5 text-label-sm text-secondary/90">
            <span class="material-symbols-outlined text-[14px]" aria-hidden="true">subdirectory_arrow_right</span>
            {{ t('galaxy.keyClients', { names: keyClientsOf(company.name).map(c => c.name).join(', ') }) }}
          </span>
        </button>
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
          {{ t(`achievements.${achievement.id}`) }} ({{ achievementContext(achievement.projectSlug, achievement.company) }})
        </button>
      </div>
    </InfoSatellite>
  </div>
</template>
