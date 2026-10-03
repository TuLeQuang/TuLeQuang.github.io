<template>
  <section class="relative min-h-[120vh] w-full bg-slate-900 overflow-hidden text-white pt-24 pb-12 md:py-0 md:flex md:items-center md:justify-center">
    <!-- Background Gradient -->
    <div class="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-800 pointer-events-none"></div>

    <!-- Floating Particles -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div 
        v-for="i in 40" 
        :key="i" 
        class="absolute rounded-full bg-white particle-float"
        :style="getParticleStyle(i)"
      ></div>
    </div>

    <!-- Main Container -->
    <div class="relative w-full max-w-xl mx-auto px-4 md:px-0 md:max-w-none md:w-0 md:h-0 z-10 flex flex-col gap-4 md:block">
      
      <!-- Desktop SVG Connections -->
      <svg class="overflow-visible absolute top-0 left-0 w-0 h-0 pointer-events-none hidden md:block z-0">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <!-- Inner Ring -->
        <line x1="0" y1="0" x2="0" y2="-220" :class="getLineClass('database')" stroke="rgba(255,255,255,0.2)" />
        <line x1="0" y1="0" x2="220" y2="0" :class="getLineClass('backend')" stroke="rgba(255,255,255,0.2)" />
        <line x1="0" y1="0" x2="0" y2="220" :class="getLineClass('analysis')" stroke="rgba(255,255,255,0.2)" />
        <line x1="0" y1="0" x2="-220" y2="0" :class="getLineClass('frontend')" stroke="rgba(255,255,255,0.2)" />
        
        <!-- Outer Ring -->
        <line x1="0" y1="0" x2="300" y2="-200" :class="getLineClass('education')" stroke="rgba(255,255,255,0.2)" />
        <line x1="0" y1="0" x2="420" y2="0" :class="getLineClass('companies')" stroke="rgba(255,255,255,0.2)" />
        <line x1="0" y1="0" x2="300" y2="200" :class="getLineClass('achievements')" stroke="rgba(255,255,255,0.2)" />
        
        <!-- Inter-node connections (skill ↔ skill) -->
        <line x1="-220" y1="0" x2="220" y2="0" 
              class="inter-connection" stroke="rgba(96,165,250,0.15)" stroke-dasharray="4 6"
              :class="{ 'inter-active': hoveredNode === 'frontend' || hoveredNode === 'backend' || hoveredHub }" />
        <line x1="220" y1="0" x2="0" y2="-220" 
              class="inter-connection" stroke="rgba(96,165,250,0.15)" stroke-dasharray="4 6"
              :class="{ 'inter-active': hoveredNode === 'backend' || hoveredNode === 'database' || hoveredHub }" />
        <line x1="-220" y1="0" x2="0" y2="220" 
              class="inter-connection" stroke="rgba(96,165,250,0.15)" stroke-dasharray="4 6"
              :class="{ 'inter-active': hoveredNode === 'frontend' || hoveredNode === 'analysis' || hoveredHub }" />
        <line x1="220" y1="0" x2="0" y2="220" 
              class="inter-connection" stroke="rgba(96,165,250,0.15)" stroke-dasharray="4 6"
              :class="{ 'inter-active': hoveredNode === 'backend' || hoveredNode === 'analysis' || hoveredHub }" />
        <line x1="0" y1="-220" x2="0" y2="220" 
              class="inter-connection" stroke="rgba(96,165,250,0.15)" stroke-dasharray="4 6"
              :class="{ 'inter-active': hoveredNode === 'database' || hoveredNode === 'analysis' || hoveredHub }" />
        <line x1="-220" y1="0" x2="0" y2="-220" 
              class="inter-connection" stroke="rgba(96,165,250,0.15)" stroke-dasharray="4 6"
              :class="{ 'inter-active': hoveredNode === 'frontend' || hoveredNode === 'database' || hoveredHub }" />
      </svg>

      <!-- Center Glow -->
      <div class="absolute md:top-0 md:left-0 md:-translate-x-1/2 md:-translate-y-1/2 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[100px] pointer-events-none hidden md:block"></div>

      <!-- Profile Hub (Center) -->
      <ProfileHub
        :name="resumeData.personalInfo.name"
        :title="resumeData.personalInfo.title"
        :subtitle="resumeData.personalInfo.subtitle"
        :tagline="resumeData.personalInfo.tagline"
        :email="resumeData.personalInfo.email"
        :phone="resumeData.personalInfo.phone"
        :location="resumeData.personalInfo.location"
        :social-links="resumeData.personalInfo.socialLinks"
        @hover="v => hoveredHub = v"
      />

      <!-- INNER RING: Skills -->
      <SkillNode
        label="Database"
        :skills="getSkillsByCategory('Database').slice(0, 4)"
        color-class="text-blue-300"
        position-class="md:absolute md:-top-[220px] md:left-0 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[220px]"
        @hover="v => hoveredNode = v ? v.toLowerCase() : null"
        @click="handleNavigate('builder', 'Database')"
      />

      <SkillNode
        label="Backend"
        :skills="getSkillsByCategory('Backend').slice(0, 4)"
        color-class="text-green-300"
        position-class="md:absolute md:top-0 md:left-[220px] md:-translate-x-1/2 md:-translate-y-1/2 md:w-[220px]"
        @hover="v => hoveredNode = v ? v.toLowerCase() : null"
        @click="handleNavigate('builder', 'Backend')"
      />

      <SkillNode
        label="Analysis & Design"
        :skills="getSkillsByCategory('analysis').slice(0, 4)"
        color-class="text-purple-300"
        position-class="md:absolute md:top-[220px] md:left-0 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[220px]"
        @hover="v => hoveredNode = v ? 'analysis' : null"
        @click="handleNavigate('analyst', 'all')"
      />

      <SkillNode
        label="Frontend"
        :skills="getSkillsByCategory('Frontend').slice(0, 4)"
        color-class="text-pink-300"
        position-class="md:absolute md:top-0 md:-left-[220px] md:-translate-x-1/2 md:-translate-y-1/2 md:w-[220px]"
        @hover="v => hoveredNode = v ? v.toLowerCase() : null"
        @click="handleNavigate('builder', 'Frontend')"
      />

      <!-- OUTER RING -->
      <InfoSatellite
        title="Education"
        position-class="md:absolute md:-top-[200px] md:left-[300px] md:-translate-x-1/2 md:-translate-y-1/2 md:w-[240px]"
        @hover="v => hoveredNode = v ? v.toLowerCase() : null"
      >
        <div class="mb-2">
          <p class="font-medium text-sm">{{ resumeData.education.school }}</p>
          <p class="text-xs text-slate-300">{{ resumeData.education.major }}</p>
          <p class="text-xs text-slate-400">{{ resumeData.education.period }} · GPA: {{ resumeData.education.gpa }}</p>
        </div>
      </InfoSatellite>

      <InfoSatellite
        title="Experience"
        position-class="md:absolute md:top-0 md:left-[420px] md:-translate-x-1/2 md:-translate-y-1/2 md:w-[240px]"
        @hover="v => hoveredNode = v ? 'companies' : null"
      >
        <div class="space-y-3 relative before:absolute before:inset-y-1 before:left-1.5 before:w-0.5 before:bg-white/20">
          <div 
            v-for="company in resumeData.companies" 
            :key="company.name"
            class="relative pl-5 cursor-pointer hover:text-blue-300 transition-colors"
            @click="handleNavigate('builder', company.name)"
          >
            <div class="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-slate-400 border-2 border-slate-800"></div>
            <p class="font-medium text-sm">{{ company.name }}</p>
            <p class="text-xs text-slate-400">{{ company.period }}</p>
          </div>
        </div>
      </InfoSatellite>

      <InfoSatellite
        title="Achievements"
        title-color-class="text-amber-400"
        position-class="md:absolute md:top-[200px] md:left-[300px] md:-translate-x-1/2 md:-translate-y-1/2 md:w-[240px]"
        extra-class="border-amber-500/30"
        @hover="v => hoveredNode = v ? v.toLowerCase() : null"
      >
        <ul class="space-y-2">
          <li 
            v-for="ach in resumeData.achievements" 
            :key="ach.title"
            class="text-xs text-slate-200 cursor-pointer hover:text-amber-300 transition-colors flex items-start gap-2"
            @click="handleNavigate('builder', ach.projectSlug || '')"
          >
            <span class="text-amber-500 mt-0.5">★</span>
            <span>{{ ach.title }}</span>
          </li>
        </ul>
      </InfoSatellite>

    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { resumeData } from '@/data/resume'
import ProfileHub from '@/components/galaxy/ProfileHub.vue'
import SkillNode from '@/components/galaxy/SkillNode.vue'
import InfoSatellite from '@/components/galaxy/InfoSatellite.vue'

const emit = defineEmits<{
  navigate: [payload: { target: 'builder' | 'analyst'; filter: string }]
}>()

const hoveredNode = ref<string | null>(null)
const hoveredHub = ref(false)

const getSkillsByCategory = (category: string) => {
  return resumeData.skills
    .filter(s => s.category === category.toLowerCase())
    .map(s => s.name)
}

const handleNavigate = (target: 'builder' | 'analyst', filter: string) => {
  emit('navigate', { target, filter })
}

const getLineClass = (nodeName: string) => {
  const isActive = hoveredHub.value || hoveredNode.value === nodeName
  return [
    'connection-line',
    isActive ? 'stroke-white/60 glow-effect' : ''
  ]
}

const getParticleStyle = (index: number) => {
  const size = 2 + Math.random() * 5 + (index % 5 === 0 ? 4 : 0) // every 5th particle is a big 'star'
  const top = Math.random() * 100
  const left = Math.random() * 100
  const duration = 8 + Math.random() * 15
  const delay = Math.random() * 8
  const opacity = 0.3 + Math.random() * 0.5
  return {
    width: `${size}px`,
    height: `${size}px`,
    top: `${top}%`,
    left: `${left}%`,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`,
    '--particle-opacity': opacity,
    boxShadow: size > 5 ? `0 0 ${size}px rgba(255,255,255,0.5)` : 'none'
  }
}
</script>

<style scoped>
@reference 'tailwindcss';

.connection-line {
  stroke-width: 2;
  stroke-dasharray: 6;
  transition: all 0.3s ease;
}

.glow-effect {
  filter: url(#glow);
  stroke-width: 3;
}

.inter-connection {
  stroke-width: 1;
  transition: all 0.3s ease;
  opacity: 0.5;
}

.inter-active {
  stroke: rgba(96, 165, 250, 0.5) !important;
  stroke-width: 1.5;
  opacity: 1;
  filter: url(#glow);
}

@keyframes float {
  0% { transform: translateY(0) scale(1); opacity: 0; }
  10% { opacity: var(--particle-opacity); }
  90% { opacity: var(--particle-opacity); }
  100% { transform: translateY(-150px) translateX(30px) scale(0.5); opacity: 0; }
}

.particle-float {
  animation: float linear infinite;
}
</style>
