import type { ProjectTrack } from '@/types'
import { baYears, careerYears } from '@/utils/experience'

/** Section anchors (matching English titles of sections). */
export const SECTION_IDS = ['all-about-me', 'the-builder', 'the-pivot-story', 'the-analyst', 'contact'] as const
export type SectionId = (typeof SECTION_IDS)[number]

/** i18n key of each header link. */
export const SECTION_NAV_KEYS: Record<SectionId, string> = {
  'all-about-me': 'nav.galaxy',
  'the-builder': 'nav.builder',
  'the-pivot-story': 'nav.transition',
  'the-analyst': 'nav.analyst',
  contact: 'nav.contact'
}

/** Mobile reading order: BA-first (Q-M3). Desktop keeps SECTION_IDS order. */
export const MOBILE_SECTION_ORDER: SectionId[] = ['all-about-me', 'the-analyst', 'the-pivot-story', 'the-builder', 'contact']

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

export const scrollToProject = (slug: string, track: ProjectTrack): void => {
  const el = document.getElementById(`${track}-${slug}`)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  } else {
    scrollToSection(TRACK_SECTION[track])
  }
}
