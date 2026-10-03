// Skill category for Galaxy nodes
export type SkillCategory = 'frontend' | 'backend' | 'database' | 'analysis'

export interface Skill {
  name: string
  category: SkillCategory
  years: number
  icon?: string
}

export interface SocialLink {
  platform: string
  url: string
  icon: string // icon identifier
}

export interface PersonalInfo {
  name: string
  title: string
  subtitle: string
  tagline: string
  email: string
  phone: string
  location: string
  avatar?: string
  socialLinks: SocialLink[]
}

export interface Education {
  school: string
  major: string
  period: string
  gpa: string
}

export interface Company {
  name: string
  position: string
  period: string
  years: string
  description?: string
}

export interface Achievement {
  title: string
  organization: string
  date: string
  icon: string // emoji
  projectSlug?: string // link to related project
  companyName?: string
}

export type ProjectRole = 'BA' | 'Developer' | 'Leader' | 'Module Leader' | 'BA + Developer'
export type ProjectDomain = 'AI' | 'Logistics' | 'IoT' | 'Warehouse' | 'AdTech' | 'Supply Chain'
export type ProjectTrack = 'builder' | 'analyst'

export interface ProjectDeliverable {
  name: string
  completed: boolean
}

export interface Project {
  slug: string
  title: string
  description: string
  period: string
  customer: string
  company: string // 'Vccorp' | 'CMC Global'
  role: ProjectRole
  teamSize: number
  technologies: string[]
  domain?: ProjectDomain
  track: ProjectTrack // which section it belongs to
  featured?: boolean
  deliverables?: ProjectDeliverable[]
  responsibilities: string[]
  achievement?: Achievement // inline achievement for this project
}

export interface TimelineMilestone {
  year: string
  title: string
  description: string
  tags?: string[]
  achievement?: Achievement
  company?: string
}

export interface GalaxyConnection {
  from: string
  to: string
  label: string
  tooltip: string
}

export interface ResumeData {
  personalInfo: PersonalInfo
  education: Education
  companies: Company[]
  skills: Skill[]
  achievements: Achievement[]
  projects: Project[]
  builderTimeline: TimelineMilestone[]
  analystTimeline: TimelineMilestone[]
  galaxyConnections: GalaxyConnection[]
}
