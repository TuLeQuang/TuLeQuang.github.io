<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useLocale } from '@/composables/useLocale'

const { t } = useI18n()
const { locale, locales, setLocale } = useLocale()
</script>

<template>
  <div
    role="radiogroup"
    :aria-label="t('lang.switch')"
    class="inline-flex items-center h-8 rounded-full bg-surface-container p-0.5 shrink-0"
  >
    <button
      v-for="code in locales"
      :key="code"
      type="button"
      role="radio"
      :aria-checked="locale === code"
      :aria-pressed="locale === code"
      class="h-7 px-space-sm rounded-full text-label-md font-semibold transition-colors"
      :class="
        locale === code
          ? 'bg-primary-container text-on-primary-container'
          : 'text-on-surface-variant hover:text-on-surface'
      "
      @click="setLocale(code)"
    >
      {{ t(`lang.${code}`) }}
    </button>
  </div>
</template>
