<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useBreakpoint } from '@/composables/useBreakpoint'
import { createStars, drawStar, stepStar, type StarField } from '@/utils/starfield'

interface Props {
  starCount?: { desktop: number; mobile: number }
  glows?: boolean
  maskClass?: string
  maxPull?: number
  radius?: number
}

const props = withDefaults(defineProps<Props>(), {
  starCount: () => ({ desktop: 200, mobile: 70 }),
  glows: true,
  maskClass: '',
  maxPull: 44,
  radius: 260
})

const { isMobile } = useBreakpoint()

const canvasRef = ref<HTMLCanvasElement | null>(null)
let animId = 0
let running = false
let onScreen = true
let mouseX = -9999
let mouseY = -9999
let width = 0
let height = 0

const TOUCH_GLOW_MS = 900
let touchX = -9999
let touchY = -9999
let touchAt = -Infinity

const stars = createStars(props.starCount.desktop)
let isInitialized = false

const updatePointer = (clientX: number, clientY: number): void => {
  const canvas = canvasRef.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  const margin = 80
  if (
    clientX >= rect.left - margin &&
    clientX <= rect.right + margin &&
    clientY >= rect.top - margin &&
    clientY <= rect.bottom + margin
  ) {
    mouseX = clientX - rect.left
    mouseY = clientY - rect.top
  } else {
    mouseX = -9999
    mouseY = -9999
  }
}

const onPointerMove = (e: MouseEvent | PointerEvent): void => {
  updatePointer(e.clientX, e.clientY)
}

const onPointerLeave = (): void => {
  mouseX = -9999
  mouseY = -9999
}

const onTouch = (e: PointerEvent): void => {
  const canvas = canvasRef.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  touchX = e.clientX - rect.left
  touchY = e.clientY - rect.top
  touchAt = performance.now()
}

const resize = (): void => {
  const canvas = canvasRef.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  width = rect.width
  height = rect.height
  if (width === 0 || height === 0) return

  canvas.width = Math.floor(width * dpr)
  canvas.height = Math.floor(height * dpr)
  const ctx = canvas.getContext('2d')
  ctx?.scale(dpr, dpr)

  if (!isInitialized) {
    for (const star of stars) {
      star.currentX = star.originX * width
      star.currentY = star.originY * height
    }
    isInitialized = true
  }
}

const render = (): void => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx || width === 0 || height === 0) {
    animId = requestAnimationFrame(render)
    return
  }

  ctx.clearRect(0, 0, width, height)

  const activeCount = isMobile.value ? props.starCount.mobile : props.starCount.desktop
  const now = performance.now()
  const touchAge = now - touchAt

  let field: StarField
  if (mouseX !== -9999 && mouseY !== -9999) {
    field = {
      x: mouseX,
      y: mouseY,
      radius: props.radius,
      maxPull: props.maxPull,
      strength: 1
    }
  } else if (touchAge < TOUCH_GLOW_MS) {
    field = {
      x: touchX,
      y: touchY,
      radius: 150,
      maxPull: 0,
      strength: Math.max(0, 1 - touchAge / TOUCH_GLOW_MS)
    }
  } else {
    field = {
      x: -9999,
      y: -9999,
      radius: 0,
      maxPull: 0,
      strength: 0
    }
  }

  for (let i = 0; i < activeCount; i++) {
    const star = stars[i]
    if (!star) continue
    const proximity = stepStar(star, width, height, field)
    drawStar(ctx, star, proximity > 0.35)
  }

  animId = requestAnimationFrame(render)
}

const syncLoop = (): void => {
  const shouldRun = onScreen && !document.hidden
  if (shouldRun && !running) {
    running = true
    animId = requestAnimationFrame(render)
  } else if (!shouldRun && running) {
    running = false
    cancelAnimationFrame(animId)
  }
}

let observer: ResizeObserver | null = null
let visibility: IntersectionObserver | null = null
let parentEl: HTMLElement | null = null

onMounted(() => {
  window.addEventListener('mousemove', onPointerMove, { passive: true })
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  document.addEventListener('mouseleave', onPointerLeave)

  parentEl = canvasRef.value?.closest('section, footer') || canvasRef.value?.parentElement || null
  parentEl?.addEventListener('pointerdown', onTouch, { passive: true })

  observer = new ResizeObserver(resize)
  if (canvasRef.value) observer.observe(canvasRef.value)
  resize()

  const target = parentEl || canvasRef.value
  if (target) {
    visibility = new IntersectionObserver(([entry]) => {
      onScreen = entry?.isIntersecting ?? true
      syncLoop()
    }, { rootMargin: '100px' })
    visibility.observe(target)
  }

  document.addEventListener('visibilitychange', syncLoop)
  syncLoop()
})

onBeforeUnmount(() => {
  running = false
  cancelAnimationFrame(animId)
  observer?.disconnect()
  visibility?.disconnect()
  document.removeEventListener('visibilitychange', syncLoop)
  window.removeEventListener('mousemove', onPointerMove)
  window.removeEventListener('pointermove', onPointerMove)
  document.removeEventListener('mouseleave', onPointerLeave)
  parentEl?.removeEventListener('pointerdown', onTouch)
})
</script>

<template>
  <div :class="maskClass" class="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
    <!-- Ambient space glows -->
    <div v-if="glows" class="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      <div class="absolute top-0 right-1/4 -translate-y-1/2 w-[350px] h-[350px] md:w-[600px] md:h-[600px] rounded-full bg-primary-container/15 blur-[90px] md:blur-[130px]" />
      <div class="absolute bottom-0 left-1/4 translate-y-1/3 w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full bg-secondary-container/20 blur-[80px] md:blur-[120px]" />
      <slot name="glows" />
    </div>

    <!-- Interactive dynamic starfield canvas -->
    <canvas ref="canvasRef" class="absolute inset-0 w-full h-full pointer-events-none z-[1]" aria-hidden="true" />
  </div>
</template>

<style scoped>
.fade-top-mask {
  mask-image: linear-gradient(to bottom, transparent 0%, transparent 15%, black 45%, black 100%);
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, transparent 15%, black 45%, black 100%);
}
</style>
