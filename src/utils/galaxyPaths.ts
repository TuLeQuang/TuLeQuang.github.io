import type { SkillCategory } from '@/types'

export type NodeId = SkillCategory | 'hub'

export interface BoxRect {
  left: number
  right: number
  top: number
  bottom: number
  width: number
  height: number
  centerX: number
  centerY: number
}

export interface RenderPath {
  id: string
  from: NodeId
  to: NodeId
  d: string
  color: string
  glowColor: string
  width: number
  isHubSpoke: boolean
  startX?: number
  startY?: number
  endX?: number
  endY?: number
  title?: string
}

/**
 * Calculates curved and straight SVG connection paths between galaxy nodes.
 * Anchors start and end precisely on outer card perimeters so lines never hide under boxes.
 * Includes only the 4 cardinal spokes to ProfileHub and the 3 diagonal perimeter ties.
 */
export function buildGalaxyPaths(
  b: Partial<Record<NodeId, BoxRect>>,
  isDesktop: boolean,
  /** Tooltip of a skill connection (CV content: connections.<id>) */
  connectionLabel: (id: string) => string
): RenderPath[] {
  const db = b.database
  const fe = b.frontend
  const be = b.backend
  const hub = b.hub
  const an = b.analysis

  if (!db || !fe || !be || !hub || !an) return []

  if (isDesktop) {
    return [
      // 1. Bốn nhánh năng lượng trung tâm kết nối trực tiếp với Thông tin cá nhân (ProfileHub)
      {
        id: 'hub-frontend',
        from: 'hub',
        to: 'frontend',
        d: `M ${hub.left} ${hub.centerY} L ${fe.right} ${fe.centerY}`,
        color: '#14b8a6',
        glowColor: '#2dd4bf',
        width: 3.0,
        isHubSpoke: true,
        startX: hub.left,
        startY: hub.centerY,
        endX: fe.right,
        endY: fe.centerY
      },
      {
        id: 'hub-backend',
        from: 'hub',
        to: 'backend',
        d: `M ${hub.right} ${hub.centerY} L ${be.left} ${be.centerY}`,
        color: '#a855f7',
        glowColor: '#d8b4fe',
        width: 3.0,
        isHubSpoke: true,
        startX: hub.right,
        startY: hub.centerY,
        endX: be.left,
        endY: be.centerY
      },
      {
        id: 'hub-database',
        from: 'hub',
        to: 'database',
        d: `M ${hub.centerX} ${hub.top} L ${db.centerX} ${db.bottom}`,
        color: '#3b82f6',
        glowColor: '#93c5fd',
        width: 3.0,
        isHubSpoke: true,
        startX: hub.centerX,
        startY: hub.top,
        endX: db.centerX,
        endY: db.bottom
      },
      {
        id: 'hub-analysis',
        from: 'hub',
        to: 'analysis',
        d: `M ${hub.centerX} ${hub.bottom} L ${an.centerX} ${an.top}`,
        color: '#f59e0b',
        glowColor: '#fde047',
        width: 3.0,
        isHubSpoke: true,
        startX: hub.centerX,
        startY: hub.bottom,
        endX: an.centerX,
        endY: an.top
      },

      // 2. Ba liên kết sườn vòng ngoài giữa các cụm kỹ năng
      {
        id: 'backend-database',
        from: 'backend',
        to: 'database',
        d: `M ${db.right} ${db.centerY} C ${db.right + 50} ${db.centerY + 30}, ${be.centerX - 15} ${be.top - 50}, ${be.centerX - 15} ${be.top}`,
        color: '#818cf8',
        glowColor: '#c084fc',
        width: 3.0,
        isHubSpoke: false,
        startX: db.right,
        startY: db.centerY,
        endX: be.centerX - 15,
        endY: be.top,
        title: connectionLabel('backend-database')
      },
      {
        id: 'frontend-analysis',
        from: 'frontend',
        to: 'analysis',
        d: `M ${an.left} ${an.centerY} C ${an.left - 50} ${an.centerY - 30}, ${fe.centerX + 15} ${fe.bottom + 50}, ${fe.centerX + 15} ${fe.bottom}`,
        color: '#14b8a6',
        glowColor: '#5eead4',
        width: 3.0,
        isHubSpoke: false,
        startX: an.left,
        startY: an.centerY,
        endX: fe.centerX + 15,
        endY: fe.bottom,
        title: connectionLabel('frontend-analysis')
      },
      {
        id: 'backend-analysis',
        from: 'backend',
        to: 'analysis',
        d: `M ${an.right} ${an.centerY} C ${an.right + 50} ${an.centerY - 30}, ${be.centerX - 15} ${be.bottom + 50}, ${be.centerX - 15} ${be.bottom}`,
        color: '#f59e0b',
        glowColor: '#fcd34d',
        width: 3.0,
        isHubSpoke: false,
        startX: an.right,
        startY: an.centerY,
        endX: be.centerX - 15,
        endY: be.bottom,
        title: connectionLabel('backend-analysis')
      }
    ]
  }

  // Mobile layout (dọc)
  return [
    {
      id: 'hub-database',
      from: 'hub',
      to: 'database',
      d: `M ${hub.centerX} ${hub.top} L ${db.centerX} ${db.bottom}`,
      color: '#3b82f6',
      glowColor: '#93c5fd',
      width: 2.8,
      isHubSpoke: true,
      startX: hub.centerX,
      startY: hub.top,
      endX: db.centerX,
      endY: db.bottom
    },
    {
      id: 'hub-frontend',
      from: 'hub',
      to: 'frontend',
      d: `M ${hub.centerX} ${hub.bottom} L ${fe.centerX} ${fe.top}`,
      color: '#14b8a6',
      glowColor: '#2dd4bf',
      width: 2.8,
      isHubSpoke: true,
      startX: hub.centerX,
      startY: hub.bottom,
      endX: fe.centerX,
      endY: fe.top
    },
    {
      id: 'hub-backend',
      from: 'hub',
      to: 'backend',
      d: `M ${hub.right} ${hub.centerY} C ${hub.right + 35} ${(hub.centerY + be.centerY) / 2}, ${be.right + 35} ${(hub.centerY + be.centerY) / 2}, ${be.right} ${be.centerY}`,
      color: '#a855f7',
      glowColor: '#d8b4fe',
      width: 2.8,
      isHubSpoke: true,
      startX: hub.right,
      startY: hub.centerY,
      endX: be.right,
      endY: be.centerY
    },
    {
      id: 'hub-analysis',
      from: 'hub',
      to: 'analysis',
      d: `M ${hub.left} ${hub.centerY} C ${hub.left - 40} ${(hub.centerY + an.centerY) / 2}, ${an.left - 40} ${(hub.centerY + an.centerY) / 2}, ${an.left} ${an.centerY}`,
      color: '#f59e0b',
      glowColor: '#fde047',
      width: 2.8,
      isHubSpoke: true,
      startX: hub.left,
      startY: hub.centerY,
      endX: an.left,
      endY: an.centerY
    },
    {
      id: 'backend-database',
      from: 'backend',
      to: 'database',
      d: `M ${db.right} ${db.centerY} C ${Math.max(db.right, be.right) + 40} ${(db.centerY + be.centerY) / 2}, ${Math.max(db.right, be.right) + 40} ${(db.centerY + be.centerY) / 2}, ${be.right} ${be.top}`,
      color: '#818cf8',
      glowColor: '#c084fc',
      width: 2.8,
      isHubSpoke: false,
      startX: db.right,
      startY: db.centerY,
      endX: be.right,
      endY: be.top,
      title: connectionLabel('backend-database')
    },
    {
      id: 'frontend-analysis',
      from: 'frontend',
      to: 'analysis',
      d: `M ${fe.left} ${fe.bottom} C ${Math.min(fe.left, an.left) - 35} ${(fe.bottom + an.top) / 2}, ${Math.min(fe.left, an.left) - 35} ${(fe.bottom + an.top) / 2}, ${an.left} ${an.top}`,
      color: '#14b8a6',
      glowColor: '#5eead4',
      width: 2.8,
      isHubSpoke: false,
      startX: fe.left,
      startY: fe.bottom,
      endX: an.left,
      endY: an.top,
      title: connectionLabel('frontend-analysis')
    },
    {
      id: 'backend-analysis',
      from: 'backend',
      to: 'analysis',
      d: `M ${be.centerX} ${be.bottom} L ${an.centerX} ${an.top}`,
      color: '#f59e0b',
      glowColor: '#fcd34d',
      width: 2.8,
      isHubSpoke: false,
      startX: be.centerX,
      startY: be.bottom,
      endX: an.centerX,
      endY: an.top,
      title: connectionLabel('backend-analysis')
    }
  ]
}
