/**
 * Layer 3a — Schema: validates the structure of content/cv.md (template v1) and normalizes it
 * into a typed CvSource. Knows field names / types, nothing about the Vue app.
 *
 * Localized text: either a plain string (same in every locale) or `{ en, vi }`.
 * Missing `vi` falls back to `en` with a warning (same as vue-i18n fallbackLocale).
 */
import type { RawDoc, RawSection } from './parser.ts'
import type { ClusterAccent, DomainColor, Locale, ProjectTrack, RoleStyle, SkillCategory, SocialIcon } from '../src/types/index.ts'

export const LOCALES: Locale[] = ['en', 'vi']
export const SKILL_CATEGORIES: SkillCategory[] = ['frontend', 'backend', 'database', 'analysis']
export const CLUSTER_ACCENTS: ClusterAccent[] = ['primary', 'secondary', 'tertiary', 'iot']
export const DOMAIN_COLORS: DomainColor[] = ['ai', 'logistics', 'iot', 'warehouse', 'adtech', 'supplychain', 'crm', 'hrtech']
export const ROLE_STYLES: RoleStyle[] = ['purple', 'gradient', 'green', 'blue']
export const SOCIAL_ICONS: SocialIcon[] = ['github', 'linkedin', 'facebook']
export const TRACKS: ProjectTrack[] = ['analyst', 'builder']
/** Galaxy geometry (src/utils/galaxyPaths.ts) draws exactly these connections. */
export const CONNECTION_IDS = ['backend-database', 'frontend-analysis', 'backend-analysis']
/** BA strengths rendered by BaStrengthsSection.vue (icons / click actions live in code). */
export const STRENGTH_KEYS = ['bilingual', 'deliverables', 'presale', 'domains', 'feasible', 'recognized']
export const JOURNEY_KEYS = ['dev', 'hybrid', 'ba'] as const

export type Text = Record<Locale, string>
export type TextList = Record<Locale, string[]>

export interface SourceProfile {
  name: Text
  role: Text
  targetRole: Text
  tagline: Text
  location: Text
  objective: Text
  email: string
  phone: string
  careerStart: number
  baStart: number
  socials: Array<{ platform: string; icon: SocialIcon; url: string }>
  cvPdf: Record<Locale, string>
}
export interface SourceCompany { id: string; name: string; start: string; end?: string; role: Text }
export interface SourceCustomer { id: string; name: string; label?: Text; company: string; keyClient?: boolean }
export interface SourceDictionaries {
  domains: Record<string, { label: Text; icon: string; color: DomainColor }>
  roles: Record<string, { label: Text; style: RoleStyle }>
  deliverables: Record<string, Text>
  baDomains: string[]
}
export interface SourceSkills {
  items: Array<{ name: string; category: SkillCategory; since: number; until?: number }>
  clusters: Record<SkillCategory, { icon: string; accent: ClusterAccent; label: Text; tier: Text; desc: Text; skills: string[]; keywords: string[] }>
  connections: Record<string, { from: SkillCategory; to: SkillCategory; label: Text }>
  deliverableKit: string[]
}
export interface SourceAchievement {
  id: string; icon: string; title: Text; company: string; track: ProjectTrack; milestone: string; project?: string
}
export interface SourceProject {
  slug: string
  line: number
  period: string
  company: string
  customer: string
  role: string
  team: number | string
  domain: string
  tracks: ProjectTrack[]
  layout?: 'featured' | 'wide'
  deliverables?: string[]
  tech: string[]
  title: Text
  summary: Text
  responsibilities: TextList
}
export interface SourceMilestone { id: string; year: string; company: string; projects?: string[]; title: Text; desc: Text }
export interface SourceNarrative {
  builder: { subtitle: Text; meta: Text }
  analyst: { subtitle: Text; meta: Text; domainDesc: Text }
  transition: { quote: Text; body: Text; bodyShort: Text; journey: Record<(typeof JOURNEY_KEYS)[number], Text> }
  strengths: Record<string, { title: Text; proof: Text; kit?: string[]; project?: string }>
  contact: { subtitle: Text; identity: Text }
}

export interface CvSource {
  schemaVersion: number
  profile: SourceProfile
  education: { school: Text; major: Text; period: string; gpa: string }
  companies: SourceCompany[]
  customers: SourceCustomer[]
  dictionaries: SourceDictionaries
  skills: SourceSkills
  achievements: SourceAchievement[]
  projects: SourceProject[]
  timeline: { builder: SourceMilestone[]; analyst: SourceMilestone[] }
  narrative: SourceNarrative
}

export const SECTIONS = [
  'Profile', 'Education', 'Companies', 'Customers', 'Dictionaries', 'Skills', 'Achievements', 'Projects', 'Timeline', 'Narrative'
] as const

// ---------------------------------------------------------------------------
// Validation context
// ---------------------------------------------------------------------------

export class CvValidationError extends Error {
  readonly problems: string[]
  constructor(file: string, problems: string[]) {
    super(`${file}: ${problems.length} problem(s)\n  - ${problems.join('\n  - ')}`)
    this.name = 'CvValidationError'
    this.problems = problems
  }
}

export class Ctx {
  readonly errors: string[] = []
  readonly warnings: string[] = []
  readonly file: string
  constructor(file: string) {
    this.file = file
  }
  error(path: string, message: string): void {
    this.errors.push(`${path}: ${message}`)
  }
  warn(path: string, message: string): void {
    this.warnings.push(`${path}: ${message}`)
  }
}

type Obj = Record<string, unknown>
const isObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v)
const join = (path: string, key: string | number): string => `${path} › ${key}`

/** Object with an allow-list of keys (typos like `sumary` are reported). */
function obj(c: Ctx, v: unknown, path: string, keys: string[]): Obj {
  if (!isObj(v)) {
    c.error(path, 'must be a mapping (key: value)')
    return {}
  }
  for (const k of Object.keys(v)) if (!keys.includes(k)) c.error(join(path, k), `unknown field (allowed: ${keys.join(', ')})`)
  return v
}

function str(c: Ctx, v: unknown, path: string, opts: { optional?: boolean; pattern?: RegExp; hint?: string } = {}): string {
  if (v === undefined || v === null || v === '') {
    if (!opts.optional) c.error(path, 'is required')
    return ''
  }
  if (typeof v !== 'string') {
    c.error(path, `must be text, got ${JSON.stringify(v)}${typeof v === 'number' ? ' (wrap it in quotes)' : ''}`)
    return String(v)
  }
  if (opts.pattern && !opts.pattern.test(v)) c.error(path, `"${v}" ${opts.hint ?? `does not match ${opts.pattern}`}`)
  return v
}

function int(c: Ctx, v: unknown, path: string, opts: { optional?: boolean } = {}): number | undefined {
  if (v === undefined || v === null) {
    if (!opts.optional) c.error(path, 'is required')
    return undefined
  }
  if (typeof v !== 'number' || !Number.isInteger(v)) {
    c.error(path, `must be an integer, got ${JSON.stringify(v)}`)
    return undefined
  }
  return v
}

function oneOf<T extends string>(c: Ctx, v: unknown, path: string, allowed: readonly T[]): T {
  if (typeof v !== 'string' || !(allowed as readonly string[]).includes(v)) {
    c.error(path, `must be one of ${allowed.join(' | ')}, got ${JSON.stringify(v)}`)
    return allowed[0] as T
  }
  return v as T
}

function list(c: Ctx, v: unknown, path: string, opts: { optional?: boolean } = {}): unknown[] {
  if (v === undefined || v === null) {
    if (!opts.optional) c.error(path, 'is required (list)')
    return []
  }
  if (!Array.isArray(v)) {
    c.error(path, 'must be a list')
    return []
  }
  return v
}

const strList = (c: Ctx, v: unknown, path: string, opts: { optional?: boolean } = {}): string[] =>
  list(c, v, path, opts).map((x, i) => str(c, x, join(path, i)))

/** Localized text: "same text" | { en, vi } */
function text(c: Ctx, v: unknown, path: string): Text {
  if (typeof v === 'string') return { en: v, vi: v }
  if (!isObj(v)) {
    c.error(path, 'is required (text or { en, vi })')
    return { en: '', vi: '' }
  }
  const o = obj(c, v, path, LOCALES)
  const en = str(c, o.en, join(path, 'en'))
  const vi = o.vi === undefined ? undefined : str(c, o.vi, join(path, 'vi'))
  if (vi === undefined) c.warn(path, 'missing "vi" → using "en"')
  return { en, vi: vi ?? en }
}

/** Localized list: [same, list] | { en: [...], vi: [...] } */
function textList(c: Ctx, v: unknown, path: string): TextList {
  if (Array.isArray(v)) {
    const same = strList(c, v, path)
    return { en: same, vi: same }
  }
  const o = obj(c, v, path, LOCALES)
  const en = strList(c, o.en, join(path, 'en'))
  if (o.vi === undefined) c.warn(path, 'missing "vi" → using "en"')
  const vi = o.vi === undefined ? en : strList(c, o.vi, join(path, 'vi'))
  if (vi.length !== en.length) c.warn(path, `en has ${en.length} item(s) but vi has ${vi.length}`)
  return { en, vi }
}

/** Ordered map (yaml mapping) → entries, validating every key. */
function entries(c: Ctx, v: unknown, path: string, keyPattern: RegExp, hint: string): Array<[string, unknown]> {
  if (!isObj(v)) {
    c.error(path, 'must be a mapping')
    return []
  }
  return Object.entries(v).filter(([k]) => {
    if (keyPattern.test(k)) return true
    c.error(join(path, k), `invalid key — ${hint}`)
    return false
  })
}

// ---------------------------------------------------------------------------
// Patterns (R-ID, R-DATE, R-TEAM in content/cv_transform_rules.md)
// ---------------------------------------------------------------------------
export const MONTH = /^(0[1-9]|1[0-2])\/\d{4}$/
export const PERIOD = /^(0[1-9]|1[0-2])\/\d{4} – (0[1-9]|1[0-2])\/\d{4}$/
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/
const CAMEL = /^[a-z][a-zA-Z0-9]*$/
const PASCAL = /^[A-Z][A-Za-z0-9]*$/
const ACH_ID = /^[a-z0-9]+(-[a-z0-9]+)*-\d{4}$/
const MILESTONE_ID = /^(builder|analyst)-\d{4}$/
const TEAM = /^\d+\+$/

// ---------------------------------------------------------------------------
// Sections
// ---------------------------------------------------------------------------

const where = (s: RawSection | undefined, file: string): string => (s ? `${s.name} (${file}:${s.line})` : '')

export function validateSource(doc: RawDoc): { source: CvSource; warnings: string[] } {
  const c = new Ctx(doc.file)
  const file = doc.file.split('/').pop() ?? doc.file

  for (const name of Object.keys(doc.sections)) {
    if (!(SECTIONS as readonly string[]).includes(name)) c.error(`## ${name}`, `unknown section (allowed: ${SECTIONS.join(', ')})`)
  }
  const section = (name: (typeof SECTIONS)[number]): RawSection | undefined => {
    const s = doc.sections[name]
    if (!s) c.error(`## ${name}`, 'section is missing')
    return s
  }
  const block = (name: (typeof SECTIONS)[number]): { value: unknown; path: string } => {
    const s = section(name)
    if (s && s.value === undefined && !s.items.length) c.error(where(s, file), 'has no ```yaml block')
    return { value: s?.value, path: where(s, file) || name }
  }

  // ----- Profile
  const pr = block('Profile')
  const p = obj(c, pr.value, pr.path, [
    'name', 'role', 'targetRole', 'tagline', 'location', 'objective', 'email', 'phone', 'careerStart', 'baStart', 'socials', 'cvPdf'
  ])
  const cvPdfText = text(c, p.cvPdf, join(pr.path, 'cvPdf'))
  const profile: SourceProfile = {
    name: text(c, p.name, join(pr.path, 'name')),
    role: text(c, p.role, join(pr.path, 'role')),
    targetRole: text(c, p.targetRole, join(pr.path, 'targetRole')),
    tagline: text(c, p.tagline, join(pr.path, 'tagline')),
    location: text(c, p.location, join(pr.path, 'location')),
    objective: text(c, p.objective, join(pr.path, 'objective')),
    email: str(c, p.email, join(pr.path, 'email'), { pattern: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, hint: 'is not an email' }),
    phone: str(c, p.phone, join(pr.path, 'phone'), { pattern: /^\+?\d{8,15}$/, hint: 'must contain digits only' }),
    careerStart: int(c, p.careerStart, join(pr.path, 'careerStart')) ?? 0,
    baStart: int(c, p.baStart, join(pr.path, 'baStart')) ?? 0,
    socials: list(c, p.socials, join(pr.path, 'socials')).map((s, i) => {
      const path = join(join(pr.path, 'socials'), i)
      const o = obj(c, s, path, ['platform', 'icon', 'url'])
      return {
        platform: str(c, o.platform, join(path, 'platform')),
        icon: oneOf(c, o.icon, join(path, 'icon'), SOCIAL_ICONS),
        url: str(c, o.url, join(path, 'url'), { pattern: /^https?:\/\//, hint: 'must start with http(s)://' })
      }
    }),
    cvPdf: cvPdfText
  }

  // ----- Education
  const ed = block('Education')
  const e = obj(c, ed.value, ed.path, ['school', 'major', 'period', 'gpa'])
  const education = {
    school: text(c, e.school, join(ed.path, 'school')),
    major: text(c, e.major, join(ed.path, 'major')),
    period: str(c, e.period, join(ed.path, 'period'), { pattern: PERIOD, hint: 'must be "MM/YYYY – MM/YYYY" (R-DATE)' }),
    gpa: str(c, e.gpa, join(ed.path, 'gpa'))
  }

  // ----- Companies
  const co = block('Companies')
  const companies: SourceCompany[] = list(c, co.value, co.path).map((v, i) => {
    const path = join(co.path, i)
    const o = obj(c, v, path, ['id', 'name', 'start', 'end', 'role'])
    const end = str(c, o.end, join(path, 'end'), { optional: true, pattern: MONTH, hint: 'must be "MM/YYYY" (R-DATE)' })
    return {
      id: str(c, o.id, join(path, 'id'), { pattern: CAMEL, hint: 'must be camelCase (R-ID)' }),
      name: str(c, o.name, join(path, 'name')),
      start: str(c, o.start, join(path, 'start'), { pattern: MONTH, hint: 'must be "MM/YYYY" (R-DATE)' }),
      ...(end ? { end } : {}),
      role: text(c, o.role, join(path, 'role'))
    }
  })

  // ----- Customers
  const cu = block('Customers')
  const customers: SourceCustomer[] = list(c, cu.value, cu.path).map((v, i) => {
    const path = join(cu.path, i)
    const o = obj(c, v, path, ['id', 'name', 'label', 'company', 'keyClient'])
    if (o.keyClient !== undefined && typeof o.keyClient !== 'boolean') c.error(join(path, 'keyClient'), 'must be true or false')
    return {
      id: str(c, o.id, join(path, 'id'), { pattern: CAMEL, hint: 'must be camelCase (R-ID)' }),
      name: str(c, o.name, join(path, 'name')),
      ...(o.label !== undefined ? { label: text(c, o.label, join(path, 'label')) } : {}),
      company: str(c, o.company, join(path, 'company')),
      ...(o.keyClient === true ? { keyClient: true } : {})
    }
  })

  // ----- Dictionaries
  const di = block('Dictionaries')
  const d = obj(c, di.value, di.path, ['domains', 'roles', 'deliverables', 'baDomains'])
  const dictionaries: SourceDictionaries = {
    domains: Object.fromEntries(
      entries(c, d.domains, join(di.path, 'domains'), PASCAL, 'domain codes are PascalCase, e.g. HRTech').map(([k, v]) => {
        const path = join(join(di.path, 'domains'), k)
        const o = obj(c, v, path, ['label', 'icon', 'color'])
        return [k, { label: text(c, o.label, join(path, 'label')), icon: str(c, o.icon, join(path, 'icon')), color: oneOf(c, o.color, join(path, 'color'), DOMAIN_COLORS) }]
      })
    ),
    roles: Object.fromEntries(
      entries(c, d.roles, join(di.path, 'roles'), CAMEL, 'role codes are camelCase').map(([k, v]) => {
        const path = join(join(di.path, 'roles'), k)
        const o = obj(c, v, path, ['label', 'style'])
        return [k, { label: text(c, o.label, join(path, 'label')), style: oneOf(c, o.style, join(path, 'style'), ROLE_STYLES) }]
      })
    ),
    deliverables: Object.fromEntries(
      entries(c, d.deliverables, join(di.path, 'deliverables'), CAMEL, 'deliverable codes are camelCase').map(([k, v]) => [
        k,
        text(c, v, join(join(di.path, 'deliverables'), k))
      ])
    ),
    baDomains: strList(c, d.baDomains, join(di.path, 'baDomains'))
  }

  // ----- Skills
  const sk = block('Skills')
  const s = obj(c, sk.value, sk.path, ['items', 'clusters', 'connections', 'deliverableKit'])
  const clusterEntries = entries(c, s.clusters, join(sk.path, 'clusters'), /^(frontend|backend|database|analysis)$/, `allowed: ${SKILL_CATEGORIES.join(', ')}`)
  for (const cat of SKILL_CATEGORIES) {
    if (!clusterEntries.some(([k]) => k === cat)) c.error(join(join(sk.path, 'clusters'), cat), 'is required (Galaxy node)')
  }
  const skills: SourceSkills = {
    items: list(c, s.items, join(sk.path, 'items')).map((v, i) => {
      const path = join(join(sk.path, 'items'), i)
      const o = obj(c, v, path, ['name', 'category', 'since', 'until'])
      const until = int(c, o.until, join(path, 'until'), { optional: true })
      return {
        name: str(c, o.name, join(path, 'name')),
        category: oneOf(c, o.category, join(path, 'category'), SKILL_CATEGORIES),
        since: int(c, o.since, join(path, 'since')) ?? 0,
        ...(until !== undefined ? { until } : {})
      }
    }),
    clusters: Object.fromEntries(
      clusterEntries.map(([k, v]) => {
        const path = join(join(sk.path, 'clusters'), k)
        const o = obj(c, v, path, ['icon', 'accent', 'label', 'tier', 'desc', 'skills', 'keywords'])
        return [
          k,
          {
            icon: str(c, o.icon, join(path, 'icon')),
            accent: oneOf(c, o.accent, join(path, 'accent'), CLUSTER_ACCENTS),
            label: text(c, o.label, join(path, 'label')),
            tier: text(c, o.tier, join(path, 'tier')),
            desc: text(c, o.desc, join(path, 'desc')),
            skills: strList(c, o.skills, join(path, 'skills')),
            keywords: strList(c, o.keywords, join(path, 'keywords'))
          }
        ]
      })
    ) as SourceSkills['clusters'],
    connections: Object.fromEntries(
      entries(c, s.connections, join(sk.path, 'connections'), /^[a-z]+-[a-z]+$/, 'format "<from>-<to>"').map(([k, v]) => {
        const path = join(join(sk.path, 'connections'), k)
        if (!CONNECTION_IDS.includes(k)) c.error(path, `unsupported connection (Galaxy draws: ${CONNECTION_IDS.join(', ')})`)
        const o = obj(c, v, path, ['from', 'to', 'label'])
        return [
          k,
          {
            from: oneOf(c, o.from, join(path, 'from'), SKILL_CATEGORIES),
            to: oneOf(c, o.to, join(path, 'to'), SKILL_CATEGORIES),
            label: text(c, o.label, join(path, 'label'))
          }
        ]
      })
    ),
    deliverableKit: strList(c, s.deliverableKit, join(sk.path, 'deliverableKit'))
  }

  // ----- Achievements
  const ac = block('Achievements')
  const achievements: SourceAchievement[] = list(c, ac.value, ac.path).map((v, i) => {
    const path = join(ac.path, i)
    const o = obj(c, v, path, ['id', 'icon', 'title', 'company', 'track', 'milestone', 'project'])
    const project = str(c, o.project, join(path, 'project'), { optional: true })
    return {
      id: str(c, o.id, join(path, 'id'), { pattern: ACH_ID, hint: 'must be "<kebab-name>-<year>" (R-ID / R-ACH)' }),
      icon: str(c, o.icon, join(path, 'icon')),
      title: text(c, o.title, join(path, 'title')),
      company: str(c, o.company, join(path, 'company')),
      track: oneOf(c, o.track, join(path, 'track'), TRACKS),
      milestone: str(c, o.milestone, join(path, 'milestone')),
      ...(project ? { project } : {})
    }
  })

  // ----- Projects (one "### slug" per project; file order = display order)
  const ps = section('Projects')
  if (ps && ps.value !== undefined) c.error(where(ps, file), 'projects must be written as "### <slug>" sub-sections')
  const projects: SourceProject[] = (ps?.items ?? []).map(item => {
    const path = `Projects › ${item.key} (${file}:${item.line})`
    if (!SLUG.test(item.key)) c.error(path, 'slug must be kebab-case (R-ID)')
    const o = obj(c, item.value, path, [
      'period', 'company', 'customer', 'role', 'team', 'domain', 'tracks', 'layout', 'deliverables', 'tech', 'title', 'summary', 'responsibilities'
    ])
    let team: number | string = 0
    if (typeof o.team === 'number' && Number.isInteger(o.team) && o.team > 0) team = o.team
    else if (typeof o.team === 'string' && TEAM.test(o.team)) team = o.team
    else c.error(join(path, 'team'), `must be a positive integer or "N+" (R-TEAM), got ${JSON.stringify(o.team)}`)
    const tracks = list(c, o.tracks, join(path, 'tracks')).map((t, i) => oneOf(c, t, join(join(path, 'tracks'), i), TRACKS))
    if (!tracks.length) c.error(join(path, 'tracks'), 'needs at least one track')
    return {
      slug: item.key,
      line: item.line,
      period: str(c, o.period, join(path, 'period'), { pattern: PERIOD, hint: 'must be "MM/YYYY – MM/YYYY" (R-DATE)' }),
      company: str(c, o.company, join(path, 'company')),
      customer: str(c, o.customer, join(path, 'customer')),
      role: str(c, o.role, join(path, 'role')),
      team,
      domain: str(c, o.domain, join(path, 'domain')),
      tracks,
      ...(o.layout !== undefined ? { layout: oneOf(c, o.layout, join(path, 'layout'), ['featured', 'wide'] as const) } : {}),
      ...(o.deliverables !== undefined ? { deliverables: strList(c, o.deliverables, join(path, 'deliverables')) } : {}),
      tech: strList(c, o.tech, join(path, 'tech')),
      title: text(c, o.title, join(path, 'title')),
      summary: text(c, o.summary, join(path, 'summary')),
      responsibilities: textList(c, o.responsibilities, join(path, 'responsibilities'))
    }
  })

  // ----- Timeline (### builder, ### analyst)
  const tl = section('Timeline')
  const milestones = (track: ProjectTrack): SourceMilestone[] => {
    const item = tl?.items.find(it => it.key === track)
    if (tl && !item) c.error(where(tl, file), `missing "### ${track}"`)
    const path = `Timeline › ${track}${item ? ` (${file}:${item.line})` : ''}`
    return list(c, item?.value, path).map((v, i) => {
      const mp = join(path, i)
      const o = obj(c, v, mp, ['id', 'year', 'company', 'projects', 'title', 'desc'])
      const id = str(c, o.id, join(mp, 'id'), { pattern: MILESTONE_ID, hint: 'must be "<track>-<year>" (R-MILESTONE)' })
      if (id && !id.startsWith(`${track}-`)) c.error(join(mp, 'id'), `must start with "${track}-"`)
      return {
        id,
        year: str(c, o.year, join(mp, 'year'), { pattern: /^\d{4}( – \d{4})?$/, hint: 'must be "YYYY" or "YYYY – YYYY"' }),
        company: str(c, o.company, join(mp, 'company')),
        ...(o.projects !== undefined ? { projects: strList(c, o.projects, join(mp, 'projects')) } : {}),
        title: text(c, o.title, join(mp, 'title')),
        desc: text(c, o.desc, join(mp, 'desc'))
      }
    })
  }
  for (const it of tl?.items ?? []) {
    if (!(TRACKS as string[]).includes(it.key)) c.error(`Timeline › ${it.key}`, 'only "### builder" and "### analyst" are allowed')
  }
  const timeline = { builder: milestones('builder'), analyst: milestones('analyst') }

  // ----- Narrative
  const na = block('Narrative')
  const n = obj(c, na.value, na.path, ['builder', 'analyst', 'transition', 'strengths', 'contact'])
  const nb = obj(c, n.builder, join(na.path, 'builder'), ['subtitle', 'meta'])
  const nan = obj(c, n.analyst, join(na.path, 'analyst'), ['subtitle', 'meta', 'domainDesc'])
  const nt = obj(c, n.transition, join(na.path, 'transition'), ['quote', 'body', 'bodyShort', 'journey'])
  const nj = obj(c, nt.journey, join(join(na.path, 'transition'), 'journey'), [...JOURNEY_KEYS])
  const nc = obj(c, n.contact, join(na.path, 'contact'), ['subtitle', 'identity'])
  const ns = obj(c, n.strengths, join(na.path, 'strengths'), STRENGTH_KEYS)
  const narrative: SourceNarrative = {
    builder: { subtitle: text(c, nb.subtitle, join(na.path, 'builder › subtitle')), meta: text(c, nb.meta, join(na.path, 'builder › meta')) },
    analyst: {
      subtitle: text(c, nan.subtitle, join(na.path, 'analyst › subtitle')),
      meta: text(c, nan.meta, join(na.path, 'analyst › meta')),
      domainDesc: text(c, nan.domainDesc, join(na.path, 'analyst › domainDesc'))
    },
    transition: {
      quote: text(c, nt.quote, join(na.path, 'transition › quote')),
      body: text(c, nt.body, join(na.path, 'transition › body')),
      bodyShort: text(c, nt.bodyShort, join(na.path, 'transition › bodyShort')),
      journey: Object.fromEntries(JOURNEY_KEYS.map(k => [k, text(c, nj[k], join(na.path, `transition › journey › ${k}`))])) as SourceNarrative['transition']['journey']
    },
    strengths: Object.fromEntries(
      STRENGTH_KEYS.map(k => {
        const path = join(join(na.path, 'strengths'), k)
        const o = obj(c, ns[k], path, ['title', 'proof', 'kit', 'project'])
        return [
          k,
          {
            title: text(c, o.title, join(path, 'title')),
            proof: text(c, o.proof, join(path, 'proof')),
            ...(o.kit !== undefined ? { kit: strList(c, o.kit, join(path, 'kit')) } : {}),
            ...(o.project !== undefined ? { project: String(o.project) } : {})
          }
        ]
      })
    ),
    contact: { subtitle: text(c, nc.subtitle, join(na.path, 'contact › subtitle')), identity: text(c, nc.identity, join(na.path, 'contact › identity')) }
  }

  if (c.errors.length) throw new CvValidationError(doc.file, c.errors)
  return {
    source: {
      schemaVersion: doc.frontMatter.schemaVersion as number,
      profile, education, companies, customers, dictionaries, skills, achievements, projects, timeline, narrative
    },
    warnings: c.warnings
  }
}
