import { describe, expect, it } from 'vitest'
import { CvSyntaxError, parseCvMarkdown } from '../../cv-pipeline/parser.ts'

describe('cv-pipeline / parser', () => {
  it('parses frontmatter, sections, and items correctly', () => {
    const md = `---
schemaVersion: 1
locales: [en, vi]
---

## Profile
\`\`\`yaml
name: { en: Le Quang Tu, vi: Lê Quang Tú }
careerStart: 2018
\`\`\`

## Projects
Text note outside yaml

### test-project
\`\`\`yaml
role: ba
team: 4
\`\`\`
`
    const doc = parseCvMarkdown('test.md', md)
    expect(doc.frontMatter.schemaVersion).toBe(1)
    expect(doc.frontMatter.locales).toEqual(['en', 'vi'])
    expect(doc.sections.Profile).toBeDefined()
    expect(doc.sections.Profile.value).toEqual({
      name: { en: 'Le Quang Tu', vi: 'Lê Quang Tú' },
      careerStart: 2018
    })
    expect(doc.sections.Projects).toBeDefined()
    expect(doc.sections.Projects.items).toHaveLength(1)
    expect(doc.sections.Projects.items[0]).toEqual({
      key: 'test-project',
      value: { role: 'ba', team: 4 },
      line: 15
    })
  })

  it('handles numbered section headings like "## 3. Registry"', () => {
    const md = `
## 3. Registry
\`\`\`yaml
foo: bar
\`\`\`
`
    const doc = parseCvMarkdown('test.md', md)
    expect(doc.sections.Registry).toBeDefined()
    expect(doc.sections.Registry.value).toEqual({ foo: 'bar' })
  })

  it('filters sections when onlySections is specified', () => {
    const md = `
## ProseSection
\`\`\`yaml
ignore: this
\`\`\`

## KeepSection
\`\`\`yaml
keep: true
\`\`\`
`
    const doc = parseCvMarkdown('test.md', md, ['KeepSection'])
    expect(doc.sections.ProseSection).toBeUndefined()
    expect(doc.sections.KeepSection).toBeDefined()
    expect(doc.sections.KeepSection.value).toEqual({ keep: true })
  })

  it('throws CvSyntaxError on unclosed frontmatter', () => {
    const md = `---
schemaVersion: 1
`
    expect(() => parseCvMarkdown('test.md', md)).toThrow(CvSyntaxError)
  })

  it('throws CvSyntaxError on invalid YAML in section', () => {
    const md = `
## Profile
\`\`\`yaml
invalid: [
\`\`\`
`
    expect(() => parseCvMarkdown('test.md', md)).toThrow(CvSyntaxError)
  })

  it('throws CvSyntaxError on unclosed code fence', () => {
    const md = `
## Profile
\`\`\`yaml
name: Test
`
    expect(() => parseCvMarkdown('test.md', md)).toThrow(CvSyntaxError)
  })
})
