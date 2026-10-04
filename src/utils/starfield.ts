/** Starfield model shared by the Galaxy background canvas. */
export interface Star {
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

/** Desktop keeps the dense field; mobile uses fewer stars to save battery. */
export const STAR_COUNT = { desktop: 360, mobile: 120 } as const

const STAR_COLORS = ['#ffffff', '#ffffff', '#b4c5ff', '#a5f3fc', '#fef08a', '#e9d5ff']

/** Random stars in three brightness tiers (small/dim → large/bright). Origins are 0..1. */
export function createStars(count: number): Star[] {
  return Array.from({ length: count }, () => {
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
}

/** Pointer influence for one frame. `strength` 0..1 scales it (mobile tap glow fades out). */
export interface StarField {
  x: number
  y: number
  radius: number
  maxPull: number
  strength: number
}

/** Advance one star by a frame (twinkle + pointer influence + easing). Returns its proximity 0..1. */
export function stepStar(star: Star, width: number, height: number, field: StarField): number {
  star.twinklePhase += star.twinkleSpeed
  const basePixelX = star.originX * width
  const basePixelY = star.originY * height
  const dx = field.x - basePixelX
  const dy = field.y - basePixelY
  const dist = Math.hypot(dx, dy)

  let targetX = basePixelX
  let targetY = basePixelY
  let targetAlpha = star.baseAlpha + Math.sin(star.twinklePhase) * 0.08
  let targetR = star.radius
  const proximity = dist < field.radius ? (1 - dist / field.radius) * field.strength : 0

  if (proximity > 0) {
    // Hút nhẹ về phía chuột (di chuyển tối đa ~22px) — chỉ trên desktop
    const pull = Math.pow(proximity, 1.2) * field.maxPull
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
  return proximity
}

/** Draw one star (plus a soft halo when it is strongly lit). */
export function drawStar(ctx: CanvasRenderingContext2D, star: Star, halo: boolean): void {
  ctx.fillStyle = star.color
  ctx.globalAlpha = Math.max(0.08, Math.min(1.0, star.currentAlpha))
  ctx.beginPath()
  ctx.arc(star.currentX, star.currentY, Math.max(0.5, star.currentR), 0, Math.PI * 2)
  ctx.fill()

  if (halo) {
    ctx.globalAlpha = star.currentAlpha * 0.35
    ctx.beginPath()
    ctx.arc(star.currentX, star.currentY, star.currentR * 2.4, 0, Math.PI * 2)
    ctx.fill()
  }
}
