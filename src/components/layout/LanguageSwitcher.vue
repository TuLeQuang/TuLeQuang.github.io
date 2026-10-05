<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useLocale } from '@/composables/useLocale'
import type { Locale } from '@/types'

const { t } = useI18n()
const { locale, setLocale } = useLocale()

interface LangOption {
  code: Locale
  flag: string
  label: string
  title: string
}

const languageOptions: LangOption[] = [
  { code: 'en', flag: '🇬🇧', label: 'ENG', title: 'English' },
  { code: 'vi', flag: '🇻🇳', label: 'VN', title: 'Tiếng Việt' }
]
</script>

<template>
  <div
    role="radiogroup"
    :aria-label="t('lang.switch')"
    class="inline-flex items-center h-8 rounded-full bg-surface-container p-0.5 shrink-0"
  >
    <button
      v-for="item in languageOptions"
      :key="item.code"
      type="button"
      role="radio"
      :aria-checked="locale === item.code"
      :aria-pressed="locale === item.code"
      :aria-label="item.title"
      :title="item.title"
      class="h-7 px-2.5 rounded-full text-label-md font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer select-none"
      :class="
        locale === item.code
          ? 'bg-primary-container text-on-primary-container shadow-xs'
          : 'text-on-surface-variant hover:text-on-surface'
      "
      @click="setLocale(item.code)"
    >
      <span class="text-base leading-none" aria-hidden="true">{{ item.flag }}</span>
      <span>{{ item.label }}</span>
    </button>
  </div>
</template>
