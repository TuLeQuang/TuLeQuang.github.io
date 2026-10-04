<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { resumeData } from '@/data/resume'
import { cvFileName, cvHref, telHref } from '@/utils/contact'
import { formatPhone } from '@/utils/styleMaps'
import type { Locale } from '@/types'

/** Large mobile action buttons: Email · Call (Q-M7) · Download CV (Q-M5). Shared by Contact + menu sheet. */
const props = withDefaults(defineProps<{ tone?: 'dark' | 'light' }>(), { tone: 'dark' })

const { t, locale } = useI18n()
const { email, phone } = resumeData.personalInfo
const current = computed(() => locale.value as Locale)

const secondary = computed(() =>
  props.tone === 'dark'
    ? 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
    : 'bg-content-surface text-text-primary hover:bg-slate-200'
)
const base = 'min-h-[52px] w-full px-space-md rounded-xl flex items-center gap-space-sm text-headline-sm transition-colors'
</script>

<template>
  <div class="flex flex-col gap-space-sm">
    <a :class="[base, 'bg-primary-container text-on-primary-container hover:bg-primary-blue-dark']" :href="`mailto:${email}`">
      <span class="material-symbols-outlined text-[22px]">mail</span>
      <span class="truncate">{{ email }}</span>
    </a>
    <a :class="[base, secondary]" :href="telHref(phone)">
      <span class="material-symbols-outlined text-[22px]">call</span>
      <span>{{ t('contact.call', { phone: formatPhone(phone) }) }}</span>
    </a>
    <a :class="[base, secondary]" :href="cvHref(current)" :download="cvFileName(current)" target="_blank" rel="noopener">
      <span class="material-symbols-outlined text-[22px]">download</span>
      <span>{{ t('contact.downloadCv') }}</span>
    </a>
  </div>
</template>
