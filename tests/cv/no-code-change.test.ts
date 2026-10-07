import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { loadCv } from '../../cv-pipeline/index.ts'

describe('cv-pipeline / no-code-change verification', () => {
  const CV_PATH = resolve(process.cwd(), 'content/cv.md')
  const RULES_PATH = resolve(process.cwd(), 'content/cv_transform_rules.md')
  const originalCv = readFileSync(CV_PATH, 'utf8')
  const originalRules = readFileSync(RULES_PATH, 'utf8')

  it('allows adding a new project with a new domain without modifying any application code', () => {
    // 1. Add new domain 'FinTech' in Dictionaries in cv.md
    let cvMd = originalCv.replace(
      'baDomains: [ AI, Logistics, IoT, Warehouse, AdTech, CRM, HRTech ]',
      'baDomains: [ AI, Logistics, IoT, Warehouse, AdTech, CRM, HRTech, FinTech ]'
    )
    cvMd = cvMd.replace(
      '    color: hrtech',
      '    color: hrtech\n  FinTech:\n    label: { en: FinTech / Banking, vi: FinTech / Ngân hàng }\n    icon: 💳\n    color: ai'
    )

    // 2. Add new project 'fintech-core' under ## Projects
    const newProjectYaml = `
### fintech-core
\`\`\`yaml
period: 01/2026 – 03/2026
company: cmc
customer: cmcCustomer
role: ba
team: 5
domain: FinTech
tracks: [analyst]
deliverables: [srs, wbs]
tech: [Java, Spring, Vue.js]
title:
  en: FinTech Core Banking
  vi: Hệ thống Ngân hàng Lõi FinTech
summary:
  en: Core banking solution design and requirement specification.
  vi: Phân tích và thiết kế giải pháp ngân hàng lõi.
responsibilities:
  en: [Elicited requirements from stakeholders, Created SRS and WBS]
  vi: [Thu thập yêu cầu từ đối tác, Xây dựng tài liệu SRS và WBS]
\`\`\`
`
    cvMd = cvMd.replace('### crm-system', newProjectYaml + '\n### crm-system')

    // 3. Register the new domain and project in cv_transform_rules.md
    let rulesMd = originalRules.replace(
      'domains:\n',
      'domains:\n  FinTech: { source: "FinTech Banking", since: v2, status: active }\n'
    )
    rulesMd = rulesMd.replace(
      'projects:\n',
      'projects:\n  fintech-core: { source: "FinTech Core Banking", since: v2, status: active }\n'
    )

    // 4. Run pipeline
    const loaded = loadCv({ cvText: cvMd, rulesText: rulesMd })

    // 5. Verify the data mapped cleanly
    expect(loaded.source.projects.some(p => p.slug === 'fintech-core')).toBe(true)
    expect(loaded.data.resume.projects.some(p => p.slug === 'fintech-core')).toBe(true)
    expect(loaded.data.resume.baDomains).toContain('FinTech')

    // Verify multilingual content
    expect(loaded.data.content.en.projects['fintech-core'].title).toBe('FinTech Core Banking')
    expect(loaded.data.content.vi.projects['fintech-core'].title).toBe('Hệ thống Ngân hàng Lõi FinTech')
    expect(loaded.data.content.en.domains.FinTech).toBe('FinTech / Banking')
    expect(loaded.data.content.vi.domains.FinTech).toBe('FinTech / Ngân hàng')
  })
})
