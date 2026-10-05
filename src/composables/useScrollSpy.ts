import { onBeforeUnmount, onMounted, ref } from 'vue'
import { SECTION_IDS, type SectionId } from '@/utils/sections'

/** Fixed header (h-20) + a small tolerance: a section is active once its top passes this line. */
const PROBE_OFFSET = 80 + 40

const active = ref<SectionId>('all-about-me')
let frame = 0
let users = 0

/**
 * Position-based (not IntersectionObserver): the active section is the one whose top crossed the
 * probe line most recently (largest top ≤ probe). Independent of DOM order, so it still works when
 * mobile reorders sections (Analyst before Builder). A section that merely touches the header edge
 * after an anchor jump (scroll-margin-top) can no longer steal the active state.
 */
const update = (): void => {
  frame = 0
  const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
  if (atBottom) {
    // Last section on screen (by position, not array order)
    const offset = (id: SectionId): number => document.getElementById(id)?.offsetTop ?? 0
    active.value = [...SECTION_IDS].sort((a, b) => offset(b) - offset(a))[0] ?? SECTION_IDS[0]
    return
  }
  let current: SectionId = SECTION_IDS[0]
  let best = -Infinity
  for (const id of SECTION_IDS) {
    const top = document.getElementById(id)?.getBoundingClientRect().top
    if (top !== undefined && top <= PROBE_OFFSET && top > best) {
      best = top
      current = id
    }
  }
  active.value = current
}

const schedule = (): void => {
  if (!frame) frame = requestAnimationFrame(update)
}

/** Tracks which section is currently in view (drives the active header link). */
export function useScrollSpy() {
  onMounted(() => {
    users++
    if (users > 1) return
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })
    update()
  })

  onBeforeUnmount(() => {
    users--
    if (users > 0) return
    window.removeEventListener('scroll', schedule)
    window.removeEventListener('resize', schedule)
    if (frame) cancelAnimationFrame(frame)
    frame = 0
  })

  return { active }
}
