/** Navigation link item */
export interface NavLink {
  label: string
  href: string
}

/** Skill item */
export interface Skill {
  name: string
  level: number // 0-100
  category: string
  icon?: string
}

/** Work experience entry */
export interface Experience {
  company: string
  position: string
  startDate: string
  endDate: string | 'Present'
  description: string
  highlights: string[]
  technologies: string[]
}

/** Project entry */
export interface Project {
  title: string
  description: string
  image?: string
  technologies: string[]
  liveUrl?: string
  sourceUrl?: string
  featured: boolean
}

/** Achievement entry */
export interface Achievement {
  title: string
  issuer: string
  date: string
  description?: string
  url?: string
}

/** Social link */
export interface SocialLink {
  platform: string
  url: string
  icon: string
}

/** Personal info for CV */
export interface PersonalInfo {
  name: string
  title: string
  tagline: string
  email: string
  phone?: string
  location: string
  avatar?: string
  socialLinks: SocialLink[]
}

/** Complete resume data */
export interface ResumeData {
  personalInfo: PersonalInfo
  skills: Skill[]
  experiences: Experience[]
  projects: Project[]
  achievements: Achievement[]
}
