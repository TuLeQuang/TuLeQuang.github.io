/**
 * Golden render test (Phase 0 safety net).
 *
 * Mounts the whole App for desktop / mobile × en / vi and records the rendered HTML,
 * every expanded project drawer, every ProjectSheet and every focus state.
 * The recorded files in __baseline__/ were produced BEFORE the CV-as-data refactor, so any
 * text / DOM drift introduced by the refactor (or by a later CV edit) shows up as a diff.
 *
 * Update intentionally changed output with: npx vitest run -u
 */
import { describe, expect, it, vi, afterEach } from 'vitest'
import { nextTick } from 'vue'

type Viewport = 'desktop' | 'mobile'
type Locale = 'en' | 'vi'

const FIXED_NOW = new Date('2026-10-06T09:00:00+07:00')

/** Deterministic Math.random so starfields / canvases never introduce noise. */
const seedRandom = (): void => {
  let seed = 42
  vi.spyOn(Math, 'random').mockImplementation(() => {
    seed = (seed * 16807) % 2147483647
    return (seed - 1) / 2147483646
  })
}

const stubBrowser = (viewport: Viewport): void => {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: query.includes('max-width: 767px') ? viewport === 'mobile' : false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    onchange: null,
    dispatchEvent: () => false
  }))
  class NoopObserver {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
    takeRecords(): [] { return [] }
  }
  vi.stubGlobal('IntersectionObserver', NoopObserver)
  vi.stubGlobal('ResizeObserver', NoopObserver)
  vi.stubGlobal('requestAnimationFrame', () => 0)
  vi.stubGlobal('cancelAnimationFrame', () => {})
  Element.prototype.scrollIntoView = () => {}
  Element.prototype.scrollTo = () => {}
  window.scrollTo = () => {}
  HTMLCanvasElement.prototype.getContext = (() => null) as typeof HTMLCanvasElement.prototype.getContext
}

/** Collapse whitespace between tags so formatting-only changes are ignored. */
const normalize = (html: string): string =>
  html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/>\s+</g, '>\n<')
    .replace(/[ \t]+/g, ' ')
    .trim()

const flush = async (): Promise<void> => {
  await nextTick()
  await nextTick()
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  vi.useRealTimers()
  document.body.innerHTML = ''
})

const scenarios: Array<[Viewport, Locale]> = [
  ['desktop', 'en'],
  ['desktop', 'vi'],
  ['mobile', 'en'],
  ['mobile', 'vi']
]

describe('golden render', () => {
  it('resumeData (language-neutral data)', async () => {
    vi.resetModules()
    const { resumeData } = await import('@/data/resume')
    const canonical = (value: unknown): unknown =>
      Array.isArray(value)
        ? value.map(canonical)
        : value && typeof value === 'object'
          ? Object.fromEntries(Object.keys(value).sort().map(k => [k, canonical((value as Record<string, unknown>)[k])]))
          : value
    await expect(JSON.stringify(canonical(resumeData), null, 2)).toMatchFileSnapshot('./__baseline__/resumeData.json')
  })

  it.each(scenarios)('%s / %s', async (viewport, locale) => {
    vi.useFakeTimers({ now: FIXED_NOW, toFake: ['Date'] })
    seedRandom()
    stubBrowser(viewport)
    localStorage.setItem('locale', locale)
    vi.resetModules()

    const { mount } = await import('@vue/test-utils')
    const { default: App } = await import('@/App.vue')
    const { i18n } = await import('@/i18n')
    const { reveal } = await import('@/composables/useReveal')
    const { applyLocaleSideEffects } = await import('@/composables/useLocale')
    const { useFocus } = await import('@/composables/useFocus')
    const { useProjectSheet } = await import('@/composables/useProjectSheet')
    const { resumeData } = await import('@/data/resume')

    const host = document.createElement('div')
    document.body.appendChild(host)
    const wrapper = mount(App, {
      attachTo: host,
      global: { plugins: [i18n], directives: { reveal } }
    })
    applyLocaleSideEffects(i18n.global.locale.value)
    await flush()

    const parts: string[] = []
    const record = (title: string, html: string): void => {
      parts.push(`\n===== ${title} =====\n${normalize(html)}`)
    }

    record('document.title / lang', `${document.title} | ${document.documentElement.lang}`)
    record('initial', document.body.innerHTML)

    // Expand every inline project drawer (desktop bento cards)
    const toggles = Array.from(document.querySelectorAll<HTMLButtonElement>('button[aria-controls^="drawer-"]'))
    for (const button of toggles) button.click()
    await flush()
    if (toggles.length) record('drawers expanded', document.querySelector('main')?.innerHTML ?? '')

    // Every ProjectSheet (bottom sheet)
    const { openProject, closeProject } = useProjectSheet()
    for (const project of resumeData.projects) {
      for (const track of project.tracks) {
        openProject(project.slug, track)
        await flush()
        record(`sheet ${project.slug} (${track})`, document.querySelector('[role="dialog"]')?.outerHTML ?? '<none>')
        closeProject()
        await flush()
      }
    }

    // Every focus state: header breadcrumb, focus chip, floating actions, highlighted cards
    const focus = useFocus()
    const states: Array<[string, () => void]> = [
      ...(['frontend', 'backend', 'database', 'analysis'] as const).map(
        c => [`skill ${c}`, () => focus.focusSkill(c, 'none')] as [string, () => void]
      ),
      ...resumeData.companies.map(
        c => [`company ${c.name}`, () => focus.focusCompany(c.name, 'none')] as [string, () => void]
      ),
      ...resumeData.customers.map(c => [`customer ${c.id}`, () => focus.focusCustomer(c.id, 'none')] as [string, () => void]),
      ...[...new Set(resumeData.projects.map(p => p.domain))].map(
        d => [`domain ${d}`, () => focus.focusDomain(d, 'none')] as [string, () => void]
      ),
      ...resumeData.achievements.map(a => [`achievement ${a.id}`, () => focus.focusAchievement(a.id)] as [string, () => void])
    ]
    for (const [title, apply] of states) {
      focus.clear()
      await flush()
      apply()
      await flush()
      const header = document.querySelector('header')?.outerHTML ?? ''
      const highlighted = Array.from(document.querySelectorAll('[id^="builder-"], [id^="analyst-"]'))
        .map(el => `${el.id}:${el.className.includes('ring') ? 'ring' : ''}`)
        .join('\n')
      const text = (document.body.textContent ?? '').replace(/\s+/g, ' ')
      record(`focus ${title}`, `${header}\n${highlighted}\nTEXT: ${text}`)
    }
    focus.clear()

    wrapper.unmount()
    await expect(parts.join('\n')).toMatchFileSnapshot(`./__baseline__/render.${viewport}.${locale}.html`)
  })
})
