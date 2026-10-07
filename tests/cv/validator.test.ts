import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { parseCvMarkdown } from '../../cv-pipeline/parser.ts'
import { CvValidationError, validateSource } from '../../cv-pipeline/schema.ts'
import { checkIntegrity } from '../../cv-pipeline/integrity.ts'

const VALID_CV_PATH = resolve(process.cwd(), 'content/cv.md')
const VALID_CV_TEXT = readFileSync(VALID_CV_PATH, 'utf8')

describe('cv-pipeline / validator & integrity', () => {
  it('validates the production content/cv.md successfully', () => {
    const doc = parseCvMarkdown(VALID_CV_PATH, VALID_CV_TEXT)
    const { source, warnings } = validateSource(doc)
    expect(source.schemaVersion).toBe(1)
    expect(warnings).toEqual([])

    const integrity = checkIntegrity(source)
    expect(integrity).toEqual([])
  })

  it('fails when an unknown section is present', () => {
    const invalidMd = VALID_CV_TEXT + '\n## UnknownSection\n```yaml\nfoo: bar\n```\n'
    const doc = parseCvMarkdown('test.md', invalidMd)
    expect(() => validateSource(doc)).toThrow(CvValidationError)
  })

  it('fails when a required field is missing in Profile', () => {
    const invalidMd = VALID_CV_TEXT.replace('email: lequangtu28@gmail.com', '')
    const doc = parseCvMarkdown('test.md', invalidMd)
    expect(() => validateSource(doc)).toThrow(CvValidationError)
  })

  it('fails when an unknown field is added to Profile', () => {
    const invalidMd = VALID_CV_TEXT.replace(
      'email: lequangtu28@gmail.com',
      'email: lequangtu28@gmail.com\nunknownProperty: 123'
    )
    const doc = parseCvMarkdown('test.md', invalidMd)
    expect(() => validateSource(doc)).toThrow(CvValidationError)
  })

  it('warns when a text string lacks Vietnamese translation', () => {
    const singleLangMd = VALID_CV_TEXT.replace(
      'name: { en: Le Quang Tu, vi: Lê Quang Tú }',
      'name: { en: Le Quang Tu }'
    )
    const doc = parseCvMarkdown('test.md', singleLangMd)
    const { warnings } = validateSource(doc)
    expect(warnings.some(w => w.includes('missing "vi"'))).toBe(true)
  })

  it('detects broken cross-references (non-existent customer/company/domain)', () => {
    const doc = parseCvMarkdown(VALID_CV_PATH, VALID_CV_TEXT)
    const { source } = validateSource(doc)

    // Tamper source to reference a non-existent company
    const tampered = structuredClone(source)
    tampered.projects[0].company = 'non-existent-company'
    const integrity = checkIntegrity(tampered)
    expect(integrity.some(p => p.includes('non-existent-company'))).toBe(true)
  })

  it('detects unallowed placeholders in text', () => {
    const doc = parseCvMarkdown(VALID_CV_PATH, VALID_CV_TEXT)
    const { source } = validateSource(doc)

    const tampered = structuredClone(source)
    tampered.narrative.strengths.bilingual.proof = {
      en: 'Built systems for {unallowed_placeholder} years',
      vi: 'Phát triển hệ thống trong {unallowed_placeholder} năm'
    }
    const integrity = checkIntegrity(tampered)
    expect(integrity.some(p => p.includes('{unallowed_placeholder}'))).toBe(true)
  })
})
