<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFocus, type HoverTarget } from '@/composables/useFocus'
import { buildGalaxyPaths, type BoxRect, type NodeId, type RenderPath } from '@/utils/galaxyPaths'
import type { SkillCategory } from '@/types'

const props = defineProps<{ container: HTMLElement | null }>()

const { t } = useI18n()
const { focus, hovered } = useFocus()
const boxes = ref<Partial<Record<NodeId, BoxRect>>>({})
const size = ref({ w: 0, h: 0 })

const measure = (): void => {
  const root = props.container
  if (!root) return
  const rootRect = root.getBoundingClientRect()
  const next: Partial<Record<NodeId, BoxRect>> = {}
  root.querySelectorAll<HTMLElement>('[data-galaxy-node]').forEach(el => {
    const r = el.getBoundingClientRect()
    const left = r.left - rootRect.left, top = r.top - rootRect.top
    next[el.dataset.galaxyNode as NodeId] = {
      left, top, width: r.width, height: r.height,
      right: left + r.width, bottom: top + r.height,
      centerX: left + r.width / 2, centerY: top + r.height / 2
    }
  })
  size.value = { w: rootRect.width, h: rootRect.height }
  boxes.value = next
}

let observer: ResizeObserver | null = null
watch(() => props.container, el => {
  observer?.disconnect()
  if (!el) return
  observer = new ResizeObserver(measure)
  observer.observe(el)
  measure()
}, { immediate: true })
onBeforeUnmount(() => observer?.disconnect())

const isDesktop = computed(() => {
  const fe = boxes.value.frontend
  const hub = boxes.value.hub
  return !!(fe && hub && fe.centerX < hub.centerX - 100)
})

const activeTarget = computed<HoverTarget>(() => {
  if (hovered.value) return hovered.value
  if (focus.value?.kind === 'skill') return focus.value.value as SkillCategory
  return null
})

const isActive = (item: RenderPath): boolean => {
  const target = activeTarget.value
  if (!target) return false
  if (target === 'hub') return item.isHubSpoke
  if (target === 'frontend' || target === 'backend') {
    return item.id === 'hub-frontend' || item.id === 'hub-backend' || item.from === target || item.to === target
  }
  if (target === 'analysis' || target === 'database') {
    return item.id === 'hub-analysis' || item.id === 'hub-database' || item.from === target || item.to === target
  }
  return item.from === target || item.to === target
}

const paths = computed<RenderPath[]>(() => buildGalaxyPaths(boxes.value, isDesktop.value, t))
</script>

<template>
  <svg
    class="absolute inset-0 w-full h-full z-10 pointer-events-none"
    :viewBox="`0 0 ${size.w} ${size.h}`"
    fill="none"
  >
    <defs>
      <!-- Hào quang phát sáng: userSpaceOnUse toàn màn hình -->
      <filter id="galaxy-glow" filterUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
        <feGaussianBlur stdDeviation="3.5" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <g v-for="(item, index) in paths" :key="item.id">
      <!-- 1. Hào quang nền khi active / hover -->
      <path
        v-if="isActive(item)"
        :d="item.d"
        :stroke="item.glowColor"
        :stroke-width="item.isHubSpoke ? 9 : 8"
        opacity="0.55"
        stroke-linecap="round"
        filter="url(#galaxy-glow)"
      />

      <!-- 2. Hào quang mềm mặc định (tạo độ dày và sáng vừa vặn) -->
      <path
        v-if="!activeTarget"
        :d="item.d"
        :stroke="item.glowColor"
        :stroke-width="item.isHubSpoke ? 6.5 : 5.5"
        opacity="0.22"
        stroke-linecap="round"
        class="pointer-events-none"
      />

      <!-- 3. Đường ray cơ sở (Dày 2.2px, sáng 0.42 mặc định) -->
      <path
        :d="item.d"
        :stroke="isActive(item) ? item.glowColor : item.color"
        :stroke-width="isActive(item) ? 3.2 : 2.2"
        stroke-dasharray="4 5"
        :opacity="isActive(item) ? 0.95 : (activeTarget ? 0.08 : 0.42)"
        class="transition-all duration-300"
      />

      <!-- 4. Xung photon TỪ Thông tin cá nhân đi ra (Dày 3.4px, sáng 0.62 mặc định) -->
      <path
        :d="item.d"
        :stroke="isActive(item) ? '#ffffff' : item.glowColor"
        :stroke-width="isActive(item) ? 5.2 : (item.isHubSpoke ? 3.4 : 2.8)"
        stroke-linecap="round"
        :stroke-dasharray="item.isHubSpoke ? '9 15' : '12 24'"
        class="pointer-events-none transition-all duration-300"
        :class="item.isHubSpoke ? (isActive(item) ? 'spoke-fast' : 'spoke-out') : (index % 2 === 0 ? 'tie-out' : 'tie-out-alt')"
        :filter="isActive(item) ? 'url(#galaxy-glow)' : 'none'"
        :opacity="isActive(item) ? 1.0 : (activeTarget ? 0.08 : 0.62)"
      />

      <!-- 5. Xung photon TỪ Kỹ năng truyền về Thông tin cá nhân (Dày 2.4px, sáng 0.48 mặc định) -->
      <path
        v-if="item.isHubSpoke"
        :d="item.d"
        stroke="#ffffff"
        :stroke-width="isActive(item) ? 4.0 : 2.4"
        stroke-linecap="round"
        stroke-dasharray="6 18"
        class="pointer-events-none transition-all duration-300"
        :class="isActive(item) ? 'spoke-in-fast' : 'spoke-in'"
        :filter="isActive(item) ? 'url(#galaxy-glow)' : 'none'"
        :opacity="isActive(item) ? 0.95 : (activeTarget ? 0.06 : 0.48)"
      />

      <!-- 6. Điểm neo phát sáng ở 2 đầu liên kết (Bán kính 3.0px mặc định) -->
      <circle
        v-if="item.startX !== undefined && item.startY !== undefined"
        :cx="item.startX"
        :cy="item.startY"
        :r="isActive(item) ? 4.8 : 3.0"
        :fill="isActive(item) ? '#ffffff' : item.glowColor"
        :opacity="isActive(item) ? 1.0 : (activeTarget ? 0.1 : 0.6)"
        :filter="isActive(item) ? 'url(#galaxy-glow)' : 'none'"
        class="transition-all duration-300"
      />
      <circle
        v-if="item.endX !== undefined && item.endY !== undefined"
        :cx="item.endX"
        :cy="item.endY"
        :r="isActive(item) ? 4.8 : 3.0"
        :fill="isActive(item) ? '#ffffff' : item.glowColor"
        :opacity="isActive(item) ? 1.0 : (activeTarget ? 0.1 : 0.6)"
        :filter="isActive(item) ? 'url(#galaxy-glow)' : 'none'"
        class="transition-all duration-300"
      />

      <!-- 7. Hit area cho tương tác và tooltip -->
      <path
        v-if="item.title"
        :d="item.d"
        stroke="transparent"
        stroke-width="24"
        class="pointer-events-auto cursor-pointer"
      >
        <title>{{ item.title }}</title>
      </path>
    </g>
  </svg>
</template>

<style scoped>
@keyframes spoke-flow-out { 0% { stroke-dashoffset: 24; } 100% { stroke-dashoffset: 0; } }
@keyframes spoke-flow-in { 0% { stroke-dashoffset: 0; } 100% { stroke-dashoffset: 24; } }
@keyframes tie-flow-out { 0% { stroke-dashoffset: 36; } 100% { stroke-dashoffset: 0; } }
.spoke-out { animation: spoke-flow-out 1.4s linear infinite; }
.spoke-fast { animation: spoke-flow-out 0.7s linear infinite; }
.spoke-in { animation: spoke-flow-in 2.0s linear infinite; }
.spoke-in-fast { animation: spoke-flow-in 0.9s linear infinite; }
.tie-out { animation: tie-flow-out 2.4s linear infinite; }
.tie-out-alt { animation: tie-flow-out 3.2s linear infinite; }
</style>
