import type { ResumeData, Achievement } from '@/types'

const bestProject2025: Achievement = {
  title: 'Best Project Q3.2025',
  organization: 'CMC Global',
  date: 'Q3 2025',
  icon: '🏆',
  projectSlug: 'ms-word-ai-agent',
  companyName: 'CMC Global'
}

const risingStar2024: Achievement = {
  title: 'Rising Star Q2.2024',
  organization: 'CMC Global',
  date: 'Q2 2024',
  icon: '🌟',
  companyName: 'CMC Global'
}

const bestEmployee2020: Achievement = {
  title: 'Best Employee 2020',
  organization: 'Vccorp',
  date: '2020',
  icon: '🏅',
  projectSlug: 'adserving-3rd-tracking',
  companyName: 'Vccorp'
}

export const resumeData: ResumeData = {
  personalInfo: {
    name: 'Le Quang Tu',
    title: 'Fullstack Developer',
    subtitle: '→ Business Analyst',
    tagline: 'From building systems to designing them — 8+ years of end-to-end product development',
    email: 'lequangtu28@gmail.com',
    phone: '0986685827',
    location: 'Hanoi, Vietnam',
    socialLinks: [
      { platform: 'Facebook', url: 'https://www.facebook.com/chido', icon: 'facebook' },
      { platform: 'GitHub', url: 'https://github.com/TuLeQuang', icon: 'github' },
      { platform: 'LinkedIn', url: '#', icon: 'linkedin' }
    ]
  },
  education: {
    school: 'Ha Noi University of Industry',
    major: 'Software Engineering',
    period: '2014-2018',
    gpa: '3.21/4'
  },
  companies: [
    {
      name: 'CMC Global',
      position: 'Software Engineer',
      period: '05/2022 – Present',
      years: '~4+ years'
    },
    {
      name: 'Vccorp',
      position: 'PHP Developer',
      period: '02/2018 – 04/2022',
      years: '~4 years'
    }
  ],
  skills: [
    { name: 'Vue.js', category: 'frontend', years: 6 },
    { name: 'JavaScript', category: 'frontend', years: 6 },
    { name: 'HTML/CSS', category: 'frontend', years: 8 },
    { name: 'jQuery', category: 'frontend', years: 4 },
    { name: 'Mapbox', category: 'frontend', years: 1 },
    { name: 'Java', category: 'backend', years: 3 },
    { name: 'Spring', category: 'backend', years: 3 },
    { name: 'PHP', category: 'backend', years: 4 },
    { name: 'Laravel', category: 'backend', years: 4 },
    { name: 'REST API', category: 'backend', years: 6 },
    { name: 'PostgreSQL', category: 'database', years: 4 },
    { name: 'MySQL', category: 'database', years: 4 },
    { name: 'Redis', category: 'database', years: 3 },
    { name: 'DB2', category: 'database', years: 2 },
    { name: 'UML Design', category: 'analysis', years: 3 },
    { name: 'Wireframe', category: 'analysis', years: 3 },
    { name: 'WBS', category: 'analysis', years: 3 },
    { name: 'SRS', category: 'analysis', years: 3 },
    { name: 'Solution Design', category: 'analysis', years: 3 }
  ],
  achievements: [
    bestProject2025,
    risingStar2024,
    bestEmployee2020
  ],
  projects: [
    {
      slug: 'ms-word-ai-agent',
      title: 'MS Word Add-in AI Agent',
      description: 'AI Agent embedded in MS Word',
      period: '01/2025 – 03/2025',
      customer: 'CMC Customer',
      company: 'CMC Global',
      role: 'BA',
      teamSize: 7,
      track: 'analyst',
      featured: true,
      domain: 'AI',
      technologies: ['PostgreSQL', 'JavaScript', 'Vue3', 'Java', 'Spring'],
      deliverables: [
        { name: 'WBS', completed: true },
        { name: 'SRS', completed: true },
        { name: 'Wireframe', completed: true },
        { name: 'Solution Proposal', completed: true }
      ],
      responsibilities: [
        'Analysis and design for all system',
        'Design wireframe, diagrams, and define functional requirement documents (WBS, SRS)',
        'Pre-sale project with sale'
      ],
      achievement: bestProject2025
    },
    {
      slug: 'transport-mgmt',
      title: 'Transport Management System',
      description: 'System for managing transport',
      period: '01/2025 – 03/2025',
      customer: 'CMC Customer',
      company: 'CMC Global',
      role: 'BA',
      teamSize: 4,
      track: 'analyst',
      domain: 'Logistics',
      technologies: ['PostgreSQL', 'JavaScript', 'Vue3', 'Java', 'Spring'],
      deliverables: [
        { name: 'WBS', completed: true },
        { name: 'SRS', completed: true },
        { name: 'Wireframe', completed: true }
      ],
      responsibilities: [
        'Pre-sale project with sale',
        'Analysis and design for all system',
        'Design wireframe, diagrams, and define functional requirement documents (WBS, SRS)',
        'Consulting on transport management solutions'
      ]
    },
    {
      slug: 'fleet-mgmt',
      title: 'Fleet Management System',
      description: 'IoT based Fleet management',
      period: '10/2024 – 12/2024',
      customer: 'CMC Customer',
      company: 'CMC Global',
      role: 'BA + Developer',
      teamSize: 5,
      track: 'analyst',
      domain: 'IoT',
      technologies: ['PostgreSQL', 'JavaScript', 'Vue3', 'Litjs', 'Java', 'Spring'],
      deliverables: [
        { name: 'WBS', completed: true },
        { name: 'SRS', completed: true },
        { name: 'Wireframe', completed: true }
      ],
      responsibilities: [
        'Analysis and design for all system',
        'Design wireframe, diagrams, and define functional requirement documents (WBS, SRS)',
        'Pre-sale project with sale',
        'Code front-end'
      ]
    },
    {
      slug: 'warehouse-mgmt',
      title: 'Warehouse Management System',
      description: 'System for warehouse management',
      period: '05/2024 – 09/2024',
      customer: 'CMC Customer',
      company: 'CMC Global',
      role: 'BA',
      teamSize: 3,
      track: 'analyst',
      domain: 'Warehouse',
      technologies: ['PostgreSQL', 'JavaScript', 'Vue3', 'Java', 'Spring'],
      deliverables: [
        { name: 'WBS', completed: true },
        { name: 'Wireframe', completed: true }
      ],
      responsibilities: [
        'Analysis and design for all system',
        'Design wireframe, diagrams',
        'Pre-sale project with sale',
        'Consulting on warehouse management solutions'
      ]
    },
    {
      slug: 'cello-logistics',
      title: 'Cello - Supply Chain Logistics',
      description: 'Supply Chain Logistics',
      period: '12/2022 – 04/2024',
      customer: 'Samsung',
      company: 'CMC Global',
      role: 'Module Leader',
      teamSize: 70,
      track: 'builder',
      domain: 'Supply Chain',
      technologies: ['DB2', 'JavaScript', 'jQuery', 'Vue.js', 'Java', 'Spring'],
      responsibilities: [
        'Planning and assign task to member',
        'Ensure system reliability and performance',
        'Resolve incidents, apply bug fixes, optimize workflows',
        'Analyze system performance, identify bottlenecks',
        'Document processes, handle user queries, provide training',
        'Continuous improvement to meet customer business needs'
      ]
    },
    {
      slug: 'cello-tracking',
      title: 'Visibility Management System - Cello Tracking',
      description: 'Cello Tracking System',
      period: '05/2022 – 11/2022',
      customer: 'Samsung',
      company: 'CMC Global',
      role: 'Developer',
      teamSize: 12,
      track: 'builder',
      technologies: ['DB2', 'JavaScript', 'Vue.js', 'Mapbox', 'Java', 'Spring'],
      responsibilities: [
        'Code front-end'
      ]
    },
    {
      slug: 'adserving-3rd-tracking',
      title: 'Adserving 3rd-Party Tracking',
      description: 'Adserving 3rd-Party Tracking System',
      period: '12/2019 – 04/2022',
      customer: 'Vccorp',
      company: 'Vccorp',
      role: 'Leader',
      teamSize: 3,
      track: 'builder',
      domain: 'AdTech',
      technologies: ['PHP', 'MySQL', 'Redis', 'Laravel', 'JavaScript', 'Vue.js'],
      responsibilities: [
        'Analysis and design for all system',
        'Code back-end, front-end',
        'Optimize code',
        'Bug Fixing'
      ]
    },
    {
      slug: 'tagmanager',
      title: 'Tagmanager',
      description: 'Tagmanager tool',
      period: '03/2018 – 02/2020',
      customer: 'Vccorp',
      company: 'Vccorp',
      role: 'Leader',
      teamSize: 3,
      track: 'builder',
      domain: 'AdTech',
      technologies: ['PHP', 'MySQL', 'Laravel', 'JavaScript', 'jQuery'],
      responsibilities: [
        'Analysis and design all system',
        'Design CoreJS',
        'Code back-end, front-end',
        'Optimize code',
        'Build API to connect with another system',
        'Bug Fixing'
      ]
    },
    {
      slug: 'ad-template-tool',
      title: 'Advertising Template Management Tool',
      description: 'Ad Template Tool',
      period: '01/2018 – 02/2018',
      customer: 'Vccorp',
      company: 'Vccorp',
      role: 'Developer',
      teamSize: 3,
      track: 'builder',
      technologies: ['PHP', 'MySQL', 'Laravel', 'JavaScript', 'VueJS', 'jQuery'],
      responsibilities: [
        'Analysis and design all system',
        'Code back-end, front-end',
        'Optimize code',
        'Bug Fixing'
      ]
    }
  ],
  builderTimeline: [
    {
      year: '2018',
      title: 'Started at Vccorp',
      description: 'PHP Developer — Laravel, jQuery, MySQL',
      tags: ['PHP', 'Laravel', 'MySQL'],
      company: 'Vccorp'
    },
    {
      year: '2019',
      title: 'First Leadership Role',
      description: 'Led Adserving 3rd Tracking — Fullstack: PHP + Vue.js + Redis',
      tags: ['PHP', 'Vue.js', 'Redis'],
      company: 'Vccorp'
    },
    {
      year: '2020',
      title: 'Best Employee Award',
      description: 'Recognized for excellence at Admicro Division',
      achievement: bestEmployee2020,
      company: 'Vccorp'
    },
    {
      year: '2022',
      title: 'Joined CMC Global',
      description: 'Upgraded tech stack — Java/Spring + Vue3 + PostgreSQL. Samsung Cello project (team 70)',
      tags: ['Java', 'Spring', 'Vue3'],
      company: 'CMC Global'
    },
    {
      year: '2024',
      title: 'Rising Star',
      description: 'Recognized as Rising Star Q2.2024 at CMC Global',
      achievement: risingStar2024,
      company: 'CMC Global'
    }
  ],
  analystTimeline: [
    {
      year: '2019',
      title: 'Early Analysis Experience',
      description: 'Led system analysis for Tagmanager & Adserving at Vccorp',
      tags: ['AdTech', 'System Design'],
      company: 'Vccorp'
    },
    {
      year: '2022',
      title: 'Samsung Cello — Module Management',
      description: 'Managed module, analyzed bottlenecks, documented processes',
      tags: ['Logistics', 'Documentation'],
      company: 'CMC Global'
    },
    {
      year: '2024',
      title: 'Full BA Transition',
      description: 'Warehouse Mgmt → Fleet Mgmt (IoT) — dedicated BA role',
      tags: ['Warehouse', 'IoT'],
      company: 'CMC Global'
    },
    {
      year: '2025',
      title: 'Multi-Domain BA',
      description: 'Transport Mgmt + MS Word AI Agent — covering Logistics & AI domains',
      tags: ['Logistics', 'AI'],
      achievement: bestProject2025,
      company: 'CMC Global'
    }
  ],
  galaxyConnections: [
    {
      from: 'frontend',
      to: 'backend',
      label: 'Fullstack',
      tooltip: '6+ years FE + 3-4 years BE = E2E Development'
    },
    {
      from: 'backend',
      to: 'database',
      label: 'Data Layer',
      tooltip: 'DB design + production operations'
    },
    {
      from: 'frontend',
      to: 'analysis',
      label: 'UI/UX',
      tooltip: 'From wireframe to code directly'
    },
    {
      from: 'backend',
      to: 'analysis',
      label: 'Architecture',
      tooltip: 'Understanding systems → better design'
    },
    {
      from: 'database',
      to: 'analysis',
      label: 'Data Model',
      tooltip: 'DB design = foundation for BA'
    },
    {
      from: 'frontend',
      to: 'database',
      label: 'Full Stack',
      tooltip: 'End-to-end data flow'
    }
  ]
}
