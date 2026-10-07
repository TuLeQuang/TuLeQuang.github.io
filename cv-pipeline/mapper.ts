/**
 * Layer 4 — Mapper: CvSource (template v1) → CvData (app model).
 *
 * The ONLY place that knows both the template and the app. When the template changes,
 * adapt this file (+ schema/migrations); `resumeData`, `useCv()` and components stay untouched.
 * Both locales are resolved here at build time, so the browser does no parsing at all.
 */
import type { CvSource, Text, TextList } from './schema.ts'
import { LOCALES, SKILL_CATEGORIES } from './schema.ts'
import type {
  Achievement, Company, CvContent, CvData, CvMeta, Customer, Locale, Project, ResumeData, SkillCategory, TimelineMilestone
} from '../src/types/index.ts'

const yearOf = (month: string): number => Number(month.slice(3))

export function toCvData(src: CvSource): CvData {
  const companyName = new Map(src.companies.map(c => [c.id, c.name]))
  const nameOf = (id: string): string => companyName.get(id) ?? id
  const achievementOfProject = new Map(src.achievements.filter(a => a.project).map(a => [a.project as string, a.id]))
  const achievementOfMilestone = new Map(src.achievements.map(a => [a.milestone, a.id]))

  const companies: Company[] = src.companies.map(c => ({
    name: c.name,
    i18nKey: c.id,
    start: c.start,
    ...(c.end ? { end: c.end } : {}),
    since: yearOf(c.start),
    ...(c.end ? { until: yearOf(c.end) } : {})
  }))

  const customers: Customer[] = src.customers.map(c => ({
    id: c.id,
    name: c.name,
    company: nameOf(c.company),
    ...(c.keyClient ? { keyClient: true } : {})
  }))

  const projects: Project[] = src.projects.map(p => {
    const achievementId = achievementOfProject.get(p.slug)
    return {
      slug: p.slug,
      period: p.period,
      company: nameOf(p.company),
      customer: p.customer,
      role: p.role,
      teamSize: p.team,
      domain: p.domain,
      tracks: p.tracks,
      ...(p.layout ? { layout: p.layout } : {}),
      ...(achievementId ? { achievementId } : {}),
      ...(p.deliverables?.length ? { deliverables: p.deliverables } : {}),
      technologies: p.tech
    }
  })

  const achievements: Achievement[] = src.achievements.map(a => ({
    id: a.id,
    icon: a.icon,
    company: nameOf(a.company),
    track: a.track,
    milestoneId: a.milestone,
    ...(a.project ? { projectSlug: a.project } : {})
  }))

  const milestones = (list: CvSource['timeline']['builder']): TimelineMilestone[] =>
    list.map(m => {
      const achievementId = achievementOfMilestone.get(m.id)
      return {
        id: m.id,
        year: m.year,
        company: nameOf(m.company),
        ...(achievementId ? { achievementId } : {}),
        ...(m.projects?.length ? { projectSlugs: m.projects } : {})
      }
    })

  const resume: ResumeData = {
    personalInfo: {
      email: src.profile.email,
      phone: src.profile.phone,
      socialLinks: src.profile.socials,
      cvUrl: src.profile.cvPdf
    },
    education: { period: src.education.period, gpa: src.education.gpa },
    companies,
    customers,
    skills: src.skills.items,
    skillClusters: Object.entries(src.skills.clusters).map(([id, c]) => ({
      id: id as SkillCategory,
      icon: c.icon,
      accent: c.accent,
      skills: c.skills
    })),
    achievements,
    projects,
    builderTimeline: milestones(src.timeline.builder),
    analystTimeline: milestones(src.timeline.analyst),
    galaxyConnections: Object.entries(src.skills.connections).map(([id, c]) => ({ id, from: c.from, to: c.to })),
    baDomains: src.dictionaries.baDomains
  }

  const meta: CvMeta = {
    careerStart: src.profile.careerStart,
    baStart: src.profile.baStart,
    domains: Object.fromEntries(Object.entries(src.dictionaries.domains).map(([k, d]) => [k, { icon: d.icon, color: d.color }])),
    roles: Object.fromEntries(Object.entries(src.dictionaries.roles).map(([k, r]) => [k, { style: r.style }])),
    skillKeywords: Object.fromEntries(SKILL_CATEGORIES.map(cat => [cat, src.skills.clusters[cat]?.keywords ?? []])) as CvMeta['skillKeywords'],
    deliverableKit: src.skills.deliverableKit,
    strengthsKit: src.narrative.strengths.deliverables?.kit ?? [],
    strengthProjects: Object.fromEntries(
      Object.entries(src.narrative.strengths).flatMap(([k, s]) => (s.project ? [[k, s.project]] : []))
    )
  }

  const content = Object.fromEntries(LOCALES.map(locale => [locale, localize(src, locale)])) as Record<Locale, CvContent>

  return { schemaVersion: src.schemaVersion, resume, meta, content }
}

/** All CV texts of one locale. */
function localize(src: CvSource, locale: Locale): CvContent {
  const t = (text: Text): string => text[locale]
  const tl = (list: TextList): string[] => list[locale]
  const map = <T, R>(record: Record<string, T>, fn: (value: T) => R): Record<string, R> =>
    Object.fromEntries(Object.entries(record).map(([k, v]) => [k, fn(v)]))
  const n = src.narrative

  return {
    profile: {
      name: t(src.profile.name),
      role: t(src.profile.role),
      targetRole: t(src.profile.targetRole),
      tagline: t(src.profile.tagline),
      location: t(src.profile.location),
      objective: t(src.profile.objective)
    },
    education: { school: t(src.education.school), major: t(src.education.major) },
    companies: Object.fromEntries(src.companies.map(c => [c.id, { name: c.name, role: t(c.role) }])),
    customers: Object.fromEntries(src.customers.map(c => [c.id, c.label ? t(c.label) : c.name])),
    domains: map(src.dictionaries.domains, d => t(d.label)),
    roles: map(src.dictionaries.roles, r => t(r.label)),
    deliverables: map(src.dictionaries.deliverables, t),
    achievements: Object.fromEntries(src.achievements.map(a => [a.id, t(a.title)])),
    projects: Object.fromEntries(
      src.projects.map(p => [p.slug, { title: t(p.title), summary: t(p.summary), responsibilities: tl(p.responsibilities) }])
    ),
    milestones: Object.fromEntries(
      [...src.timeline.builder, ...src.timeline.analyst].map(m => [m.id, { title: t(m.title), desc: t(m.desc) }])
    ),
    clusters: map(src.skills.clusters, c => ({ label: t(c.label), tier: t(c.tier), desc: t(c.desc) })) as CvContent['clusters'],
    connections: map(src.skills.connections, c => t(c.label)),
    narrative: {
      builder: { subtitle: t(n.builder.subtitle), meta: t(n.builder.meta) },
      analyst: { subtitle: t(n.analyst.subtitle), meta: t(n.analyst.meta), domainDesc: t(n.analyst.domainDesc) },
      transition: {
        quote: t(n.transition.quote),
        body: t(n.transition.body),
        bodyShort: t(n.transition.bodyShort),
        journey: { dev: t(n.transition.journey.dev), hybrid: t(n.transition.journey.hybrid), ba: t(n.transition.journey.ba) }
      },
      strengths: map(n.strengths, s => ({ title: t(s.title), proof: t(s.proof) })),
      contact: { subtitle: t(n.contact.subtitle), identity: t(n.contact.identity) }
    }
  }
}
