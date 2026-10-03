<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { resumeData } from '@/data/resume'
import type { Project } from '@/types'
import TimelineTrack from '../timeline/TimelineTrack.vue'
import FilterBar from '../timeline/FilterBar.vue'
import BentoProjectCard from '../timeline/BentoProjectCard.vue'
import TransitionBridge from '../timeline/TransitionBridge.vue'
import BuilderSkills from '../timeline/BuilderSkills.vue'
import AnalystSkills from '../timeline/AnalystSkills.vue'

interface Props {
  activeFilter?: string
  activeTrack?: 'builder' | 'analyst'
  highlightProject?: string
}

const props = defineProps<Props>()

const builderTimeline = resumeData.builderTimeline || []
const analystTimeline = resumeData.analystTimeline || []
const projects = resumeData.projects || []

const builderProjects = computed(() => projects.filter(p => p.track === 'builder'))
const analystProjects = computed(() => projects.filter(p => p.track === 'analyst'))

const builderFilters = ['All', 'Vccorp', 'CMC Global', 'Samsung']
const analystFilters = ['All', 'CMC Global', 'AI', 'Logistics', 'IoT', 'Warehouse', 'AdTech']

const currentBuilderFilter = ref('All')
const currentAnalystFilter = ref('All')

watch(() => props.activeFilter, (newVal) => {
  if (newVal) {
    if (builderFilters.includes(newVal)) currentBuilderFilter.value = newVal
    if (analystFilters.includes(newVal)) currentAnalystFilter.value = newVal
  }
})

const isProjectHighlighted = (project: Project) => {
  if (!props.highlightProject) return false
  return project.slug === props.highlightProject || project.title === props.highlightProject
}

const isProjectMuted = (project: Project, currentFilter: string) => {
  if (currentFilter === 'All') return false
  return !(project.company === currentFilter || project.domain === currentFilter)
}

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('opacity-100', 'translate-x-0', 'translate-y-0')
        entry.target.classList.remove('opacity-0', '-translate-x-10', 'translate-y-10')
      }
    })
  }, { threshold: 0.1 })

  document.querySelectorAll('.animate-on-scroll').forEach((el) => {
    observer.observe(el)
  })
})
</script>

<template>
  <section class="py-24 bg-white">
    <div class="container mx-auto px-4 max-w-6xl">
      <!-- THE BUILDER -->
      <div id="the-builder" class="mb-24 transition-opacity duration-500" :class="{'opacity-100': !props.activeTrack || props.activeTrack === 'builder', 'opacity-50': props.activeTrack === 'analyst'}">
        <div class="mb-16">
          <h2 class="text-4xl font-bold flex items-center gap-3 text-blue-600">
            <span>🔧</span> THE BUILDER
          </h2>
          <p class="text-xl text-gray-600 mt-2">8+ years of building systems</p>
        </div>

        <!-- Skill Showcase -->
        <BuilderSkills />

        <div class="grid md:grid-cols-[1fr_2fr] gap-12">
          <!-- Timeline -->
          <TimelineTrack :milestones="builderTimeline" accentColor="blue" />

          <!-- Projects -->
          <div>
            <FilterBar :filters="builderFilters" v-model:activeFilter="currentBuilderFilter" accentColor="blue" />
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <BentoProjectCard 
                v-for="(project, idx) in builderProjects" 
                :key="project.title"
                :title="project.title"
                :company="project.company"
                :domain="project.domain"
                :role="project.role"
                :period="project.period"
                :team-size="project.teamSize"
                :technologies="project.technologies"
                :achievement="project.achievement?.title"
                :featured="project.featured"
                :responsibilities="project.responsibilities"
                :deliverables="project.deliverables?.map(d => d.name)"
                :highlighted="isProjectHighlighted(project)"
                :muted="isProjectMuted(project, currentBuilderFilter)"
                accentColor="blue"
                :style="{ transitionDelay: `${idx * 100}ms` }"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- TRANSITION BRIDGE -->
      <TransitionBridge />

      <!-- THE ANALYST -->
      <div id="the-analyst" class="transition-opacity duration-500" :class="{'opacity-100': !props.activeTrack || props.activeTrack === 'analyst', 'opacity-50': props.activeTrack === 'builder'}">
        <div class="mb-16">
          <h2 class="text-4xl font-bold flex items-center gap-3 text-purple-600">
            <span>📊</span> THE ANALYST
          </h2>
          <p class="text-xl text-gray-600 mt-2">3+ years of system design</p>
        </div>

        <!-- Analyst Skill Showcase -->
        <AnalystSkills />

        <div class="grid md:grid-cols-[1fr_2fr] gap-12">
          <!-- Timeline -->
          <TimelineTrack :milestones="analystTimeline" accentColor="purple" />

          <!-- Projects -->
          <div>
            <FilterBar :filters="analystFilters" v-model:activeFilter="currentAnalystFilter" accentColor="purple" />
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <BentoProjectCard 
                v-for="(project, idx) in analystProjects" 
                :key="project.title"
                :title="project.title"
                :company="project.company"
                :domain="project.domain"
                :role="project.role"
                :period="project.period"
                :team-size="project.teamSize"
                :technologies="project.technologies"
                :achievement="project.achievement?.title"
                :featured="project.featured"
                :responsibilities="project.responsibilities"
                :deliverables="project.deliverables?.map(d => d.name)"
                :highlighted="isProjectHighlighted(project)"
                :muted="isProjectMuted(project, currentAnalystFilter)"
                accentColor="purple"
                :style="{ transitionDelay: `${idx * 100}ms` }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
