<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

interface Star {
  originX: number
  originY: number
  currentX: number
  currentY: number
  radius: number
  currentR: number
  baseAlpha: number
  currentAlpha: number
  color: string
  twinklePhase: number
  twinkleSpeed: number
}

const canvasRef = ref<HTMLCanvasElement | null>(null)
let animId = 0
let mouseX = -9999
let mouseY = -9999
let width = 0
let height = 0

const STAR_COLORS = ['#ffffff', '#ffffff', '#b4c5ff', '#a5f3fc', '#fef08a', '#e9d5ff']

const stars: Star[] = Array.from({ length: 360 }, () => {
  const tier = Math.random()
  const r = tier < 0.72 ? Math.random() * 0.5 + 0.5 : tier < 0.92 ? Math.random() * 0.6 + 1.1 : Math.random() * 0.7 + 1.8
  const base = tier < 0.72 ? Math.random() * 0.2 + 0.12 : tier < 0.92 ? Math.random() * 0.22 + 0.28 : Math.random() * 0.3 + 0.48
  return {
    originX: Math.random(),
    originY: Math.random(),
    currentX: 0,
    currentY: 0,
    radius: r,
    currentR: r,
    baseAlpha: base,
    currentAlpha: base,
    color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)] ?? '#ffffff',
    twinklePhase: Math.random() * Math.PI * 2,
    twinkleSpeed: Math.random() * 0.02 + 0.01
  }
})

let isInitialized = false

const onPointerMove = (e: MouseEvent): void => {
  const canvas = canvasRef.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  mouseX = e.clientX - rect.left
  mouseY = e.clientY - rect.top
}

const onPointerLeave = (): void => {
  mouseX = -9999
  mouseY = -9999
}

const resize = (): void => {
  const canvas = canvasRef.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  width = rect.width
  height = rect.height
  canvas.width = Math.floor(width * dpr)
  canvas.height = Math.floor(height * dpr)
  const ctx = canvas.getContext('2d')
  ctx?.scale(dpr, dpr)

  if (!isInitialized && width > 0 && height > 0) {
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
  if (!ctx || width === 0 || height === 0) return

  ctx.clearRect(0, 0, width, height)

  const R = 220
  const maxDisplacement = 22

  for (const star of stars) {
    star.twinklePhase += star.twinkleSpeed
    const basePixelX = star.originX * width
    const basePixelY = star.originY * height
    const dx = mouseX - basePixelX
    const dy = mouseY - basePixelY
    const dist = Math.hypot(dx, dy)

    let targetX = basePixelX
    let targetY = basePixelY
    let targetAlpha = star.baseAlpha + Math.sin(star.twinklePhase) * 0.08
    let targetR = star.radius
    let proximity = 0

    if (dist < R) {
      proximity = 1 - dist / R
      // Hút nhẹ về phía chuột (di chuyển tối đa ~22px)
      const pull = Math.pow(proximity, 1.2) * maxDisplacement
      const angle = Math.atan2(dy, dx)
      targetX = basePixelX + Math.cos(angle) * pull
      targetY = basePixelY + Math.sin(angle) * pull

      // Sáng bừng lên khi chuột ở gần
      targetAlpha = Math.min(1.0, star.baseAlpha + proximity * 0.72)
      targetR = star.radius * (1 + proximity * 0.85)
    }

    // Quán tính lướt mềm mại: trôi nhẹ về phía chuột và từ từ trở về vị trí cũ khi chuột đi xa
    star.currentX += (targetX - star.currentX) * 0.06
    star.currentY += (targetY - star.currentY) * 0.06
    star.currentAlpha += (targetAlpha - star.currentAlpha) * 0.08
    star.currentR += (targetR - star.currentR) * 0.08

    ctx.fillStyle = star.color
    ctx.globalAlpha = Math.max(0.08, Math.min(1.0, star.currentAlpha))
    ctx.beginPath()
    ctx.arc(star.currentX, star.currentY, Math.max(0.5, star.currentR), 0, Math.PI * 2)
    ctx.fill()

    if (proximity > 0.35) {
      ctx.globalAlpha = star.currentAlpha * 0.35
      ctx.beginPath()
      ctx.arc(star.currentX, star.currentY, star.currentR * 2.4, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  animId = requestAnimationFrame(render)
}

let observer: ResizeObserver | null = null

onMounted(() => {
  const section = document.getElementById('skill-galaxy')
  section?.addEventListener('mousemove', onPointerMove, { passive: true })
  section?.addEventListener('mouseleave', onPointerLeave)

  observer = new ResizeObserver(resize)
  if (canvasRef.value) observer.observe(canvasRef.value)
  resize()
  animId = requestAnimationFrame(render)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animId)
  observer?.disconnect()
  const section = document.getElementById('skill-galaxy')
  section?.removeEventListener('mousemove', onPointerMove)
  section?.removeEventListener('mouseleave', onPointerLeave)
})
</script>

<template>
  <!-- Interactive dynamic starfield canvas with gravitational pull (Req 1.1 & Req 2) -->
  <canvas ref="canvasRef" class="absolute inset-0 w-full h-full pointer-events-none z-0" aria-hidden="true" />

  <!-- Ambient space glows -->
  <div class="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
    <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] rounded-full bg-primary-container/15 blur-[120px]" />
    <div class="absolute bottom-1/4 right-1/4 w-[480px] h-[480px] rounded-full bg-secondary-container/20 blur-[140px]" />
    <div class="absolute top-1/3 left-1/5 w-[360px] h-[360px] rounded-full bg-domain-iot/10 blur-[100px]" />
  </div>

  <!-- Decorative orbital track rings -->
  <div class="absolute inset-0 flex items-center justify-center pointer-events-none z-0" aria-hidden="true">
    <svg class="w-full max-w-[1300px] h-[950px] opacity-25" fill="none" viewBox="0 0 1200 900">
      <circle class="text-primary/40" cx="600" cy="450" r="230" stroke="currentColor" stroke-dasharray="6 8" stroke-width="1.5" />
      <ellipse class="text-secondary/30" cx="600" cy="450" rx="460" ry="380" stroke="currentColor" stroke-dasharray="4 6" stroke-width="1.2" />
      <line class="text-outline/30" stroke="currentColor" stroke-width="1" x1="600" x2="940" y1="220" y2="180" />
      <line class="text-outline/30" stroke="currentColor" stroke-width="1" x1="840" x2="1010" y1="450" y2="450" />
      <line class="text-outline/30" stroke="currentColor" stroke-width="1" x1="600" x2="920" y1="680" y2="720" />
    </svg>
  </div>
</template>
