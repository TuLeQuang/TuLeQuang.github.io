import { resumeData } from '@/data/resume'
import { projectMatchesSkill } from '@/utils/styleMaps'
import type { FocusState, Project, SkillCategory, TimelineMilestone } from '@/types'

/** Does a project belong to the current focus (skill / company / domain / achievement)? */
export const projectMatchesFocus = (project: Project, focus: FocusState): boolean => {
  switch (focus.kind) {
    case 'skill':
      return projectMatchesSkill(project, focus.value as SkillCategory)
    case 'company':
      return project.company === focus.value
    case 'domain':
      return project.domain === focus.value
    case 'achievement':
      return project.achievementId === focus.value
  }
}

/** Does a timeline milestone relate to the current focus? */
export const milestoneMatchesFocus = (milestone: TimelineMilestone, focus: FocusState): boolean => {
  if (focus.kind === 'company') return milestone.company === focus.value
  if (focus.kind === 'achievement') return milestone.achievementId === focus.value
  const slugs = milestone.projectSlugs ?? []
  return resumeData.projects.some(p => slugs.includes(p.slug) && projectMatchesFocus(p, focus))
}
