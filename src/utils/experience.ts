import type { Skill, Company } from '@/types'

/** Year the career started (joined Vccorp 02/2018). */
export const CAREER_START = 2018
/** Year BA / Pre-sale responsibilities started (joined CMC Global 05/2022). */
export const BA_START = 2022

export const currentYear = (): number => new Date().getFullYear()

/** Total working years, from 2018 to the current year. Used as the shared progress scale. */
export const careerYears = (): number => Math.max(1, currentYear() - CAREER_START)

/** Business Analysis experience, from 2022 to the current year. */
export const baYears = (): number => Math.max(1, currentYear() - BA_START)

const span = (since: number, until?: number): number => Math.max(1, (until ?? currentYear()) - since)

export const skillYears = (skill: Pick<Skill, 'since' | 'until'>): number => span(skill.since, skill.until)

/** 0..1 ratio of a skill's experience against the whole career. */
export const skillRatio = (skill: Pick<Skill, 'since' | 'until'>): number =>
  Math.min(1, skillYears(skill) / careerYears())

export const companyYears = (company: Pick<Company, 'since' | 'until'>): number =>
  span(company.since, company.until)
