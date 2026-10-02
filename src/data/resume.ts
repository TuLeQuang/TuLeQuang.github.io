import type { ResumeData } from '@/types'

export const resumeData: ResumeData = {
  personalInfo: {
    name: 'Tu Le Quang',
    title: 'Software Engineer',
    tagline: 'Building digital experiences with passion and precision',
    email: 'your.email@example.com',
    location: 'Vietnam',
    socialLinks: [
      {
        platform: 'GitHub',
        url: 'https://github.com/TuLeQuang',
        icon: 'github',
      },
      {
        platform: 'LinkedIn',
        url: 'https://linkedin.com/in/your-profile',
        icon: 'linkedin',
      },
    ],
  },
  skills: [
    { name: 'Vue.js', level: 90, category: 'Frontend' },
    { name: 'TypeScript', level: 85, category: 'Language' },
    { name: 'Tailwind CSS', level: 80, category: 'Frontend' },
    { name: 'Node.js', level: 75, category: 'Backend' },
  ],
  experiences: [
    {
      company: 'Company Name',
      position: 'Software Engineer',
      startDate: '2023-01',
      endDate: 'Present',
      description: 'Description of your role and responsibilities.',
      highlights: [
        'Key achievement 1',
        'Key achievement 2',
      ],
      technologies: ['Vue.js', 'TypeScript', 'Node.js'],
    },
  ],
  projects: [
    {
      title: 'Project Name',
      description: 'A brief description of the project and its impact.',
      technologies: ['Vue.js', 'TypeScript', 'Tailwind CSS'],
      liveUrl: 'https://example.com',
      sourceUrl: 'https://github.com/TuLeQuang/project',
      featured: true,
    },
  ],
  achievements: [
    {
      title: 'Achievement Title',
      issuer: 'Issuing Organization',
      date: '2023',
      description: 'Description of the achievement.',
    },
  ],
}
