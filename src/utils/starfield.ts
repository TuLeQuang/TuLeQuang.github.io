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

  // Subtle 3D parallax drift based on cursor position relative to galaxy center
  if (field.x !== -9999 && field.y !== -9999 && width > 0 && height > 0) {
    const mouseOffsetX = (field.x - width / 2) / (width / 2)
    const mouseOffsetY = (field.y - height / 2) / (height / 2)
    const depthFactor = (star.radius / 2.5) * 16
    targetX += mouseOffsetX * depthFactor
    targetY += mouseOffsetY * depthFactor
  }

  const proximity = dist < field.radius ? (1 - dist / field.radius) * field.strength : 0

  if (proximity > 0) {
    // Gravitational pull towards cursor (clearly visible displacement)
    const pull = Math.pow(proximity, 1.1) * field.maxPull
    const angle = Math.atan2(dy, dx)
    targetX += Math.cos(angle) * pull
    targetY += Math.sin(angle) * pull

    // Sáng bừng lên khi chuột ở gần
    targetAlpha = Math.min(1.0, star.baseAlpha + proximity * 0.8)
    targetR = star.radius * (1 + proximity * 1.2)
  }

  // Quán tính lướt mềm mại và nhạy bén: theo chuột mượt mà và êm ái
  star.currentX += (targetX - star.currentX) * 0.16
  star.currentY += (targetY - star.currentY) * 0.16
  star.currentAlpha += (targetAlpha - star.currentAlpha) * 0.12
  star.currentR += (targetR - star.currentR) * 0.12
  return proximity
}

const hexToRgba = (hex: string, alpha: number): string => {
  if (hex.startsWith('#') && hex.length === 7) {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }
  return hex
}

/** Draw one star (plus a soft halo with feathered, gradient edge when lit). */
export function drawStar(ctx: CanvasRenderingContext2D, star: Star, halo: boolean): void {
  const r = Math.max(0.5, star.currentR)

  // Vòng sáng bên ngoài mở / mờ dần mềm mại ở viền (radial gradient)
  if (halo) {
    const outerR = r * 3.8
    const grad = ctx.createRadialGradient(
      star.currentX, star.currentY, r * 0.2,
      star.currentX, star.currentY, outerR
    )
    grad.addColorStop(0, hexToRgba(star.color, 0.55))
    grad.addColorStop(0.3, hexToRgba(star.color, 0.32))
    grad.addColorStop(0.7, hexToRgba(star.color, 0.1))
    grad.addColorStop(1, hexToRgba(star.color, 0))

    ctx.save()
    ctx.globalAlpha = Math.min(0.65, star.currentAlpha * 0.6)
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.arc(star.currentX, star.currentY, outerR, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  // Nhân sao sắc nét ở trung tâm
  ctx.fillStyle = star.color
  ctx.globalAlpha = Math.max(0.08, Math.min(1.0, star.currentAlpha))
  ctx.beginPath()
  ctx.arc(star.currentX, star.currentY, r, 0, Math.PI * 2)
  ctx.fill()
}
