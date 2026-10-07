/**
 * cv-pipeline entry: content/cv.md (+ content/cv_transform_rules.md) → CvData.
 *
 *   Parser → Migrator → Validator (schema + integrity + transform rules) → Mapper
 *
 * Runs in Node only (Vite plugin, CLI, tests) — nothing here is shipped to the browser.
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { parseCvMarkdown } from './parser.ts'
import { migrate } from './migrations.ts'
import { CvValidationError, validateSource } from './schema.ts'
import type { CvSource } from './schema.ts'
import { checkIntegrity } from './integrity.ts'
import { checkRules, readRules } from './rules.ts'
import { toCvData } from './mapper.ts'
import type { CvData } from '../src/types/index.ts'

export const CV_FILE = 'content/cv.md'
export const RULES_FILE = 'content/cv_transform_rules.md'
export const RULE_SECTIONS = ['Registry', 'Normalization', 'Overrides']

export interface LoadedCv {
  data: CvData
  source: CvSource
  warnings: string[]
  files: { cv: string; rules: string }
}

export interface LoadOptions {
  root?: string
  /** Override file contents (tests) */
  cvText?: string
  rulesText?: string
}

export function loadCv(options: LoadOptions = {}): LoadedCv {
  const root = options.root ?? process.cwd()
  const cvPath = resolve(root, CV_FILE)
  const rulesPath = resolve(root, RULES_FILE)
  const cvText = options.cvText ?? readFileSync(cvPath, 'utf8')
  const rulesText = options.rulesText ?? readFileSync(rulesPath, 'utf8')

  const { doc } = migrate(parseCvMarkdown(cvPath, cvText))
  const { source, warnings } = validateSource(doc)

  const integrity = checkIntegrity(source)
  if (integrity.length) throw new CvValidationError(cvPath, integrity)

  const rules = readRules(parseCvMarkdown(rulesPath, rulesText, RULE_SECTIONS))
  const ruleCheck = checkRules(source, rules)
  if (ruleCheck.errors.length) throw new CvValidationError(`${cvPath} (rules: ${RULES_FILE})`, ruleCheck.errors)

  return { data: toCvData(source), source, warnings: [...warnings, ...ruleCheck.warnings], files: { cv: cvPath, rules: rulesPath } }
}
