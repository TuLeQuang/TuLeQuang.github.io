import { computed } from 'vue'
import { i18n, LOCALE_STORAGE_KEY, SUPPORTED_LOCALES } from '@/i18n'
import { cvContentOf } from '@/composables/useCv'
import type { Locale } from '@/types'

/** Sync <html lang> and <title> with the active locale. */
export const applyLocaleSideEffects = (locale: Locale): void => {
  document.documentElement.lang = locale
  document.title = i18n.global.t('meta.title', { name: cvContentOf(locale).profile.name })
}

/**
 * Language switching without reload: only the i18n locale changes,
 * so scroll position, filters and focus state are untouched.
 */
export function useLocale() {
  const locale = computed<Locale>(() => i18n.global.locale.value)

  const setLocale = (next: Locale): void => {
    if (next === i18n.global.locale.value) return
    i18n.global.locale.value = next
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, next)
    } catch {
      // ignore storage errors (private mode)
    }
    applyLocaleSideEffects(next)
  }

  return { locale, locales: SUPPORTED_LOCALES, setLocale }
}
