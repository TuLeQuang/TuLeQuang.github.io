import cv from 'virtual:cv'
import type { CvData, ResumeData } from '@/types'

/**
 * Language-neutral resume data (dates, tech, team size, links, ids).
 * Source of truth: content/cv.md → cv-pipeline (build time) → `virtual:cv`.
 * Texts (EN / VI) are read through useCv(); UI labels stay in src/locales.
 * Do not edit data here — edit content/cv.md (see content/cv_transform_rules.md).
 */
export const cvData: CvData = cv
export const resumeData: ResumeData = cv.resume
