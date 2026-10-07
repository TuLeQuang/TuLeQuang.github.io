/**
 * Layer 2 — Migrator: upgrades an older template (schemaVersion N) to the current one.
 *
 * When the template structure changes:
 *   1. bump CURRENT_SCHEMA_VERSION
 *   2. add `migrations[N]` converting a vN RawDoc into a vN+1 RawDoc
 *   3. adapt schema.ts / mapper.ts — components and composables stay untouched
 * Old cv.md files keep working because they are migrated step by step on load.
 */
import type { RawDoc } from './parser.ts'

export const CURRENT_SCHEMA_VERSION = 1

type Migration = (doc: RawDoc) => RawDoc

/** migrations[N] upgrades a vN document to vN+1. */
const migrations: Record<number, Migration> = {
  // Example for a future v2:
  // 1: doc => { rename doc.sections.Timeline items ...; return doc }
}

export function migrate(doc: RawDoc): { doc: RawDoc; from: number } {
  const declared = doc.frontMatter.schemaVersion
  const from = typeof declared === 'number' ? declared : NaN
  if (!Number.isInteger(from) || from < 1) {
    throw new Error(`${doc.file}: front matter must declare an integer "schemaVersion" (current: ${CURRENT_SCHEMA_VERSION})`)
  }
  if (from > CURRENT_SCHEMA_VERSION) {
    throw new Error(`${doc.file}: schemaVersion ${from} is newer than the converter (${CURRENT_SCHEMA_VERSION}). Update cv-pipeline.`)
  }
  let current = doc
  for (let v = from; v < CURRENT_SCHEMA_VERSION; v++) {
    const step = migrations[v]
    if (!step) throw new Error(`Missing migration v${v} → v${v + 1} in cv-pipeline/migrations.ts`)
    current = step(current)
    current.frontMatter.schemaVersion = v + 1
  }
  return { doc: current, from }
}
