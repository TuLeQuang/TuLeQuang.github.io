import type { ClusterAccent, Project, ProjectDomain, ProjectRole, SkillCategory, SocialIcon } from '@/types'

/** Tailwind classes per domain badge (tokens defined in style.css @theme). */
export const domainStyles: Record<ProjectDomain, { chip: string; dot: string }> = {
  AI: { chip: 'bg-domain-ai-bg text-domain-ai-text', dot: 'bg-domain-ai' },
  Logistics: { chip: 'bg-domain-logistics-bg text-domain-logistics-text', dot: 'bg-domain-logistics' },
  IoT: { chip: 'bg-domain-iot-bg text-domain-iot-text', dot: 'bg-domain-iot' },
  Warehouse: { chip: 'bg-domain-warehouse-bg text-domain-warehouse-text', dot: 'bg-domain-warehouse' },
  AdTech: { chip: 'bg-domain-adtech-bg text-domain-adtech-text', dot: 'bg-domain-adtech' },
  SupplyChain: { chip: 'bg-domain-supplychain-bg text-domain-supplychain-text', dot: 'bg-domain-supplychain' },
  CRM: { chip: 'bg-domain-crm-bg text-domain-crm-text', dot: 'bg-domain-crm' },
  HRTech: { chip: 'bg-domain-hrtech-bg text-domain-hrtech-text', dot: 'bg-domain-hrtech' }
}

export const domainIcons: Record<ProjectDomain, string> = {
  AI: '🤖',
  Logistics: '🚚',
  IoT: '📡',
  Warehouse: '🏭',
  AdTech: '📢',
  SupplyChain: '🌐',
  CRM: '💼',
  HRTech: '👥'
}

export const roleStyles: Record<ProjectRole, string> = {
  ba: 'bg-secondary-purple-light text-domain-ai-text',
  baDev: 'bg-linear-to-r from-primary-container to-domain-ai text-white',
  leader: 'bg-domain-supplychain-bg text-domain-supplychain-text',
  moduleLeader: 'bg-secondary-purple-light text-domain-ai-text',
  frontendDev: 'bg-primary-blue-light text-primary-blue-dark',
  backendDev: 'bg-primary-blue-light text-primary-blue-dark'
}

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

/** Technology keywords that belong to each Galaxy skill category (used for skill focus). */
export const skillKeywords: Record<SkillCategory, string[]> = {
  frontend: ['JavaScript', 'Vue.js', 'Vue3', 'React', 'jQuery', 'Mapbox', 'Litjs', 'HTML', 'CSS'],
  backend: ['Java', 'Spring', 'PHP', 'Laravel'],
  database: ['PostgreSQL', 'MySQL', 'Redis', 'DB2'],
  analysis: []
}

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
