import { createI18n } from 'vue-i18n'
import en from '@/locales/en.json'
import vi from '@/locales/vi.json'
import type { Locale } from '@/types'

/** Message schema follows en.json — vi.json must keep the same keys (checked in Phase 6). */
export type MessageSchema = typeof en

export const SUPPORTED_LOCALES: Locale[] = ['vi', 'en']
export const LOCALE_STORAGE_KEY = 'locale'

const isLocale = (value: unknown): value is Locale =>
  typeof value === 'string' && (SUPPORTED_LOCALES as string[]).includes(value)

/** localStorage first, then the browser language (vi-* → vi, otherwise en). */
export const detectInitialLocale = (): Locale => {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY)
    if (isLocale(stored)) return stored
  } catch {
    // localStorage may be unavailable (private mode) — fall through
  }
  const browser = typeof navigator !== 'undefined' ? navigator.language : 'en'
  return browser.toLowerCase().startsWith('vi') ? 'vi' : 'en'
}

export const i18n = createI18n<[MessageSchema], Locale, false>({
  legacy: false,
  locale: detectInitialLocale(),
  fallbackLocale: 'en',
  messages: { en, vi }
})
