/**
 * Phase 1a — ONE-OFF migration (already executed for template v1, kept for traceability).
 *
 * Generates content/cv.md from the legacy sources that the website used before the CV-as-data
 * refactor: src/data/resume.ts + src/locales/{en,vi}.json + hard-coded maps in utils/components.
 * Output therefore reproduces the current website 1:1 (verified by tests/golden).
 *
 * It only runs against the legacy sources (git history before the refactor):
 *   node scripts/cv/migrate-legacy.ts
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { Document, isMap, isScalar, isSeq, visit, Scalar } from 'yaml'
import { resumeData } from '../../src/data/resume.ts'
import { domainIcons, domainStyles, roleStyles, skillKeywords } from '../../src/utils/styleMaps.ts'
import { BA_START, CAREER_START } from '../../src/utils/experience.ts'

type Json = Record<string, any>
const en: Json = JSON.parse(readFileSync('src/locales/en.json', 'utf8'))
const vi: Json = JSON.parse(readFileSync('src/locales/vi.json', 'utf8'))

const get = (obj: Json, path: string): any => path.split('.').reduce((o, k) => o?.[k], obj)

/** Localized text: plain string when en === vi, otherwise { en, vi }. */
const text = (path: string): string | { en: string; vi: string } => {
  const e = get(en, path)
  const v = get(vi, path)
  if (typeof e !== 'string' || typeof v !== 'string') throw new Error(`Missing text ${path}`)
  if (/[@|]|\{'/.test(e + v)) throw new Error(`vue-i18n special syntax in ${path} — migrate by hand`)
  return e === v ? e : { en: e, vi: v }
}
const textList = (path: string): string[] | { en: string[]; vi: string[] } => {
  const e = get(en, path) as string[]
  const v = get(vi, path) as string[]
  return JSON.stringify(e) === JSON.stringify(v) ? e : { en: e, vi: v }
}

const assert = (cond: unknown, message: string): void => {
  if (!cond) throw new Error(`Legacy data inconsistency: ${message}`)
}

const companyId = (name: string): string => {
  const c = resumeData.companies.find(x => x.name === name)
  assert(c, `unknown company ${name}`)
  return c!.i18nKey
}

// ---------------------------------------------------------------------------
const profile = {
  name: text('profile.name'),
  role: text('profile.role'),
  targetRole: text('profile.targetRole'),
  tagline: text('profile.tagline'),
  location: text('profile.location'),
  objective: text('profile.objective'),
  email: resumeData.personalInfo.email,
  phone: resumeData.personalInfo.phone,
  careerStart: CAREER_START,
  baStart: BA_START,
  socials: resumeData.personalInfo.socialLinks.map(s => ({ platform: s.platform, icon: s.icon, url: s.url })),
  cvPdf: resumeData.personalInfo.cvUrl.en === resumeData.personalInfo.cvUrl.vi ? resumeData.personalInfo.cvUrl.en : resumeData.personalInfo.cvUrl
}
assert(get(en, 'profile.next') === `→ ${get(en, 'profile.targetRole')}` && get(vi, 'profile.next') === `→ ${get(vi, 'profile.targetRole')}`, 'profile.next is "→ targetRole"')

const education = {
  school: text('galaxy.education.school'),
  major: text('galaxy.education.major'),
  period: resumeData.education.period,
  gpa: resumeData.education.gpa
}

const companies = resumeData.companies.map(c => {
  assert(get(en, `companies.${c.i18nKey}.name`) === c.name && get(vi, `companies.${c.i18nKey}.name`) === c.name, `companies.${c.i18nKey}.name`)
  assert(c.since === Number(c.start.slice(3)) && c.until === (c.end ? Number(c.end.slice(3)) : undefined), `${c.name} since/until`)
  return { id: c.i18nKey, name: c.name, start: c.start, ...(c.end ? { end: c.end } : {}), role: text(`companies.${c.i18nKey}.role`) }
})

const customers = resumeData.customers.map(c => {
  const label = text(`customers.${c.id}`)
  return {
    id: c.id,
    name: c.name,
    ...(label !== c.name ? { label } : {}),
    company: companyId(c.company),
    ...(c.keyClient ? { keyClient: true } : {})
  }
})

const domainColor = (code: string): string => (domainStyles as Json)[code].dot.replace('bg-domain-', '')
const ROLE_PALETTE: Record<string, string> = {
  'bg-secondary-purple-light text-domain-ai-text': 'purple',
  'bg-linear-to-r from-primary-container to-domain-ai text-white': 'gradient',
  'bg-domain-supplychain-bg text-domain-supplychain-text': 'green',
  'bg-primary-blue-light text-primary-blue-dark': 'blue'
}
const dictionaries = {
  domains: Object.fromEntries(
    Object.keys(en.domains).map(k => [k, { label: text(`domains.${k}`), icon: (domainIcons as Json)[k], color: domainColor(k) }])
  ),
  roles: Object.fromEntries(
    Object.keys(en.roles).map(k => {
      const style = ROLE_PALETTE[(roleStyles as Json)[k]]
      assert(style, `role style ${k}`)
      return [k, { label: text(`roles.${k}`), style }]
    })
  ),
  deliverables: Object.fromEntries(Object.keys(en.deliverables).map(k => [k, text(`deliverables.${k}`)])),
  baDomains: resumeData.baDomains
}

const skills = {
  items: resumeData.skills.map(s => ({ name: s.name, category: s.category, since: s.since, ...(s.until ? { until: s.until } : {}) })),
  clusters: Object.fromEntries(
    resumeData.skillClusters.map(c => [
      c.id,
      {
        icon: c.icon,
        accent: c.accent,
        label: text(`galaxy.clusters.${c.id}.label`),
        tier: text(`galaxy.clusters.${c.id}.tier`),
        desc: text(`galaxy.clusters.${c.id}.desc`),
        skills: c.skills,
        keywords: skillKeywords[c.id]
      }
    ])
  ),
  connections: Object.fromEntries(
    resumeData.galaxyConnections.map(c => [c.id, { from: c.from, to: c.to, label: text(`galaxy.connections.${c.id}`) }])
  ),
  // AnalystSkills.vue `kit`
  deliverableKit: ['wbs', 'srs', 'wireframe', 'proposal', 'useCase', 'mockup']
}

const achievements = resumeData.achievements.map(a => ({
  id: a.id,
  icon: a.icon,
  title: text(`achievements.${a.id}`),
  company: companyId(a.company),
  track: a.track,
  milestone: a.milestoneId,
  ...(a.projectSlug ? { project: a.projectSlug } : {})
}))

const projects = resumeData.projects.map(p => {
  // achievementId is derived from Achievements › project in the new template
  assert(p.achievementId === resumeData.achievements.find(a => a.projectSlug === p.slug)?.id, `${p.slug} achievementId`)
  return {
    slug: p.slug,
    data: {
      period: p.period,
      company: companyId(p.company),
      customer: p.customer,
      role: p.role,
      team: p.teamSize,
      domain: p.domain,
      tracks: p.tracks,
      ...(p.layout ? { layout: p.layout } : {}),
      ...(p.deliverables ? { deliverables: p.deliverables } : {}),
      tech: p.technologies,
      title: text(`projects.${p.slug}.title`),
      summary: text(`projects.${p.slug}.summary`),
      responsibilities: textList(`projects.${p.slug}.responsibilities`)
    }
  }
})

const milestones = (list: typeof resumeData.builderTimeline) =>
  list.map(m => {
    // achievementId is derived from Achievements › milestone in the new template
    assert(m.achievementId === resumeData.achievements.find(a => a.milestoneId === m.id)?.id, `${m.id} achievementId`)
    return {
      id: m.id,
      year: m.year,
      company: companyId(m.company),
      ...(m.projectSlugs ? { projects: m.projectSlugs } : {}),
      title: text(`milestones.${m.id}.title`),
      desc: text(`milestones.${m.id}.desc`)
    }
  })

const narrative = {
  builder: { subtitle: text('builder.subtitle'), meta: text('builder.metaValue') },
  analyst: { subtitle: text('analyst.subtitle'), meta: text('analyst.metaValue'), domainDesc: text('analyst.domainDesc') },
  transition: {
    quote: text('transition.quote'),
    body: text('transition.body'),
    bodyShort: text('transition.bodyShort'),
    journey: { dev: text('transition.journey.dev'), hybrid: text('transition.journey.hybrid'), ba: text('transition.journey.ba') }
  },
  strengths: Object.fromEntries(
    Object.keys(en.strengths.items).map(k => [
      k,
      {
        title: text(`strengths.items.${k}.title`),
        proof: text(`strengths.items.${k}.proof`),
        // BaStrengthsSection.vue `kit`
        ...(k === 'deliverables' ? { kit: ['wbs', 'srs', 'useCase', 'wireframe', 'mockup', 'proposal'] } : {})
      }
    ])
  ),
  contact: { subtitle: text('contact.subtitle'), identity: text('contact.identity') }
}

// ---------------------------------------------------------------------------
// YAML formatting: short lists / short { en, vi } pairs on one line, long texts folded.
const yamlBlock = (value: unknown): string => {
  const doc = new Document(value)
  visit(doc, {
    Seq(_, node) {
      const total = node.items.reduce((n, i) => n + (isScalar(i) ? String(i.value).length + 2 : 999), 0)
      if (total < 80) node.flow = true
    },
    Map(_, node) {
      const keys = node.items.map(p => (isScalar(p.key) ? p.key.value : ''))
      const scalars = node.items.every(p => isScalar(p.value))
      const len = node.items.reduce((n, p) => n + String(isScalar(p.value) ? p.value.value : '').length, 0)
      if (scalars && len < 70 && (keys.join() === 'en,vi' || keys.length <= 4) && !node.items.some(p => isMap(p.value) || isSeq(p.value))) {
        node.flow = true
      }
    },
    Scalar(_, node) {
      if (typeof node.value === 'string' && node.value.length > 90) node.type = Scalar.BLOCK_FOLDED
    }
  })
  return '```yaml\n' + doc.toString({ lineWidth: 100, minContentWidth: 40 }).trimEnd() + '\n```'
}

const out: string[] = []
out.push(`---
schemaVersion: 1
locales: [en, vi]
---

# CV Database — Lê Quang Tú

> **Nguồn dữ liệu duy nhất của website.** Web đọc file này lúc build (\`cv-pipeline\`).
>
> - Quy tắc chuyển đổi từ CV thực tế (\`cv_raw/cv_summary.md\`) → file này: [cv_transform_rules.md](./cv_transform_rules.md)
> - Cấu trúc từng trường: [CV_TEMPLATE.md](./CV_TEMPLATE.md)
> - Mỗi \`## Section\` / \`### key\` chứa đúng **1 khối yaml**. Chữ ngoài khối yaml (như dòng này) là ghi chú, web bỏ qua.
> - Text song ngữ: \`{ en: ..., vi: ... }\`; viết 1 chuỗi duy nhất nếu 2 ngôn ngữ giống nhau.
> - Kiểm tra trước khi push: \`npm run cv:check\`
`)

const section = (title: string, note: string, value: unknown): void => {
  out.push(`## ${title}\n\n${note}\n\n${yamlBlock(value)}\n`)
}

section('Profile', 'Thông tin cá nhân hiển thị trên UI. `careerStart` / `baStart` dùng để tự tính số năm kinh nghiệm (R-YEARS).', profile)
section('Education', 'Học vấn (R-FORMAT).', education)
section('Companies', 'Nơi làm việc, theo thứ tự thời gian. Bỏ `end` = hiện tại (R-DATE, R-COMPROLE).', companies)
section('Customers', 'Khách hàng cuối của dự án. `keyClient: true` = khách hàng lớn của công ty (có filter riêng). `label` = tên hiển thị khi khác `name` (R-CUST).', customers)
section('Dictionaries', 'Danh mục dùng chung. Thêm domain / role / deliverable mới tại đây — không cần sửa code.\n`color` (domain): ai | logistics | iot | warehouse | adtech | supplychain | crm | hrtech · `style` (role): purple | gradient | green | blue', dictionaries)
section('Skills', 'Kỹ năng (R-SKILL) và 4 node của Skill Galaxy (`frontend`, `backend`, `database`, `analysis` — cố định theo layout).', skills)
section('Achievements', 'Thành tựu (R-ACH). `milestone` = mốc timeline hiển thị thành tựu; `project` = dự án được trao giải (tùy chọn).', achievements)

out.push('## Projects\n\nMỗi dự án là 1 `### <slug>` (slug không bao giờ đổi — R-ID). Thứ tự trong file = thứ tự hiển thị.\n')
for (const p of projects) out.push(`### ${p.slug}\n\n${yamlBlock(p.data)}\n`)

out.push('## Timeline\n\nCác mốc của 2 hành trình (R-MILESTONE). Thành tựu tự gắn vào mốc qua `Achievements › milestone`.\n')
out.push(`### builder\n\n${yamlBlock(milestones(resumeData.builderTimeline))}\n`)
out.push(`### analyst\n\n${yamlBlock(milestones(resumeData.analystTimeline))}\n`)

section(
  'Narrative',
  'Các đoạn văn giới thiệu bản thân (R-NARRATIVE). Placeholder do web tự điền: `{n}` = số năm / số lượng, `{start}`, `{domains}`, `{award}`, `{project}`.',
  narrative
)

mkdirSync('content', { recursive: true })
writeFileSync('content/cv.md', out.join('\n'))
console.log('content/cv.md written')
