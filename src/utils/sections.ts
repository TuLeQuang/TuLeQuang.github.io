import type { ProjectTrack } from '@/types'
import { baYears, careerYears } from '@/utils/experience'

/** Section anchors (ids come from code.html so header links match 1:1). */
export const SECTION_IDS = ['skill-galaxy', 'the-builder', 'the-transition', 'the-analyst', 'contact'] as const
export type SectionId = (typeof SECTION_IDS)[number]

/** i18n key of each header link. */
export const SECTION_NAV_KEYS: Record<SectionId, string> = {
  'skill-galaxy': 'nav.galaxy',
  'the-builder': 'nav.builder',
  'the-transition': 'nav.transition',
  'the-analyst': 'nav.analyst',
  contact: 'nav.contact'
}

/** Mobile reading order: BA-first (Q-M3). Desktop keeps SECTION_IDS order. */
export const MOBILE_SECTION_ORDER: SectionId[] = ['skill-galaxy', 'the-analyst', 'the-transition', 'the-builder', 'contact']

/** Interpolation params of a nav label ("The Builder ({n}+ yrs Dev)"). */
export const navParams = (id: SectionId): Record<string, number> => {
  if (id === 'the-builder') return { n: careerYears() }
  if (id === 'the-analyst') return { n: baYears() }
  return {}
}

export const TRACK_SECTION: Record<ProjectTrack, SectionId> = {
  builder: 'the-builder',
  analyst: 'the-analyst'
}

export const scrollToSection = (id: SectionId): void => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
