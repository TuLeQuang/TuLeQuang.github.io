<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { resumeData } from '@/data/resume'
import { useFocus, type HoverTarget } from '@/composables/useFocus'
import { accentStyles } from '@/utils/styleMaps'
import type { SkillCategory } from '@/types'

/**
 * Reactive SVG line layer. Node centres are measured from the real flex layout
 * (elements carrying `data-galaxy-node`), so lines stay attached on every breakpoint.
 */
const props = defineProps<{ container: HTMLElement | null }>()

type NodeId = SkillCategory | 'hub'
type Point = { x: number; y: number }
interface Line { id: string; from: NodeId; to: NodeId; stroke: string; opacity: number; title?: string }

const { t } = useI18n()
const { focus, hovered } = useFocus()
const points = ref<Partial<Record<NodeId, Point>>>({})
const size = ref({ w: 0, h: 0 })

const measure = (): void => {
  const root = props.container
  if (!root) return
  const box = root.getBoundingClientRect()
  const next: Partial<Record<NodeId, Point>> = {}
  root.querySelectorAll<HTMLElement>('[data-galaxy-node]').forEach(el => {
    const r = el.getBoundingClientRect()
    next[el.dataset.galaxyNode as NodeId] = { x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2 }
  })
  size.value = { w: box.width, h: box.height }
  points.value = next
}

let observer: ResizeObserver | null = null
watch(
  () => props.container,
  el => {
    observer?.disconnect()
    if (!el) return
    observer = new ResizeObserver(measure)
    observer.observe(el)
    measure()
  },
  { immediate: true }
)
onBeforeUnmount(() => observer?.disconnect())

const lines = computed<Line[]>(() => [
  // Hub spokes (coloured by node accent, as in code.html)
  ...resumeData.skillClusters.map(c => ({
    id: `hub-${c.id}`, from: 'hub' as const, to: c.id, stroke: accentStyles[c.accent].stroke, opacity: 0.5
  })),
  // Node ↔ node ties with tooltip
  ...resumeData.galaxyConnections.map(c => ({
    id: c.id, from: c.from, to: c.to, stroke: 'var(--color-outline)', opacity: 0.3, title: t(`galaxy.connections.${c.id}`)
  }))
])

const focusedSkill = computed<HoverTarget>(() => (focus.value?.kind === 'skill' ? (focus.value.value as SkillCategory) : null))

const isActive = (line: Line): boolean => {
  if (hovered.value === 'hub') return true
  return [hovered.value, focusedSkill.value].some(n => n !== null && (n === line.from || n === line.to))
}

/** Hub hover → lines light up one after another, from the centre outwards. */
const lineStyle = (line: Line, index: number) => {
  const active = isActive(line)
  return {
    stroke: active ? 'rgba(96, 165, 250, 0.8)' : line.stroke,
    strokeOpacity: active ? 1 : line.opacity,
    strokeWidth: active ? 2.5 : 1.5,
    filter: active ? 'drop-shadow(0 0 6px rgba(96, 165, 250, 0.5))' : 'none',
    transitionDelay: hovered.value === 'hub' ? `${index * 90}ms` : '0ms'
  }
}

const visible = computed(() =>
  lines.value.flatMap(line => {
    const a = points.value[line.from]
    const b = points.value[line.to]
    return a && b ? [{ line, a, b }] : []
  })
)
</script>

<template>
  <svg
    class="absolute inset-0 w-full h-full z-10 pointer-events-none"
    :viewBox="`0 0 ${size.w} ${size.h}`"
    fill="none"
  >
    <g v-for="({ line, a, b }, index) in visible" :key="line.id">
      <line
        :x1="a.x" :y1="a.y" :x2="b.x" :y2="b.y"
        stroke-dasharray="3 3"
        class="transition-all duration-300"
        :class="{ 'animate-dash-flow': isActive(line) }"
        :style="lineStyle(line, index)"
      />
      <!-- wider invisible hit area so the tooltip is reachable -->
      <line
        v-if="line.title"
        :x1="a.x" :y1="a.y" :x2="b.x" :y2="b.y"
        stroke="transparent"
        stroke-width="12"
        class="pointer-events-auto"
      >
        <title>{{ line.title }}</title>
      </line>
    </g>
  </svg>
</template>
