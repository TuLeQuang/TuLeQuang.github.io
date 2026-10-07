/**
 * CLI for the CV pipeline (Node ≥ 22.18 runs .ts directly).
 *
 *   npm run cv:check   validate content/cv.md against the template + cv_transform_rules.md
 *   npm run cv:json    print the generated CvData (what the website receives)
 */
import { loadCv } from './index.ts'

const command = process.argv[2] ?? 'check'

try {
  const { data, warnings } = loadCv()
  for (const w of warnings) console.warn(`⚠️  ${w}`)
  if (command === 'json') {
    process.stdout.write(`${JSON.stringify(data, null, 2)}\n`)
  } else {
    const r = data.resume
    console.log(
      `✅ content/cv.md is valid (schema v${data.schemaVersion}): ${r.projects.length} projects, ${r.companies.length} companies, ` +
        `${r.customers.length} customers, ${r.achievements.length} achievements, ` +
        `${r.builderTimeline.length + r.analystTimeline.length} milestones, ${r.skills.length} skills` +
        (warnings.length ? ` — ${warnings.length} warning(s)` : '')
    )
  }
} catch (error) {
  console.error(`❌ ${(error as Error).message}`)
  process.exit(1)
}
