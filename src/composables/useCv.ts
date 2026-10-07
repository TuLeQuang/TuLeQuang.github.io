import { computed, type ComputedRef } from 'vue'
import { i18n } from '@/i18n'
import { cvData } from '@/data/resume'
import type { CvContent, CvMeta, FocusState, Locale } from '@/types'

/** Language-neutral presentation data from content/cv.md (icons, colours, keywords, start years…). */
export const cvMeta: CvMeta = cvData.meta

/** CV texts of a locale (EN / VI, already resolved at build time). */
export const cvContentOf = (locale: Locale): CvContent => cvData.content[locale]

const content = computed<CvContent>(() => cvContentOf(i18n.global.locale.value))

/**
 * CV texts of the active locale. Reactive: switching language updates every text without reload.
 * In templates: `cv.projects[slug].title`; in scripts: `cv.value.projects[slug].title`.
 * UI labels (buttons, headings…) still come from vue-i18n `t()`.
 */
export function useCv(): ComputedRef<CvContent> {
  return content
}

/** Fill `{name}` placeholders of a CV text (e.g. "{n}+ years …"). Unknown placeholders are kept. */
export const fill = (text: string, params: Record<string, string | number> = {}): string =>
  text.replace(/\{(\w+)\}/g, (match, key: string) => (key in params ? String(params[key]) : match))

/** Value at a dot path of the active CV content (e.g. 'domains.AI'). */
export const cvText = (path: string): string => {
  const value = path.split('.').reduce<unknown>((node, key) => (node as Record<string, unknown> | undefined)?.[key], content.value)
  return typeof value === 'string' ? value : path
}

/** Header breadcrumb / focus chip label of the current focus. */
export const focusLabel = (focus: FocusState | null): string => (focus ? cvText(focus.labelPath) : '')
