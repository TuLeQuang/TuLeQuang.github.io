import { readonly, ref } from 'vue'
import type { ProjectTrack } from '@/types'

interface OpenProject {
  slug: string
  track: ProjectTrack
}

// Module-level state: a single ProjectSheet instance (App.vue) serves every card on the page.
const current = ref<OpenProject | null>(null)

/** Mobile project details: cards open the bottom sheet instead of the inline drawer. */
export function useProjectSheet() {
  const openProject = (slug: string, track: ProjectTrack): void => {
    current.value = { slug, track }
  }
  const closeProject = (): void => {
    current.value = null
  }
  return { current: readonly(current), openProject, closeProject }
}
