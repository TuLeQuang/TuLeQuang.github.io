import { describe, expect, it } from 'vitest'
import { CURRENT_SCHEMA_VERSION, migrate } from '../../cv-pipeline/migrations.ts'
import type { RawDoc } from '../../cv-pipeline/parser.ts'

describe('cv-pipeline / migrations', () => {
  it('accepts doc with matching schemaVersion', () => {
    const doc: RawDoc = {
      file: 'test.md',
      frontMatter: { schemaVersion: CURRENT_SCHEMA_VERSION },
      sections: {}
    }
    const result = migrate(doc)
    expect(result.from).toBe(CURRENT_SCHEMA_VERSION)
    expect(result.doc.frontMatter.schemaVersion).toBe(CURRENT_SCHEMA_VERSION)
  })

  it('throws error when schemaVersion is missing or non-integer', () => {
    const invalidDocs: RawDoc[] = [
      { file: 'test.md', frontMatter: {}, sections: {} },
      { file: 'test.md', frontMatter: { schemaVersion: '1' }, sections: {} },
      { file: 'test.md', frontMatter: { schemaVersion: 0 }, sections: {} }
    ]
    for (const doc of invalidDocs) {
      expect(() => migrate(doc)).toThrow(/schemaVersion/)
    }
  })

  it('throws error when schemaVersion is from the future', () => {
    const futureDoc: RawDoc = {
      file: 'test.md',
      frontMatter: { schemaVersion: CURRENT_SCHEMA_VERSION + 1 },
      sections: {}
    }
    expect(() => migrate(futureDoc)).toThrow(/newer than the converter/)
  })
})
