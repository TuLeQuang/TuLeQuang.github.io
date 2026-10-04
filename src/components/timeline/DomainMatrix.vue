<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { resumeData } from '@/data/resume'
import { useFocus } from '@/composables/useFocus'
import { domainIcons } from '@/utils/styleMaps'
import type { ProjectDomain } from '@/types'

const { t } = useI18n()
const { focus, focusDomain } = useFocus()
const { baDomains, projects } = resumeData

const countOf = (domain: ProjectDomain): number => projects.filter(p => p.domain === domain).length
const isActive = (domain: ProjectDomain): boolean => focus.value?.kind === 'domain' && focus.value.value === domain
const onDomainClick = (domain: ProjectDomain): void => {
  focusDomain(domain, domain === 'AdTech' ? 'track' : 'none')
}
</script>

<template>
  <div v-reveal="100" class="bg-content-surface p-space-lg sm:p-space-xl rounded-xl shadow-xs flex flex-col justify-between">
    <div>
      <div class="flex items-center gap-space-xs text-domain-ai-text text-headline-sm mb-space-md">
        <span class="material-symbols-outlined text-[20px]">hub</span>
        <span>{{ t('analyst.domainTitle') }}</span>
      </div>
      <p class="text-body-md text-text-secondary mb-space-lg">{{ t('analyst.domainDesc') }}</p>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-space-sm">
        <button
          v-for="domain in baDomains"
          :key="domain"
          type="button"
          :aria-pressed="isActive(domain)"
          class="p-space-sm rounded-lg bg-content-bg shadow-xs flex flex-col text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
          :class="isActive(domain) ? 'ring-2 ring-domain-ai' : ''"
          @click="onDomainClick(domain)"
        >
          <span class="text-2xl mb-1" aria-hidden="true">{{ domainIcons[domain] }}</span>
          <span class="text-headline-sm text-text-primary">{{ t(`domains.${domain}`) }}</span>
          <span class="text-label-sm text-text-muted">{{ t('analyst.domainCount', countOf(domain)) }}</span>
        </button>
      </div>
    </div>
    <i18n-t keypath="analyst.domainTotal" tag="div" class="mt-space-lg text-text-muted text-label-sm">
      <template #n>
        <strong>{{ projects.length }}</strong>
      </template>
    </i18n-t>
  </div>
</template>
