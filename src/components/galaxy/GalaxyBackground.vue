<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useBreakpoint } from '@/composables/useBreakpoint'
import { STAR_COUNT, createStars, drawStar, stepStar, type StarField } from '@/utils/starfield'

const { isMobile } = useBreakpoint()

const canvasRef = ref<HTMLCanvasElement | null>(null)
let animId = 0
let running = false
let onScreen = true
let mouseX = -9999
let mouseY = -9999
let width = 0
let height = 0

// Mobile (Q-M6): a tap lights nearby stars, then the glow fades out — no displacement.
const TOUCH_GLOW_MS = 900
let touchX = -9999
let touchY = -9999
let touchAt = -Infinity

// Always create dense starfield (360 stars) so desktop always has all stars even after resize
const stars = createStars(STAR_COUNT.desktop)

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

  // Active count: lighter on mobile viewport to save battery
  const activeCount = isMobile.value ? STAR_COUNT.mobile : STAR_COUNT.desktop
  const now = performance.now()
  const touchAge = now - touchAt

  let field: StarField
  if (mouseX !== -9999 && mouseY !== -9999) {
    // Desktop mouse hover: strong, visible gravitational attraction + glow
    field = {
      x: mouseX,
      y: mouseY,
      radius: 280,
      maxPull: 48,
      strength: 1
    }
  } else if (touchAge < TOUCH_GLOW_MS) {
    // Mobile tap glow
    field = {
      x: touchX,
      y: touchY,
      radius: 160,
      maxPull: 0,
      strength: Math.max(0, 1 - touchAge / TOUCH_GLOW_MS)
    }
  } else {
    // Idle background: subtle natural twinkle, no pointer influence
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

/** Run the loop only while the section is on screen and the tab is visible. */
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

onMounted(() => {
  // Listen on window so mouse movements are never missed
  window.addEventListener('mousemove', onPointerMove, { passive: true })
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  document.addEventListener('mouseleave', onPointerLeave)

  const section = canvasRef.value?.closest('section') || document.getElementById('all-about-me')
  section?.addEventListener('pointerdown', onTouch, { passive: true })

  observer = new ResizeObserver(resize)
  if (canvasRef.value) observer.observe(canvasRef.value)
  resize()

  // Track visibility using section element with generous margin
  const target = section || canvasRef.value
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
  const section = canvasRef.value?.closest('section') || document.getElementById('all-about-me')
  section?.removeEventListener('pointerdown', onTouch)
})
</script>

<template>
  <!-- Ambient space glows (smaller + lighter blur on mobile to save GPU) -->
  <div class="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
    <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] blur-[70px] md:w-[720px] md:h-[720px] rounded-full bg-primary-container/15 md:blur-[120px]" />
    <div class="absolute bottom-1/4 right-1/4 w-[240px] h-[240px] blur-[70px] md:w-[480px] md:h-[480px] rounded-full bg-secondary-container/20 md:blur-[140px]" />
    <div class="hidden md:block absolute top-1/3 left-1/5 w-[360px] h-[360px] rounded-full bg-domain-iot/10 blur-[100px]" />
  </div>

  <!-- Decorative orbital track rings (desktop orbital layout only) -->
  <div class="absolute inset-0 hidden md:flex items-center justify-center pointer-events-none z-0" aria-hidden="true">
    <svg class="w-full max-w-[1300px] h-[950px] max-h-full opacity-25" fill="none" viewBox="0 0 1200 900">
      <circle class="text-primary/40" cx="600" cy="450" r="230" stroke="currentColor" stroke-dasharray="6 8" stroke-width="1.5" />
      <ellipse class="text-secondary/30" cx="600" cy="450" rx="460" ry="380" stroke="currentColor" stroke-dasharray="4 6" stroke-width="1.2" />
      <line class="text-outline/30" stroke="currentColor" stroke-width="1" x1="600" x2="940" y1="220" y2="180" />
      <line class="text-outline/30" stroke="currentColor" stroke-width="1" x1="840" x2="1010" y1="450" y2="450" />
      <line class="text-outline/30" stroke="currentColor" stroke-width="1" x1="600" x2="920" y1="680" y2="720" />
    </svg>
  </div>

  <!-- Interactive dynamic starfield canvas with gravitational pull (Req 1.1 & Req 2) -->
  <canvas ref="canvasRef" class="absolute inset-0 w-full h-full pointer-events-none z-[1]" aria-hidden="true" />
</template>
