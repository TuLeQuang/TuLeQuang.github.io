import type { ClusterAccent, DomainColor, Project, ProjectDomain, ProjectRole, RoleStyle, SkillCategory, SocialIcon } from '@/types'
import { cvMeta } from '@/composables/useCv'

/**
 * Colour palettes. content/cv.md picks a key (Dictionaries › domains.color / roles.style);
 * the literal class strings must stay in this file so Tailwind generates them.
 */
const DOMAIN_PALETTE: Record<DomainColor, { chip: string; dot: string }> = {
  ai: { chip: 'bg-domain-ai-bg text-domain-ai-text', dot: 'bg-domain-ai' },
  logistics: { chip: 'bg-domain-logistics-bg text-domain-logistics-text', dot: 'bg-domain-logistics' },
  iot: { chip: 'bg-domain-iot-bg text-domain-iot-text', dot: 'bg-domain-iot' },
  warehouse: { chip: 'bg-domain-warehouse-bg text-domain-warehouse-text', dot: 'bg-domain-warehouse' },
  adtech: { chip: 'bg-domain-adtech-bg text-domain-adtech-text', dot: 'bg-domain-adtech' },
  supplychain: { chip: 'bg-domain-supplychain-bg text-domain-supplychain-text', dot: 'bg-domain-supplychain' },
  crm: { chip: 'bg-domain-crm-bg text-domain-crm-text', dot: 'bg-domain-crm' },
  hrtech: { chip: 'bg-domain-hrtech-bg text-domain-hrtech-text', dot: 'bg-domain-hrtech' }
}

const ROLE_PALETTE: Record<RoleStyle, string> = {
  purple: 'bg-secondary-purple-light text-domain-ai-text',
  gradient: 'bg-linear-to-r from-primary-container to-domain-ai text-white',
  green: 'bg-domain-supplychain-bg text-domain-supplychain-text',
  blue: 'bg-primary-blue-light text-primary-blue-dark'
}

const mapValues = <T, R>(record: Record<string, T>, fn: (value: T) => R): Record<string, R> =>
  Object.fromEntries(Object.entries(record).map(([key, value]) => [key, fn(value)]))

/** Tailwind classes per domain badge (tokens defined in style.css @theme). */
export const domainStyles: Record<ProjectDomain, { chip: string; dot: string }> = mapValues(cvMeta.domains, d => DOMAIN_PALETTE[d.color])

export const domainIcons: Record<ProjectDomain, string> = mapValues(cvMeta.domains, d => d.icon)

export const roleStyles: Record<ProjectRole, string> = mapValues(cvMeta.roles, r => ROLE_PALETTE[r.style])

/** Dual role (BA + Dev) = role styled `gradient` in content/cv.md › Dictionaries › roles. */
export const isDualRole = (role: ProjectRole): boolean => cvMeta.roles[role]?.style === 'gradient'

/**
 * Galaxy node accent → classes. `text / chip / stroke / border` are for the dark hero;
 * `lightText / lightBar / lightRing` are the same hue tuned for light sections (BuilderSkills),
 * so a skill keeps one colour identity across the page.
 */
export const accentStyles: Record<
  ClusterAccent,
  { text: string; chip: string; stroke: string; border: string; lightText: string; lightBar: string; lightRing: string }
> = {
  primary: {
    text: 'text-primary', chip: 'bg-primary/20 text-primary', stroke: 'var(--color-primary)',
    border: 'border-primary/30 hover:border-primary/70',
    lightText: 'text-primary-container', lightBar: 'bg-primary-container', lightRing: 'ring-primary-container/40'
  },
  secondary: {
    text: 'text-secondary', chip: 'bg-secondary/20 text-secondary', stroke: 'var(--color-secondary)',
    border: 'border-secondary/30 hover:border-secondary/70',
    lightText: 'text-secondary-container', lightBar: 'bg-secondary-container', lightRing: 'ring-secondary-container/40'
  },
  tertiary: {
    text: 'text-tertiary', chip: 'bg-tertiary-container/30 text-tertiary', stroke: 'var(--color-tertiary)',
    border: 'border-tertiary/30 hover:border-tertiary/70',
    lightText: 'text-tertiary-container', lightBar: 'bg-tertiary', lightRing: 'ring-tertiary/50'
  },
  iot: {
    text: 'text-domain-iot', chip: 'bg-domain-iot/20 text-domain-iot', stroke: 'var(--color-domain-iot)',
    border: 'border-domain-iot/30 hover:border-domain-iot/70',
    lightText: 'text-domain-iot-text', lightBar: 'bg-domain-iot', lightRing: 'ring-domain-iot/40'
  }
}

/** Technology keywords that belong to each Galaxy skill category (content/cv.md › Skills › clusters.<id>.keywords). */
export const skillKeywords: Record<SkillCategory, string[]> = cvMeta.skillKeywords

export const techMatchesSkill = (tech: string, category: SkillCategory): boolean =>
  skillKeywords[category].includes(tech)

export const projectMatchesSkill = (project: Project, category: SkillCategory): boolean =>
  category === 'analysis'
    ? (project.deliverables?.length ?? 0) > 0
    : project.technologies.some(tech => techMatchesSkill(tech, category))

/** Reverse lookup: which Galaxy node owns a technology (for Smart Tag clicks). */
export const categoryOfTech = (tech: string): SkillCategory | undefined =>
  (Object.keys(skillKeywords) as SkillCategory[]).find(c => skillKeywords[c].includes(tech))

/** Material Symbols used for each social platform (as in code.html). */
export const socialIcons: Record<SocialIcon, string> = {
  github: 'terminal',
  linkedin: 'share',
  facebook: 'public'
}

/** "0986685827" → "0986 685 827" */
export const formatPhone = (phone: string): string => phone.replace(/^(\d{4})(\d{3})(\d+)$/, '$1 $2 $3')
