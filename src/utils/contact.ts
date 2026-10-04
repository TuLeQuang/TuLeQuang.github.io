import { resumeData } from '@/data/resume'
import type { Locale } from '@/types'

/** "0986685827" → "tel:+84986685827" (Vietnamese mobile number, leading 0 → +84). */
export const telHref = (phone: string = resumeData.personalInfo.phone): string =>
  `tel:${phone.replace(/^0/, '+84')}`

/** CV PDF for the current language, resolved against Vite's base URL (GitHub Pages safe). */
export const cvHref = (locale: Locale): string => `${import.meta.env.BASE_URL}${resumeData.personalInfo.cvUrl[locale]}`

/** Suggested file name when the browser downloads the CV. */
export const cvFileName = (locale: Locale): string => (locale === 'vi' ? 'LeQuangTu_CV.pdf' : 'LeQuangTu_CV_EN.pdf')
