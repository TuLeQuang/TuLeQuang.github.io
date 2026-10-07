import { readonly, ref } from 'vue'
import { resumeData } from '@/data/resume'
import { categoryOfTech } from '@/utils/styleMaps'
import { scrollToSection, scrollToProject, TRACK_SECTION } from '@/utils/sections'
import { projectMatchesFocus } from '@/utils/focusMatch'
import type { CompanyId, FocusState, ProjectDomain, ProjectTrack, SkillCategory } from '@/types'

/** Galaxy node currently hovered (drives line glow; other nodes are never dimmed). */
export type HoverTarget = SkillCategory | 'hub' | null

// Module-level state: shared by every component that calls useFocus()
const focus = ref<FocusState | null>(null)
const hovered = ref<HoverTarget>(null)

const isSame = (next: FocusState): boolean =>
  focus.value?.kind === next.kind && focus.value.value === next.value

/** Set (or toggle off) the focus, then optionally scroll to the related section or highlighted project. */
const apply = (next: FocusState, scroll: 'track' | 'galaxy' | 'none' = 'track'): void => {
  if (isSame(next)) {
    focus.value = null
    return
  }
  focus.value = next
  if (scroll === 'track') {
    // If the focus matches specific project(s), scroll directly to the first highlighted card
    const matchingProject = resumeData.projects.find(
      p => p.tracks.includes(next.track) && projectMatchesFocus(p, next)
    )
    if (matchingProject) {
      setTimeout(() => {
        scrollToProject(matchingProject.slug, next.track)
      }, 80)
      return
    }
    scrollToSection(TRACK_SECTION[next.track])
  }
  if (scroll === 'galaxy') scrollToSection('all-about-me')
}

const trackOfSkill = (category: SkillCategory): ProjectTrack => (category === 'analysis' ? 'analyst' : 'builder')

/** A domain belongs to the Analyst track only if an analyst project has it (AdTech → Builder). */
export const trackOfDomain = (domain: ProjectDomain): ProjectTrack =>
  resumeData.projects.some(p => p.domain === domain && p.tracks.includes('analyst')) ? 'analyst' : 'builder'

export function useFocus() {
  /** `scroll: 'none'` lets in-section controls (Builder skill columns) toggle without jumping. */
  const focusSkill = (category: SkillCategory, scroll: 'track' | 'none' = 'track'): void =>
    apply({ kind: 'skill', value: category, track: trackOfSkill(category), labelPath: `clusters.${category}.label` }, scroll)

  const focusCompany = (
    company: CompanyId,
    scroll: 'track' | 'none' = 'track',
    track: ProjectTrack = 'builder'
  ): void => {
    const key = resumeData.companies.find(c => c.name === company)?.i18nKey ?? company
    apply({ kind: 'company', value: company, track, labelPath: `companies.${key}.name` }, scroll)
  }

  const focusCustomer = (customer: string, scroll: 'track' | 'none' = 'track'): void => {
    apply({ kind: 'customer', value: customer, track: 'builder', labelPath: `customers.${customer}` }, scroll)
  }

  const focusDomain = (domain: ProjectDomain, scroll: 'track' | 'none' = 'track'): void => {
    apply({ kind: 'domain', value: domain, track: trackOfDomain(domain), labelPath: `domains.${domain}` }, scroll)
  }

  const focusAchievement = (id: string): void => {
    const achievement = resumeData.achievements.find(a => a.id === id)
    if (!achievement) return
    apply({ kind: 'achievement', value: id, track: achievement.track, labelPath: `achievements.${id}` })
  }

  /** Smart Tag: a tech chip in a card highlights related skill and keeps current position (Requirement 2.2). */
  const focusTech = (tech: string): void => {
    const category = categoryOfTech(tech)
    if (!category) return
    apply(
      { kind: 'skill', value: category, track: trackOfSkill(category), labelPath: `clusters.${category}.label` },
      'none'
    )
  }

  const clear = (): void => {
    focus.value = null
  }

  const setHovered = (target: HoverTarget): void => {
    hovered.value = target
  }

  return {
    focus: readonly(focus),
    hovered: readonly(hovered),
    focusSkill,
    focusCompany,
    focusCustomer,
    focusDomain,
    focusAchievement,
    focusTech,
    clear,
    setHovered
  }
}
