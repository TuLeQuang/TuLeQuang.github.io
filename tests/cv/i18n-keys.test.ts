import { describe, expect, it } from 'vitest'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { resolve, join } from 'node:path'

describe('i18n / locales integrity & key separation', () => {
  const enFile = resolve(process.cwd(), 'src/locales/en.json')
  const viFile = resolve(process.cwd(), 'src/locales/vi.json')
  const en = JSON.parse(readFileSync(enFile, 'utf8'))
  const vi = JSON.parse(readFileSync(viFile, 'utf8'))

  const getKeys = (obj: Record<string, unknown>, prefix = ''): string[] => {
    let keys: string[] = []
    for (const [k, v] of Object.entries(obj)) {
      const full = prefix ? `${prefix}.${k}` : k
      if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
        keys = keys.concat(getKeys(v as Record<string, unknown>, full))
      } else {
        keys.push(full)
      }
    }
    return keys
  }

  const enKeys = new Set(getKeys(en))
  const viKeys = new Set(getKeys(vi))

  it('en.json and vi.json have identical keys', () => {
    const missingInVi = [...enKeys].filter(k => !viKeys.has(k))
    const missingInEn = [...viKeys].filter(k => !enKeys.has(k))
    expect(missingInVi).toEqual([])
    expect(missingInEn).toEqual([])
  })

  it('all static t(...) and <i18n-t keypath="..."> in src/ exist in locale files', () => {
    const scanFiles = (dir: string): string[] => {
      let files: string[] = []
      for (const f of readdirSync(dir)) {
        const full = join(dir, f)
        if (statSync(full).isDirectory()) files = files.concat(scanFiles(full))
        else if (/\.(vue|ts)$/.test(f)) files.push(full)
      }
      return files
    }

    const files = scanFiles(resolve(process.cwd(), 'src'))
    const tRegex = /\bt\(\s*['"]([a-zA-Z0-9_.-]+)['"]/g
    const i18nTRegex = /<i18n-t[^>]+keypath=['"]([a-zA-Z0-9_.-]+)['"]/g

    const usedKeys = new Set<string>()
    for (const file of files) {
      const content = readFileSync(file, 'utf8')
      let m: RegExpExecArray | null
      while ((m = tRegex.exec(content)) !== null) usedKeys.add(m[1])
      while ((m = i18nTRegex.exec(content)) !== null) usedKeys.add(m[1])
    }

    const missing = [...usedKeys].filter(k => !enKeys.has(k))
    expect(missing).toEqual([])
  })

  it('no CV content keys remain in locale files', () => {
    const forbiddenCvKeys = [
      'projects',
      'companies',
      'customers',
      'roles',
      'domains',
      'deliverables',
      'achievements',
      'milestones',
      'profile.name',
      'profile.role',
      'profile.targetRole',
      'profile.next',
      'profile.tagline',
      'profile.location',
      'profile.objective',
      'galaxy.education.school',
      'galaxy.education.major',
      'galaxy.clusters',
      'galaxy.connections',
      'builder.subtitle',
      'builder.metaValue',
      'analyst.subtitle',
      'analyst.metaValue',
      'analyst.domainDesc',
      'transition.quote',
      'transition.body',
      'transition.bodyShort',
      'transition.journey',
      'strengths.items',
      'contact.subtitle',
      'contact.identity',
      'nav.badge',
      'footer.badge',
      'footer.tagline'
    ]

    for (const forbidden of forbiddenCvKeys) {
      expect(enKeys.has(forbidden)).toBe(false)
      expect(viKeys.has(forbidden)).toBe(false)
    }
  })
})
