/**
 * Layer 1 — Parser: Markdown + fenced ```yaml blocks → RawDoc.
 *
 * Only knows the *syntax* of the file:
 *   - optional YAML front matter between `---` lines
 *   - `## Section` headings (section key = first word, e.g. "## Projects · Dự án" → "Projects")
 *   - `### key` sub-headings (key = first token, e.g. "### crm-system — CRM" → "crm-system")
 *   - exactly one ```yaml block per section / sub-section; everything else is free notes and ignored
 */
import { parseDocument } from 'yaml'

export interface RawBlock {
  key: string
  value: unknown
  /** 1-based line of the heading in the source file */
  line: number
}

export interface RawSection {
  name: string
  line: number
  /** Value of a yaml block placed directly under `## Section` */
  value?: unknown
  /** Ordered `### key` sub-sections */
  items: RawBlock[]
}

export interface RawDoc {
  file: string
  frontMatter: Record<string, unknown>
  sections: Record<string, RawSection>
}

export class CvSyntaxError extends Error {
  constructor(file: string, line: number, message: string) {
    super(`${file}:${line} — ${message}`)
    this.name = 'CvSyntaxError'
  }
}

const SECTION_RE = /^##\s+(?:\d+[.)]\s*)?([A-Za-z][A-Za-z0-9]*)/
const ITEM_RE = /^###\s+([A-Za-z0-9][A-Za-z0-9._-]*)/
const FENCE_OPEN_RE = /^```\s*(ya?ml)\s*$/i
const FENCE_ANY_RE = /^```/

const parseYaml = (file: string, source: string, startLine: number): unknown => {
  const doc = parseDocument(source, { uniqueKeys: true })
  const error = doc.errors[0]
  if (error) {
    const line = startLine + (error.linePos?.[0]?.line ?? 1) - 1
    throw new CvSyntaxError(file, line, `YAML error: ${error.message.split('\n')[0]}`)
  }
  return doc.toJS()
}

/**
 * @param onlySections when set, yaml blocks of other sections are ignored (used for the rules file,
 *                     whose prose may contain example snippets)
 */
export function parseCvMarkdown(file: string, text: string, onlySections?: string[]): RawDoc {
  const lines = text.replace(/\r\n?/g, '\n').split('\n')
  const doc: RawDoc = { file, frontMatter: {}, sections: {} }
  let i = 0

  if (lines[0]?.trim() === '---') {
    const end = lines.findIndex((l, idx) => idx > 0 && l.trim() === '---')
    if (end < 0) throw new CvSyntaxError(file, 1, 'Front matter is not closed with ---')
    const fm = parseYaml(file, lines.slice(1, end).join('\n'), 2)
    doc.frontMatter = (fm ?? {}) as Record<string, unknown>
    i = end + 1
  }

  let section: RawSection | null = null
  let item: RawBlock | null = null
  /** whether the current section / item already received its yaml block */
  let filled = false

  for (; i < lines.length; i++) {
    const line = lines[i] ?? ''
    const sectionMatch = SECTION_RE.exec(line)
    if (sectionMatch) {
      const name = sectionMatch[1] as string
      item = null
      filled = false
      section = { name, line: i + 1, items: [] }
      if (onlySections && !onlySections.includes(name)) continue // prose section: tracked but not registered
      if (doc.sections[name]) throw new CvSyntaxError(file, i + 1, `Duplicate section "## ${name}"`)
      doc.sections[name] = section
      continue
    }
    const itemMatch = ITEM_RE.exec(line)
    if (itemMatch && section) {
      const key = itemMatch[1] as string
      if (section.items.some(it => it.key === key)) {
        throw new CvSyntaxError(file, i + 1, `Duplicate key "### ${key}" in section "${section.name}"`)
      }
      item = { key, value: undefined, line: i + 1 }
      section.items.push(item)
      filled = false
      continue
    }
    if (FENCE_ANY_RE.test(line)) {
      const isYaml = FENCE_OPEN_RE.test(line)
      const start = i + 1
      let end = start
      while (end < lines.length && !/^```\s*$/.test(lines[end] ?? '')) end++
      if (end >= lines.length) throw new CvSyntaxError(file, i + 1, 'Code block is not closed with ```')
      i = end
      const wanted = section && (!onlySections || onlySections.includes(section.name))
      if (!isYaml || !wanted || !section) continue
      if (filled) {
        throw new CvSyntaxError(file, start, `Only one yaml block is allowed per ${item ? `"### ${item.key}"` : `"## ${section.name}"`}`)
      }
      const value = parseYaml(file, lines.slice(start, end).join('\n'), start + 1)
      if (item) item.value = value
      else section.value = value
      filled = true
    }
  }
  return doc
}
