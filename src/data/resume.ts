import type { ResumeData } from '@/types'

/**
 * Language-neutral resume data (dates, tech, team size, links, ids).
 * Every display text is stored in src/locales/{vi,en}.json keyed by id / slug.
 * Source of truth: cv_raw/cv_summary.md
 */
export const resumeData: ResumeData = {
  personalInfo: {
    email: 'lequangtu28@gmail.com',
    phone: '0986685827',
    socialLinks: [
      { platform: 'GitHub', url: 'https://github.com/TuLeQuang', icon: 'github' },
      { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/t%C3%BA-l%C3%AA-2167132b4/', icon: 'linkedin' },
      { platform: 'Facebook', url: 'https://www.facebook.com/chido.kedokatoji', icon: 'facebook' }
    ]
  },

  education: { period: '10/2014 – 05/2018', gpa: '3.21 / 4' },

  companies: [
    { name: 'Vccorp', i18nKey: 'vccorp', start: '02/2018', end: '04/2022', since: 2018, until: 2022 },
    { name: 'CMC Global', i18nKey: 'cmc', start: '05/2022', since: 2022 }
  ],

  // End customers. Samsung is a key client of CMC Global (not an employer).
  customers: [
    { id: 'vccorp', name: 'Vccorp', company: 'Vccorp' }, // in-house products
    { id: 'samsung', name: 'Samsung', company: 'CMC Global', keyClient: true },
    { id: 'cmcCustomer', name: "CMC's Customer", company: 'CMC Global' }
  ],

  skills: [
    // Frontend
    { name: 'HTML / CSS', category: 'frontend', since: 2018 },
    { name: 'JavaScript', category: 'frontend', since: 2018 },
    { name: 'Vue.js (2 & 3)', category: 'frontend', since: 2018 },
    { name: 'jQuery', category: 'frontend', since: 2018, until: 2024 },
    { name: 'Mapbox', category: 'frontend', since: 2022, until: 2023 },
    // Backend
    { name: 'PHP / Laravel', category: 'backend', since: 2018, until: 2022 },
    { name: 'Java / Spring', category: 'backend', since: 2022 },
    { name: 'RESTful API', category: 'backend', since: 2018 },
    // Database
    { name: 'MySQL', category: 'database', since: 2018, until: 2022 },
    { name: 'Redis', category: 'database', since: 2019, until: 2022 },
    { name: 'DB2', category: 'database', since: 2022, until: 2024 },
    { name: 'PostgreSQL', category: 'database', since: 2024 },
    // Analysis
    { name: 'UML / Database Design', category: 'analysis', since: 2018 },
    { name: 'WBS', category: 'analysis', since: 2022 },
    { name: 'SRS', category: 'analysis', since: 2022 },
    { name: 'Use Case Specification', category: 'analysis', since: 2022 },
    { name: 'Wireframe / Mockup', category: 'analysis', since: 2022 },
    { name: 'Solution Proposal', category: 'analysis', since: 2022 }
  ],

  skillClusters: [
    { id: 'database', icon: 'database', accent: 'primary', skills: ['PostgreSQL', 'MySQL', 'Redis', 'DB2'] },
    { id: 'frontend', icon: 'devices', accent: 'iot', skills: ['Vue.js', 'JavaScript', 'HTML/CSS', 'jQuery'] },
    { id: 'backend', icon: 'terminal', accent: 'secondary', skills: ['Java / Spring', 'PHP / Laravel', 'REST API'] },
    { id: 'analysis', icon: 'schema', accent: 'tertiary', skills: ['UML', 'Wireframe', 'WBS', 'SRS', 'Use Case'] }
  ],

  achievements: [
    {
      id: 'best-project-2025', icon: '🏆', company: 'CMC Global', track: 'analyst',
      milestoneId: 'analyst-2025', projectSlug: 'ms-word-ai-agent'
    },
    { id: 'rising-star-2024', icon: '🌟', company: 'CMC Global', track: 'builder', milestoneId: 'builder-2024' },
    {
      id: 'best-employee-2020', icon: '🏅', company: 'Vccorp', track: 'builder',
      milestoneId: 'builder-2020', projectSlug: 'adserving-3rd-tracking'
    }
  ],

  projects: [
    // ----- Builder -----
    {
      slug: 'cello-supply-chain', period: '12/2022 – 04/2024', company: 'CMC Global', customer: 'samsung',
      role: 'moduleLeader', teamSize: 70, domain: 'SupplyChain', tracks: ['builder'], layout: 'featured',
      technologies: ['DB2', 'JavaScript', 'jQuery', 'Vue.js', 'Java', 'Spring']
    },
    {
      slug: 'cello-tracking', period: '05/2022 – 11/2022', company: 'CMC Global', customer: 'samsung',
      role: 'frontendDev', teamSize: 12, domain: 'IoT', tracks: ['builder'],
      technologies: ['DB2', 'JavaScript', 'Vue.js', 'Mapbox', 'Java', 'Spring']
    },
    {
      slug: 'adserving-3rd-tracking', period: '12/2019 – 04/2022', company: 'Vccorp', customer: 'vccorp',
      role: 'leader', teamSize: 3, domain: 'AdTech', tracks: ['builder'], achievementId: 'best-employee-2020',
      technologies: ['PHP', 'MySQL', 'Redis', 'Laravel', 'JavaScript', 'Vue.js']
    },
    {
      slug: 'tagmanager', period: '03/2018 – 02/2020', company: 'Vccorp', customer: 'vccorp',
      role: 'leader', teamSize: 3, domain: 'AdTech', tracks: ['builder'],
      technologies: ['PHP', 'MySQL', 'Laravel', 'JavaScript', 'jQuery']
    },
    {
      slug: 'ad-template-tool', period: '01/2018 – 02/2018', company: 'Vccorp', customer: 'vccorp',
      role: 'backendDev', teamSize: 3, domain: 'AdTech', tracks: ['builder'], layout: 'wide',
      technologies: ['PHP', 'MySQL', 'Laravel', 'JavaScript', 'Vue.js', 'jQuery']
    },
    // ----- Analyst -----
    {
      slug: 'ms-word-ai-agent', period: '01/2025 – 03/2025', company: 'CMC Global', customer: 'cmcCustomer',
      role: 'ba', teamSize: 7, domain: 'AI', tracks: ['analyst'], layout: 'featured',
      achievementId: 'best-project-2025', deliverables: ['wbs', 'srs', 'wireframe', 'proposal'],
      technologies: ['PostgreSQL', 'JavaScript', 'Vue3', 'Java', 'Spring']
    },
    {
      slug: 'transport-management', period: '01/2025 – 03/2025', company: 'CMC Global', customer: 'cmcCustomer',
      role: 'ba', teamSize: 4, domain: 'Logistics', tracks: ['analyst'],
      deliverables: ['wbs', 'srs', 'wireframe', 'proposal'],
      technologies: ['PostgreSQL', 'JavaScript', 'Vue3', 'Java', 'Spring']
    },
    {
      slug: 'fleet-management', period: '10/2024 – 12/2024', company: 'CMC Global', customer: 'cmcCustomer',
      role: 'baDev', teamSize: 5, domain: 'IoT', tracks: ['analyst', 'builder'],
      deliverables: ['wbs', 'srs', 'wireframe', 'frontendCode'],
      technologies: ['PostgreSQL', 'JavaScript', 'Vue3', 'Litjs', 'Java', 'Spring']
    },
    {
      slug: 'warehouse-management', period: '05/2024 – 09/2024', company: 'CMC Global', customer: 'cmcCustomer',
      role: 'ba', teamSize: 3, domain: 'Warehouse', tracks: ['analyst'], layout: 'wide',
      deliverables: ['wireframe', 'proposal'],
      technologies: ['PostgreSQL', 'JavaScript', 'Vue3', 'Java', 'Spring']
    }
  ],

  builderTimeline: [
    { id: 'builder-2018', year: '2018', company: 'Vccorp', projectSlugs: ['ad-template-tool', 'tagmanager'] },
    { id: 'builder-2019', year: '2019', company: 'Vccorp', projectSlugs: ['adserving-3rd-tracking'] },
    { id: 'builder-2020', year: '2020', company: 'Vccorp', achievementId: 'best-employee-2020' },
    { id: 'builder-2022', year: '2022', company: 'CMC Global', projectSlugs: ['cello-tracking', 'cello-supply-chain'] },
    { id: 'builder-2024', year: '2024', company: 'CMC Global', achievementId: 'rising-star-2024' }
  ],

  analystTimeline: [
    { id: 'analyst-2019', year: '2019', company: 'Vccorp', projectSlugs: ['tagmanager', 'adserving-3rd-tracking'] },
    { id: 'analyst-2022', year: '2022 – 2024', company: 'CMC Global', projectSlugs: ['cello-supply-chain'] },
    { id: 'analyst-2024', year: '2024', company: 'CMC Global', projectSlugs: ['warehouse-management', 'fleet-management'] },
    {
      id: 'analyst-2025', year: '2025', company: 'CMC Global', achievementId: 'best-project-2025',
      projectSlugs: ['ms-word-ai-agent', 'transport-management']
    }
  ],

  galaxyConnections: [
    { id: 'frontend-backend', from: 'frontend', to: 'backend' },
    { id: 'backend-database', from: 'backend', to: 'database' },
    { id: 'frontend-analysis', from: 'frontend', to: 'analysis' },
    { id: 'backend-analysis', from: 'backend', to: 'analysis' },
    { id: 'database-analysis', from: 'database', to: 'analysis' }
  ],

  baDomains: ['AI', 'Logistics', 'IoT', 'Warehouse', 'AdTech']
}
