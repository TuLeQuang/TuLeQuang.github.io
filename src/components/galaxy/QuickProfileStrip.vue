<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import HScroll from '@/components/common/HScroll.vue'
import { resumeData } from '@/data/resume'
import { useFocus } from '@/composables/useFocus'
import { keyClientsOf } from '@/utils/customers'
import { companyYears } from '@/utils/experience'
import type { FocusState } from '@/types'

/**
 * Mobile "Quick profile" strip under the hero: education, employers, key client, awards.
 * Same tap behaviour as SatelliteGrid on desktop (Q17: company → Builder filter, award → card).
 */
const { t } = useI18n()
const { focus, focusCompany, focusCustomer, focusAchievement } = useFocus()
const { education, achievements } = resumeData
const companies = [...resumeData.companies].reverse()

const isActive = (kind: FocusState['kind'], value: string): boolean =>
  focus.value?.kind === kind && focus.value.value === value

const card =
  'snap-start shrink-0 w-[220px] min-h-[88px] rounded-xl border bg-surface-container/70 backdrop-blur-md p-space-sm text-left flex flex-col gap-0.5 transition-colors'
const ring = (active: boolean): string => (active ? 'border-secondary ring-1 ring-secondary/60' : 'border-outline-variant/40')
</script>

<template>
  <div class="relative z-10 w-full">
    <h2 class="text-label-sm text-on-surface-variant uppercase tracking-wider mb-space-xs">{{ t('hero.quickProfile') }}</h2>
    <HScroll :label="t('hero.quickProfile')">
      <div :class="[card, ring(false)]">
        <span class="text-label-sm text-primary">🎓 {{ t('galaxy.satellites.education') }}</span>
        <span class="text-headline-sm text-on-surface line-clamp-2">{{ t('galaxy.education.school') }}</span>
        <span class="text-label-sm text-on-surface-variant">{{ t('galaxy.education.major') }} · {{ t('galaxy.education.gpa', { gpa: education.gpa }) }}</span>
      </div>

      <template v-for="company in companies" :key="company.name">
        <button type="button" :class="[card, ring(isActive('company', company.name))]" @click="focusCompany(company.name)">
          <span class="text-label-sm text-secondary">🏢 {{ t('common.yearsApprox', { n: companyYears(company) }) }}</span>
          <span class="text-headline-sm text-on-surface">{{ company.name }}</span>
          <span class="text-label-sm text-on-surface-variant line-clamp-2">{{ t(`companies.${company.i18nKey}.role`) }}</span>
        </button>
        <button
          v-for="client in keyClientsOf(company.name)"
          :key="client.id"
          type="button"
          :class="[card, ring(isActive('customer', client.id))]"
          @click="focusCustomer(client.id)"
        >
          <span class="text-label-sm text-secondary">↳ {{ t('galaxy.keyClientsLabel') }}</span>
          <span class="text-headline-sm text-on-surface">{{ client.name }}</span>
          <span class="text-label-sm text-on-surface-variant">{{ t('card.clientOf', { customer: client.name, company: company.name }) }}</span>
        </button>
      </template>

      <button
        v-for="achievement in achievements"
        :key="achievement.id"
        type="button"
        :class="[card, ring(isActive('achievement', achievement.id))]"
        @click="focusAchievement(achievement.id)"
      >
        <span class="text-label-sm text-tertiary">{{ achievement.icon }} {{ achievement.company }}</span>
        <span class="text-headline-sm text-on-surface">{{ t(`achievements.${achievement.id}`) }}</span>
      </button>
    </HScroll>
  </div>
</template>
