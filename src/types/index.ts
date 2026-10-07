// ===== Locale =====
export type Locale = 'vi' | 'en'

// ===== Skills =====
/** Fixed set: the Galaxy layout (galaxyPaths.ts) has exactly these four nodes. */
export type SkillCategory = 'frontend' | 'backend' | 'database' | 'analysis'

/** Experience is derived from `since` / `until` (see utils/experience.ts). */
export interface Skill {
  name: string
  category: SkillCategory
  since: number
  until?: number
}

export type ClusterAccent = 'primary' | 'secondary' | 'tertiary' | 'iot'

/** Galaxy skill node. Texts live in CV content: clusters.<id>.* */
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
  /** CV PDF per language, relative to `public/` (Q-M5). Both may point to the same file. */
  cvUrl: Record<Locale, string>
}

export interface Education {
  period: string
  gpa: string
}

/**
 * Ids below are data-driven (content/cv.md). They are plain strings so a new company / customer /
 * domain / role / deliverable needs no code change; the CV validator guarantees every reference exists.
 */
/** Employer display name, e.g. 'Vccorp' | 'CMC Global' */
export type CompanyId = string

/** Texts live in CV content: companies.<i18nKey>.* — `end` omitted means "present" */
export interface Company {
  name: CompanyId
  /** Company key in content/cv.md (e.g. 'vccorp' | 'cmc') */
  i18nKey: string
  start: string
  end?: string
  since: number
  until?: number
}

export type CustomerId = string

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

/** Title lives in CV content: achievements.<id> */
export interface Achievement {
  id: string
  icon: string
  company: CompanyId
  track: ProjectTrack
  milestoneId: string
  projectSlug?: string
}

// ===== Projects =====
export type ProjectRole = string
export type ProjectDomain = string
export type DeliverableCode = string

/** Title / summary / responsibilities live in CV content: projects.<slug>.* */
export interface Project {
  slug: string
  period: string
  company: CompanyId
  /** End customer (see `customers`): Vccorp (in-house), Samsung (key client of CMC), CMC's Customer */
  customer: CustomerId
  role: ProjectRole
  teamSize: number | string
  technologies: string[]
  domain: ProjectDomain
  tracks: ProjectTrack[]
  layout?: 'featured' | 'wide'
  deliverables?: DeliverableCode[]
  achievementId?: string
}

// ===== Timeline =====
/** Title / description live in CV content: milestones.<id>.* */
export interface TimelineMilestone {
  id: string
  year: string
  company: CompanyId
  achievementId?: string
  projectSlugs?: string[]
}

// ===== Galaxy connections =====
/** Tooltip lives in CV content: connections.<id> */
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
  /** Dot path inside the localized CV content (CvContent) used by the header breadcrumb, e.g. 'domains.AI' */
  labelPath: string
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

// ===== CV data (generated from content/cv.md by cv-pipeline) =====
/** Palette keys of styleMaps.ts — content/cv.md picks one, so new domains / roles need no CSS. */
export type DomainColor = 'ai' | 'logistics' | 'iot' | 'warehouse' | 'adtech' | 'supplychain' | 'crm' | 'hrtech'
export type RoleStyle = 'purple' | 'gradient' | 'green' | 'blue'

/** Language-neutral presentation data that used to be hard-coded in utils. */
export interface CvMeta {
  /** Year the career started (first employer) */
  careerStart: number
  /** Year BA / Pre-sale responsibilities started */
  baStart: number
  domains: Record<ProjectDomain, { icon: string; color: DomainColor }>
  roles: Record<ProjectRole, { style: RoleStyle }>
  /** Technology keywords per Galaxy node (skill focus / Smart Tag) */
  skillKeywords: Record<SkillCategory, string[]>
  /** Standard deliverable kit (Analyst section) */
  deliverableKit: DeliverableCode[]
  /** Deliverable chips of the "deliverables" BA strength (mobile) */
  strengthsKit: DeliverableCode[]
  /** BA strength key → project slug opened on click (Narrative › strengths.<key>.project) */
  strengthProjects: Record<string, string>
}

export interface ProjectContent {
  title: string
  summary: string
  responsibilities: string[]
}

export interface StrengthContent {
  title: string
  proof: string
}

/** Every CV text of ONE locale (already resolved, fallback to `en`). UI labels stay in src/locales. */
export interface CvContent {
  profile: { name: string; role: string; targetRole: string; tagline: string; location: string; objective: string }
  education: { school: string; major: string }
  companies: Record<string, { name: string; role: string }>
  customers: Record<CustomerId, string>
  domains: Record<ProjectDomain, string>
  roles: Record<ProjectRole, string>
  deliverables: Record<DeliverableCode, string>
  achievements: Record<string, string>
  projects: Record<string, ProjectContent>
  milestones: Record<string, { title: string; desc: string }>
  clusters: Record<SkillCategory, { label: string; tier: string; desc: string }>
  connections: Record<string, string>
  narrative: {
    builder: { subtitle: string; meta: string }
    analyst: { subtitle: string; meta: string; domainDesc: string }
    transition: { quote: string; body: string; bodyShort: string; journey: Record<'dev' | 'hybrid' | 'ba', string> }
    strengths: Record<string, StrengthContent>
    contact: { subtitle: string; identity: string }
  }
}

export interface CvData {
  schemaVersion: number
  resume: ResumeData
  meta: CvMeta
  content: Record<Locale, CvContent>
}
