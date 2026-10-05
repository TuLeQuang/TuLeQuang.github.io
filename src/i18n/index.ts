import { createI18n } from 'vue-i18n'
import en from '@/locales/en.json'
import vi from '@/locales/vi.json'
import type { Locale } from '@/types'

/** Message schema follows en.json — vi.json must keep the same keys (checked in Phase 6). */
export type MessageSchema = typeof en

export const SUPPORTED_LOCALES: Locale[] = ['en', 'vi']
export const LOCALE_STORAGE_KEY = 'locale'

const isLocale = (value: unknown): value is Locale =>
  typeof value === 'string' && (SUPPORTED_LOCALES as string[]).includes(value)

/** localStorage first; defaults to 'en' on first access. */
export const detectInitialLocale = (): Locale => {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY)
    if (isLocale(stored)) return stored
  } catch {
    // localStorage may be unavailable (private mode) — fall through
  }
  return 'en'
}

export const i18n = createI18n<[MessageSchema], Locale, false>({
  legacy: false,
  locale: detectInitialLocale(),
  fallbackLocale: 'en',
  messages: { en, vi }
})
