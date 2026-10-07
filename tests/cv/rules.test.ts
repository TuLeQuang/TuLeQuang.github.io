import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { parseCvMarkdown } from '../../cv-pipeline/parser.ts'
import { validateSource } from '../../cv-pipeline/schema.ts'
import { checkRules, readRules } from '../../cv-pipeline/rules.ts'

const CV_PATH = resolve(process.cwd(), 'content/cv.md')
const RULES_PATH = resolve(process.cwd(), 'content/cv_transform_rules.md')
const CV_TEXT = readFileSync(CV_PATH, 'utf8')
const RULES_TEXT = readFileSync(RULES_PATH, 'utf8')

describe('cv-pipeline / transform rules & registry', () => {
  const loadBase = () => {
    const cvDoc = parseCvMarkdown(CV_PATH, CV_TEXT)
    const { source } = validateSource(cvDoc)
    const rulesDoc = parseCvMarkdown(RULES_PATH, RULES_TEXT, ['Registry', 'Normalization', 'Overrides'])
    const rules = readRules(rulesDoc)
    return { source, rules }
  }

  it('validates production cv.md against cv_transform_rules.md with zero errors', () => {
    const { source, rules } = loadBase()
    const { errors, warnings } = checkRules(source, rules)
    expect(errors).toEqual([])
    expect(warnings).toEqual([])
  })

  it('detects an unregistered key in cv.md', () => {
    const { source, rules } = loadBase()
    const tampered = structuredClone(source)
    tampered.projects.push({
      ...tampered.projects[0],
      slug: 'unregistered-project'
    })
    const { errors } = checkRules(tampered, rules)
    expect(errors.some(e => e.includes('unregistered-project') && e.includes('not registered'))).toBe(true)
  })

  it('detects a missing active key from registry', () => {
    const { source, rules } = loadBase()
    const tampered = structuredClone(source)
    tampered.projects = tampered.projects.filter(p => p.slug !== 'crm-system')
    const { errors } = checkRules(tampered, rules)
    expect(errors.some(e => e.includes('crm-system') && e.includes('active key is missing'))).toBe(true)
  })

  it('detects reuse of a removed key', () => {
    const { source, rules } = loadBase()
    const tamperedRules = structuredClone(rules)
    tamperedRules.registry.projects['crm-system'].status = 'removed'
    const { errors } = checkRules(source, tamperedRules)
    expect(errors.some(e => e.includes('crm-system') && e.includes('was removed and must not be reused'))).toBe(true)
  })

  it('detects an uncanonical technology violation (R-TECH)', () => {
    const { source, rules } = loadBase()
    const tampered = structuredClone(source)
    tampered.projects[0].tech.push('NonExistentFramework')
    const { errors } = checkRules(tampered, rules)
    expect(errors.some(e => e.includes('R-TECH') && e.includes('NonExistentFramework'))).toBe(true)
  })

  it('detects a role-track mismatch violation (R-TRACK)', () => {
    const { source, rules } = loadBase()
    const tampered = structuredClone(source)
    // ba role should have tracks: [analyst], but we give it [builder]
    tampered.projects[0].tracks = ['builder']
    const { errors } = checkRules(tampered, rules)
    expect(errors.some(e => e.includes('R-TRACK'))).toBe(true)
  })

  it('detects frozen override value divergence', () => {
    const { source, rules } = loadBase()
    const tamperedRules = structuredClone(rules)
    // Mapbox has override: { key: skills.Mapbox.until, rule: R-SKILL, value: 2023 }
    const mapboxOverride = tamperedRules.overrides.find(o => o.key === 'skills.Mapbox.until')
    expect(mapboxOverride).toBeDefined()
    if (mapboxOverride) mapboxOverride.value = 2020 // Diverge frozen value

    const { errors } = checkRules(source, tamperedRules)
    expect(errors.some(e => e.includes('skills.Mapbox.until') && e.includes('frozen as 2020'))).toBe(true)
  })
})
