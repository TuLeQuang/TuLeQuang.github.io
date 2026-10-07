/**
 * Layer 3c — Transform rules: enforces content/cv_transform_rules.md on content/cv.md.
 *
 *   ## Registry       → every key is registered, never renamed, never reused (append-only)
 *   ## Normalization  → canonical tech names, role → tracks, skill experience sources
 *   ## Overrides      → frozen exceptions: deviations from a rule that are kept on purpose
 *
 * Rule lint re-computes the rules that can be derived from cv.md itself
 * (R-TECH, R-TRACK, R-DELIV, R-COMP, R-SKILL). A deviation fails unless an override covers it.
 * An override with `value` also freezes that value: changing the data requires updating the override.
 */
import type { RawDoc } from './parser.ts'
import type { CvSource } from './schema.ts'
import { Ctx, CvValidationError, MONTH } from './schema.ts'

export const REGISTRY_KINDS = ['projects', 'companies', 'customers', 'achievements', 'milestones', 'domains', 'roles', 'deliverables'] as const
export type RegistryKind = (typeof REGISTRY_KINDS)[number]
export const LINT_RULES = ['R-TECH', 'R-TRACK', 'R-DELIV', 'R-COMP', 'R-SKILL'] as const

export interface RegistryEntry { source: string; since: string; status: 'active' | 'removed' }
export type SkillSource = { tech: string[] } | { from: 'careerStart' | 'baStart' }
export interface Override { key: string; rule: string; value?: unknown; reason: string }

export interface TransformRules {
  registry: Record<RegistryKind, Record<string, RegistryEntry>>
  tech: Record<string, string[]>
  roleTracks: Record<string, string[]>
  skillSources: Record<string, SkillSource>
  overrides: Override[]
}

type Obj = Record<string, unknown>
const isObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v)

export function readRules(doc: RawDoc): TransformRules {
  const c = new Ctx(doc.file)
  const reg = doc.sections.Registry?.value
  const norm = doc.sections.Normalization?.value
  const ovr = doc.sections.Overrides?.value
  if (!isObj(reg)) c.error('## Registry', 'missing yaml block')
  if (!isObj(norm)) c.error('## Normalization', 'missing yaml block')
  if (ovr !== undefined && ovr !== null && !Array.isArray(ovr)) c.error('## Overrides', 'must be a list')

  const registry = {} as TransformRules['registry']
  for (const kind of REGISTRY_KINDS) {
    const raw = isObj(reg) ? reg[kind] : undefined
    registry[kind] = {}
    if (!isObj(raw)) {
      c.error(`Registry › ${kind}`, 'is required')
      continue
    }
    for (const [key, entry] of Object.entries(raw)) {
      const e = isObj(entry) ? entry : {}
      if (e.status !== 'active' && e.status !== 'removed') c.error(`Registry › ${kind} › ${key}`, 'status must be active | removed')
      registry[kind][key] = { source: String(e.source ?? ''), since: String(e.since ?? ''), status: e.status === 'removed' ? 'removed' : 'active' }
    }
  }

  const n = isObj(norm) ? norm : {}
  const asListMap = (v: unknown, path: string): Record<string, string[]> => {
    if (!isObj(v)) {
      c.error(path, 'is required (mapping)')
      return {}
    }
    return Object.fromEntries(Object.entries(v).map(([k, list]) => [k, Array.isArray(list) ? list.map(String) : []]))
  }
  const skillSources: Record<string, SkillSource> = {}
  if (!isObj(n.skillSources)) c.error('Normalization › skillSources', 'is required')
  else {
    for (const [name, v] of Object.entries(n.skillSources)) {
      if (isObj(v) && Array.isArray(v.tech)) skillSources[name] = { tech: v.tech.map(String) }
      else if (isObj(v) && (v.from === 'careerStart' || v.from === 'baStart')) skillSources[name] = { from: v.from }
      else c.error(`Normalization › skillSources › ${name}`, 'must be { tech: [...] } or { from: careerStart | baStart }')
    }
  }

  const overrides: Override[] = (Array.isArray(ovr) ? ovr : []).map((o, i) => {
    const e = isObj(o) ? o : {}
    if (typeof e.key !== 'string' || typeof e.rule !== 'string' || typeof e.reason !== 'string' || !e.reason) {
      c.error(`Overrides › ${i}`, 'needs key, rule and reason')
    }
    return { key: String(e.key ?? ''), rule: String(e.rule ?? ''), reason: String(e.reason ?? ''), ...('value' in e ? { value: e.value } : {}) }
  })

  if (c.errors.length) throw new CvValidationError(doc.file, c.errors)
  return {
    registry,
    tech: asListMap(n.tech, 'Normalization › tech'),
    roleTracks: asListMap(n.roleTracks, 'Normalization › roleTracks'),
    skillSources,
    overrides
  }
}

// ---------------------------------------------------------------------------

const year = (month: string): number => Number(month.slice(3))
const monthIndex = (month: string): number => Number(month.slice(3)) * 12 + Number(month.slice(0, 2))
const periodBounds = (period: string): [string, string] => period.split(' – ') as [string, string]

const deepEqual = (a: unknown, b: unknown): boolean => JSON.stringify(a) === JSON.stringify(b)

/** Current key sets of cv.md, per registry kind. */
export function keysOf(src: CvSource): Record<RegistryKind, string[]> {
  return {
    projects: src.projects.map(p => p.slug),
    companies: src.companies.map(c => c.id),
    customers: src.customers.map(c => c.id),
    achievements: src.achievements.map(a => a.id),
    milestones: [...src.timeline.builder, ...src.timeline.analyst].map(m => m.id),
    domains: Object.keys(src.dictionaries.domains),
    roles: Object.keys(src.dictionaries.roles),
    deliverables: Object.keys(src.dictionaries.deliverables)
  }
}

/** Value addressed by an override key: <kind>.<id>.<field> (id may contain dots). */
function resolve(src: CvSource, key: string): { found: boolean; value?: unknown } {
  const parts = key.split('.')
  if (parts.length < 3) return { found: false }
  const kind = parts[0]
  const field = parts[parts.length - 1] as string
  const id = parts.slice(1, -1).join('.')
  const pick = (item: object | undefined): { found: boolean; value?: unknown } =>
    item ? { found: true, value: (item as Record<string, unknown>)[field] } : { found: false }
  switch (kind) {
    case 'projects': return pick(src.projects.find(p => p.slug === id))
    case 'skills': return pick(src.skills.items.find(s => s.name === id))
    case 'achievements': return pick(src.achievements.find(a => a.id === id))
    case 'customers': return pick(src.customers.find(c => c.id === id))
    case 'companies': return pick(src.companies.find(c => c.id === id))
    case 'milestones': return pick([...src.timeline.builder, ...src.timeline.analyst].find(m => m.id === id))
    default: return { found: false }
  }
}

/** Compare a frozen override value with the data ("text" freezes both locales of a { en, vi } field). */
const sameValue = (frozen: unknown, actual: unknown): boolean => {
  if (typeof frozen === 'string' && isObj(actual) && 'en' in actual && 'vi' in actual) return actual.en === frozen && actual.vi === frozen
  return deepEqual(frozen, actual)
}

export function checkRules(src: CvSource, rules: TransformRules): { errors: string[]; warnings: string[] } {
  const errors: string[] = []
  const warnings: string[] = []

  // ----- Key Registry (R-ID): append-only, never renamed, never reused
  const keys = keysOf(src)
  for (const kind of REGISTRY_KINDS) {
    const reg = rules.registry[kind]
    for (const key of keys[kind]) {
      const entry = reg[key]
      if (!entry) errors.push(`Registry › ${kind} › ${key}: key is not registered in cv_transform_rules.md (add it with status: active)`)
      else if (entry.status === 'removed') errors.push(`Registry › ${kind} › ${key}: key was removed and must not be reused — pick a new key`)
    }
    for (const [key, entry] of Object.entries(reg)) {
      if (entry.status === 'active' && !keys[kind].includes(key)) {
        errors.push(`Registry › ${kind} › ${key}: active key is missing from cv.md (renamed by mistake? keep the old key, or set status: removed)`)
      }
    }
  }

  // ----- Rule lint
  const violations: Array<{ key: string; rule: string; actual: unknown; message: string }> = []
  const canonicalTech = Object.keys(rules.tech)

  for (const p of src.projects) {
    for (const t of p.tech) {
      if (!canonicalTech.includes(t)) {
        const alias = Object.entries(rules.tech).find(([, aliases]) => aliases.includes(t))?.[0]
        violations.push({
          key: `projects.${p.slug}.tech`, rule: 'R-TECH', actual: p.tech,
          message: `"${t}" is not a canonical tech name${alias ? ` — use "${alias}"` : ' (add it to Normalization › tech)'}`
        })
      }
    }
    const expectedTracks = rules.roleTracks[p.role] ?? rules.roleTracks['*'] ?? []
    if (!deepEqual([...p.tracks].sort(), [...expectedTracks].sort())) {
      violations.push({
        key: `projects.${p.slug}.tracks`, rule: 'R-TRACK', actual: p.tracks,
        message: `role "${p.role}" implies tracks [${expectedTracks.join(', ')}]`
      })
    }
    const isAnalyst = p.tracks.includes('analyst')
    const hasDeliverables = (p.deliverables?.length ?? 0) > 0
    if (isAnalyst !== hasDeliverables) {
      violations.push({
        key: `projects.${p.slug}.deliverables`, rule: 'R-DELIV', actual: p.deliverables,
        message: isAnalyst ? 'analyst-track projects must list deliverables' : 'only analyst-track projects have deliverables'
      })
    }
    const company = src.companies.find(c => c.id === p.company)
    if (company && MONTH.test(company.start)) {
      const [start] = periodBounds(p.period)
      if (MONTH.test(start)) {
        const s = monthIndex(start)
        const inside = s >= monthIndex(company.start) && (!company.end || s <= monthIndex(company.end))
        if (!inside) {
          violations.push({
            key: `projects.${p.slug}.company`, rule: 'R-COMP', actual: p.company,
            message: `starts ${start}, outside ${company.name} employment ${company.start} – ${company.end ?? 'present'}`
          })
        }
      }
    }
  }

  // R-SKILL: since = first year a project used it; until = last year, omitted while still in use
  const latestYear = Math.max(...src.projects.map(p => year(periodBounds(p.period)[1] ?? '01/0')))
  for (const skill of src.skills.items) {
    const source = rules.skillSources[skill.name]
    if (!source) {
      errors.push(`Skills › items › ${skill.name}: no experience source in Normalization › skillSources`)
      continue
    }
    let since: number
    let until: number | undefined
    if ('from' in source) {
      since = source.from === 'careerStart' ? src.profile.careerStart : src.profile.baStart
    } else {
      const used = src.projects.filter(p => p.tech.some(t => source.tech.includes(t)))
      if (!used.length) {
        errors.push(`Skills › items › ${skill.name}: no project uses ${source.tech.join(' / ')}`)
        continue
      }
      since = Math.min(...used.map(p => year(periodBounds(p.period)[0])))
      const last = Math.max(...used.map(p => year(periodBounds(p.period)[1])))
      until = last >= latestYear ? undefined : last
    }
    if (skill.since !== since) {
      violations.push({ key: `skills.${skill.name}.since`, rule: 'R-SKILL', actual: skill.since, message: `rule gives since: ${since}` })
    }
    if (skill.until !== until) {
      violations.push({ key: `skills.${skill.name}.until`, rule: 'R-SKILL', actual: skill.until, message: `rule gives ${until === undefined ? 'no until (still in use)' : `until: ${until}`}` })
    }
  }

  // ----- Overrides: cover violations + freeze values
  for (const v of violations) {
    const covered = rules.overrides.some(o => o.key === v.key && o.rule === v.rule)
    if (!covered) errors.push(`${v.rule} ${v.key}: ${v.message} (fix the data, or add an override with a reason)`)
  }
  for (const o of rules.overrides) {
    const target = resolve(src, o.key)
    if (!target.found) {
      errors.push(`Overrides › ${o.key}: key does not exist in cv.md`)
      continue
    }
    if ('value' in o && !sameValue(o.value, target.value)) {
      errors.push(`Overrides › ${o.key} (${o.rule}): value is frozen as ${JSON.stringify(o.value)} but cv.md has ${JSON.stringify(target.value)} — update the override (and changelog) if the change is intended`)
    }
    if ((LINT_RULES as readonly string[]).includes(o.rule) && !violations.some(v => v.key === o.key && v.rule === o.rule) && !('value' in o)) {
      warnings.push(`Overrides › ${o.key} (${o.rule}): no longer needed — the data follows the rule`)
    }
  }
  return { errors, warnings }
}
