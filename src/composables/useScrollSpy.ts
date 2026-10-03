import { onBeforeUnmount, onMounted, ref } from 'vue'
import { SECTION_IDS, type SectionId } from '@/utils/sections'

/** Fixed header (h-20) + a small tolerance: a section is active once its top passes this line. */
const PROBE_OFFSET = 80 + 40

const active = ref<SectionId>('skill-galaxy')
let frame = 0
let users = 0

/**
 * Position-based (not IntersectionObserver): the active section is the last one whose top has
 * crossed the probe line. Deterministic, so a section that merely touches the header edge after
 * an anchor jump (scroll-margin-top) can no longer steal the active state.
 */
const update = (): void => {
  frame = 0
  const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
  if (atBottom) {
    active.value = SECTION_IDS[SECTION_IDS.length - 1]
    return
  }
  let current: SectionId = SECTION_IDS[0]
  for (const id of SECTION_IDS) {
    const el = document.getElementById(id)
    if (el && el.getBoundingClientRect().top <= PROBE_OFFSET) current = id
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
