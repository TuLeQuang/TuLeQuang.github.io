import { readonly, ref } from 'vue'
import { resumeData } from '@/data/resume'
import { categoryOfTech } from '@/utils/styleMaps'
import { scrollToSection, TRACK_SECTION } from '@/utils/sections'
import type { CompanyId, FocusState, ProjectDomain, ProjectTrack, SkillCategory } from '@/types'

/** Galaxy node currently hovered (drives line glow; other nodes are never dimmed). */
export type HoverTarget = SkillCategory | 'hub' | null

// Module-level state: shared by every component that calls useFocus()
const focus = ref<FocusState | null>(null)
const hovered = ref<HoverTarget>(null)

const isSame = (next: FocusState): boolean =>
  focus.value?.kind === next.kind && focus.value.value === next.value

/** Set (or toggle off) the focus, then optionally scroll to the related section. */
const apply = (next: FocusState, scroll: 'track' | 'galaxy' | 'none' = 'track'): void => {
  if (isSame(next)) {
    focus.value = null
    return
  }
  focus.value = next
  if (scroll === 'track') scrollToSection(TRACK_SECTION[next.track])
  if (scroll === 'galaxy') scrollToSection('skill-galaxy')
}

const trackOfSkill = (category: SkillCategory): ProjectTrack => (category === 'analysis' ? 'analyst' : 'builder')

/** A domain belongs to the Analyst track only if an analyst project has it (AdTech → Builder). */
const trackOfDomain = (domain: ProjectDomain): ProjectTrack =>
  resumeData.projects.some(p => p.domain === domain && p.tracks.includes('analyst')) ? 'analyst' : 'builder'

export function useFocus() {
  /** `scroll: 'none'` lets in-section controls (Builder skill columns) toggle without jumping. */
  const focusSkill = (category: SkillCategory, scroll: 'track' | 'none' = 'track'): void =>
    apply({ kind: 'skill', value: category, track: trackOfSkill(category), labelKey: `galaxy.clusters.${category}.label` }, scroll)

  const focusCompany = (company: CompanyId): void => {
    const key = resumeData.companies.find(c => c.name === company)?.i18nKey ?? 'cmc'
    apply({ kind: 'company', value: company, track: 'builder', labelKey: `companies.${key}.name` })
  }

  const focusDomain = (domain: ProjectDomain): void =>
    apply({ kind: 'domain', value: domain, track: trackOfDomain(domain), labelKey: `domains.${domain}` })

  const focusAchievement = (id: string): void => {
    const achievement = resumeData.achievements.find(a => a.id === id)
    if (!achievement) return
    apply({ kind: 'achievement', value: id, track: achievement.track, labelKey: `achievements.${id}` })
  }

  /** Smart Tag: a tech chip in a card highlights its Galaxy node. */
  const focusTech = (tech: string): void => {
    const category = categoryOfTech(tech)
    if (!category) return
    focus.value = null
    apply(
      { kind: 'skill', value: category, track: trackOfSkill(category), labelKey: `galaxy.clusters.${category}.label` },
      'galaxy'
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
    focusDomain,
    focusAchievement,
    focusTech,
    clear,
    setHovered
  }
}
