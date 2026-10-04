// ===== Locale =====
export type Locale = 'vi' | 'en'

// ===== Skills =====
export type SkillCategory = 'frontend' | 'backend' | 'database' | 'analysis'

/** Experience is derived from `since` / `until` (see utils/experience.ts). */
export interface Skill {
  name: string
  category: SkillCategory
  since: number
  until?: number
}

export type ClusterAccent = 'primary' | 'secondary' | 'tertiary' | 'iot'

/** Galaxy skill node. Texts live in i18n: galaxy.clusters.<id>.* */
export interface SkillCluster {
  id: SkillCategory
  icon: string
  accent: ClusterAccent
  skills: string[]
}

// ===== Profile =====
export type SocialIcon = 'github' | 'linkedin' | 'facebook'

export interface SocialLink {
  platform: string
  url: string
  icon: SocialIcon
}

export interface PersonalInfo {
  email: string
  phone: string
  socialLinks: SocialLink[]
}

export interface Education {
  period: string
  gpa: string
}

export type CompanyId = 'Vccorp' | 'CMC Global'

/** Texts live in i18n: companies.<i18nKey>.* — `end` omitted means "present" */
export interface Company {
  name: CompanyId
  i18nKey: 'vccorp' | 'cmc'
  start: string
  end?: string
  since: number
  until?: number
}

export type CustomerId = 'vccorp' | 'samsung' | 'cmcCustomer'

/**
 * End customer of a project. Every customer belongs to an employer (`company`):
 * Samsung is a client of CMC Global, not an employer.
 * `keyClient` customers get their own filter (nested under the company) and a "client of" label.
 */
export interface Customer {
  id: CustomerId
  name: string
  company: CompanyId
  keyClient?: boolean
}

// ===== Achievements =====
export type ProjectTrack = 'builder' | 'analyst'

/** Title lives in i18n: achievements.<id> */
export interface Achievement {
  id: string
  icon: string
  company: CompanyId
  track: ProjectTrack
  milestoneId: string
  projectSlug?: string
}

// ===== Projects =====
export type ProjectRole = 'ba' | 'baDev' | 'leader' | 'moduleLeader' | 'frontendDev' | 'backendDev'
export type ProjectDomain = 'AI' | 'Logistics' | 'IoT' | 'Warehouse' | 'AdTech' | 'SupplyChain'
export type DeliverableCode = 'wbs' | 'srs' | 'wireframe' | 'proposal' | 'useCase' | 'mockup' | 'frontendCode'

/** Title / summary / responsibilities live in i18n: projects.<slug>.* */
export interface Project {
  slug: string
  period: string
  company: CompanyId
  /** End customer (see `customers`): Vccorp (in-house), Samsung (key client of CMC), CMC's Customer */
  customer: CustomerId
  role: ProjectRole
  teamSize: number
  technologies: string[]
  domain: ProjectDomain
  tracks: ProjectTrack[]
  layout?: 'featured' | 'wide'
  deliverables?: DeliverableCode[]
  achievementId?: string
}

// ===== Timeline =====
/** Title / description live in i18n: milestones.<id>.* */
export interface TimelineMilestone {
  id: string
  year: string
  company: CompanyId
  achievementId?: string
  projectSlugs?: string[]
}

// ===== Galaxy connections =====
/** Tooltip lives in i18n: galaxy.connections.<id> */
export interface GalaxyConnection {
  id: string
  from: SkillCategory
  to: SkillCategory
}

// ===== Project grid filters =====
/** `id` = 'all' | 'company:<CompanyId>' | 'customer:<CustomerId>' | 'domain:<ProjectDomain>' */
export interface FilterOption {
  id: string
  label: string
  count: number
  /** Set for a key client nested under its employer (e.g. Samsung → company:CMC Global) */
  parentId?: string
  /** Tooltip, e.g. "Samsung · client of CMC Global" */
  hint?: string
}

// ===== Focus state (shared interaction state) =====
export type FocusKind = 'skill' | 'company' | 'domain' | 'achievement' | 'customer'

export interface FocusState {
  kind: FocusKind
  value: string
  track: ProjectTrack
  /** i18n key used by the header breadcrumb */
  labelKey: string
}

export interface ResumeData {
  personalInfo: PersonalInfo
  education: Education
  companies: Company[]
  customers: Customer[]
  skills: Skill[]
  skillClusters: SkillCluster[]
  achievements: Achievement[]
  projects: Project[]
  builderTimeline: TimelineMilestone[]
  analystTimeline: TimelineMilestone[]
  galaxyConnections: GalaxyConnection[]
  baDomains: ProjectDomain[]
}
