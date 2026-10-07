/**
 * Layer 3b — Integrity: cross-references inside content/cv.md.
 * Every id used by a project / achievement / milestone / customer must exist, ids must be unique,
 * and placeholders like {n} must be supported by the field that contains them.
 */
import type { CvSource, Text } from './schema.ts'

type Problem = string

const dupes = (ids: string[]): string[] => ids.filter((id, i) => id && ids.indexOf(id) !== i)

/** Placeholders the app fills in for each narrative field (anything else would render literally). */
export const PLACEHOLDERS: Record<string, string[]> = {
  'builder.subtitle': ['n'],
  'analyst.subtitle': ['n'],
  'transition.quote': ['n'],
  'strengths.bilingual.proof': ['n', 'start'],
  'strengths.presale.proof': ['n'],
  'strengths.domains.proof': ['n', 'domains'],
  'strengths.recognized.proof': ['award', 'project']
}

const placeholdersOf = (t: Text): string[] =>
  [...new Set(Object.values(t).flatMap(s => [...s.matchAll(/\{(\w+)\}/g)].map(m => m[1] as string)))]

export function checkIntegrity(src: CvSource): Problem[] {
  const out: Problem[] = []
  const companyIds = src.companies.map(c => c.id)
  const customerIds = src.customers.map(c => c.id)
  const projectSlugs = src.projects.map(p => p.slug)
  const { domains, roles, deliverables } = src.dictionaries
  const milestones = [...src.timeline.builder, ...src.timeline.analyst]

  for (const id of dupes(companyIds)) out.push(`Companies › ${id}: duplicate id`)
  for (const id of dupes(customerIds)) out.push(`Customers › ${id}: duplicate id`)
  for (const id of dupes(src.achievements.map(a => a.id))) out.push(`Achievements › ${id}: duplicate id`)
  for (const id of dupes(milestones.map(m => m.id))) out.push(`Timeline › ${id}: duplicate id`)
  for (const name of dupes(src.skills.items.map(s => s.name))) out.push(`Skills › items › ${name}: duplicate skill`)

  const ref = (path: string, kind: string, value: string | undefined, known: string[]): void => {
    if (value && !known.includes(value)) out.push(`${path}: ${kind} "${value}" does not exist (known: ${known.join(', ')})`)
  }

  for (const c of src.customers) ref(`Customers › ${c.id} › company`, 'company', c.company, companyIds)

  for (const p of src.projects) {
    const path = `Projects › ${p.slug}`
    ref(`${path} › company`, 'company', p.company, companyIds)
    ref(`${path} › customer`, 'customer', p.customer, customerIds)
    ref(`${path} › role`, 'role (Dictionaries.roles)', p.role, Object.keys(roles))
    ref(`${path} › domain`, 'domain (Dictionaries.domains)', p.domain, Object.keys(domains))
    for (const d of p.deliverables ?? []) ref(`${path} › deliverables`, 'deliverable (Dictionaries.deliverables)', d, Object.keys(deliverables))
    if (new Set(p.tracks).size !== p.tracks.length) out.push(`${path} › tracks: duplicate track`)
  }

  for (const d of src.dictionaries.baDomains) ref('Dictionaries › baDomains', 'domain', d, Object.keys(domains))
  for (const d of src.skills.deliverableKit) ref('Skills › deliverableKit', 'deliverable', d, Object.keys(deliverables))
  for (const d of src.narrative.strengths.deliverables?.kit ?? []) {
    ref('Narrative › strengths › deliverables › kit', 'deliverable', d, Object.keys(deliverables))
  }
  for (const [k, s] of Object.entries(src.narrative.strengths)) {
    ref(`Narrative › strengths › ${k} › project`, 'project', s.project, src.projects.map(p => p.slug))
  }

  for (const [id, conn] of Object.entries(src.skills.connections)) {
    if (`${conn.from}-${conn.to}` !== id) out.push(`Skills › connections › ${id}: from/to must match the id ("${conn.from}-${conn.to}")`)
  }

  const achievedProjects = new Map<string, string>()
  const achievedMilestones = new Map<string, string>()
  for (const a of src.achievements) {
    const path = `Achievements › ${a.id}`
    ref(`${path} › company`, 'company', a.company, companyIds)
    ref(`${path} › project`, 'project', a.project, projectSlugs)
    const milestone = src.timeline[a.track].find(m => m.id === a.milestone)
    if (!milestone) out.push(`${path} › milestone: "${a.milestone}" is not in Timeline › ${a.track}`)
    if (a.project) {
      const other = achievedProjects.get(a.project)
      if (other) out.push(`${path} › project: "${a.project}" already has achievement "${other}" (one per project)`)
      achievedProjects.set(a.project, a.id)
    }
    const other = achievedMilestones.get(a.milestone)
    if (other) out.push(`${path} › milestone: "${a.milestone}" already has achievement "${other}" (one per milestone)`)
    achievedMilestones.set(a.milestone, a.id)
  }

  for (const m of milestones) {
    const path = `Timeline › ${m.id}`
    ref(`${path} › company`, 'company', m.company, companyIds)
    for (const slug of m.projects ?? []) ref(`${path} › projects`, 'project', slug, projectSlugs)
  }

  // Placeholders in narrative texts
  const narrativeTexts: Array<[string, Text]> = [
    ['builder.subtitle', src.narrative.builder.subtitle],
    ['builder.meta', src.narrative.builder.meta],
    ['analyst.subtitle', src.narrative.analyst.subtitle],
    ['analyst.meta', src.narrative.analyst.meta],
    ['analyst.domainDesc', src.narrative.analyst.domainDesc],
    ['transition.quote', src.narrative.transition.quote],
    ['transition.body', src.narrative.transition.body],
    ['transition.bodyShort', src.narrative.transition.bodyShort],
    ['contact.subtitle', src.narrative.contact.subtitle],
    ['contact.identity', src.narrative.contact.identity],
    ...Object.entries(src.narrative.strengths).flatMap(([k, v]): Array<[string, Text]> => [
      [`strengths.${k}.title`, v.title],
      [`strengths.${k}.proof`, v.proof]
    ])
  ]
  for (const [key, value] of narrativeTexts) {
    const allowed = PLACEHOLDERS[key] ?? []
    for (const name of placeholdersOf(value)) {
      if (!allowed.includes(name)) {
        out.push(`Narrative › ${key.replace(/\./g, ' › ')}: placeholder {${name}} is not supported${allowed.length ? ` (allowed: ${allowed.map(a => `{${a}}`).join(', ')})` : ' (this field has no placeholders)'}`)
      }
    }
  }
  return out
}
