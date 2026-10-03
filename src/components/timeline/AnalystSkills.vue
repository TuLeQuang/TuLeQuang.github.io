<script setup lang="ts">
import { resumeData } from '@/data/resume'

const analysisSkills = resumeData.skills
  .filter(s => s.category === 'analysis')
  .sort((a, b) => b.years - a.years)

const deliverables = ['WBS', 'SRS', 'Wireframe', 'Solution Proposal', 'Use Case Spec', 'Mockup']

interface DomainInfo {
  name: string
  icon: string
  color: string
  bgColor: string
  projects: number
}

const domains: DomainInfo[] = [
  { name: 'AI', icon: '🤖', color: 'text-violet-700', bgColor: 'bg-violet-50 border-violet-200', projects: 1 },
  { name: 'Logistics', icon: '🚚', color: 'text-blue-700', bgColor: 'bg-blue-50 border-blue-200', projects: 1 },
  { name: 'IoT', icon: '📡', color: 'text-teal-700', bgColor: 'bg-teal-50 border-teal-200', projects: 1 },
  { name: 'Warehouse', icon: '🏭', color: 'text-orange-700', bgColor: 'bg-orange-50 border-orange-200', projects: 1 },
  { name: 'AdTech', icon: '📢', color: 'text-pink-700', bgColor: 'bg-pink-50 border-pink-200', projects: 2 },
]
</script>

<template>
  <div class="mb-12 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

      <!-- BA Skills & Deliverables -->
      <div class="rounded-2xl border border-purple-100 bg-purple-50/50 p-6">
        <h3 class="text-base font-bold text-purple-700 mb-4 flex items-center gap-2">
          <span class="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center text-sm">📋</span>
          BA Skills & Deliverables
        </h3>

        <!-- Analysis Skills -->
        <div class="space-y-2 mb-5">
          <div v-for="skill in analysisSkills" :key="skill.name"
               class="flex items-center gap-3 text-sm">
            <span class="w-24 text-gray-700 font-medium shrink-0">{{ skill.name }}</span>
            <div class="flex-1 h-2 bg-white rounded-full overflow-hidden">
              <div class="h-full bg-purple-500 rounded-full transition-all duration-1000"
                   :style="{ width: `${Math.min((skill.years / 5) * 100, 100)}%` }"></div>
            </div>
            <span class="text-xs text-gray-400 w-8 text-right">{{ skill.years }}yr</span>
          </div>
        </div>

        <!-- Deliverables checklist -->
        <h4 class="text-xs font-semibold text-purple-600 uppercase tracking-wider mb-2">Deliverables</h4>
        <div class="flex flex-wrap gap-2">
          <span v-for="del in deliverables" :key="del"
                class="inline-flex items-center gap-1 text-xs bg-white border border-purple-200 text-purple-700 px-2.5 py-1 rounded-full font-medium">
            <span class="text-green-500">✓</span> {{ del }}
          </span>
        </div>
      </div>

      <!-- Domain Coverage -->
      <div class="rounded-2xl border border-gray-100 bg-gray-50/50 p-6">
        <h3 class="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span class="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-sm">🌐</span>
          Domain Coverage — 5+ Domains
        </h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div v-for="domain in domains" :key="domain.name"
               class="flex items-center gap-2 p-3 rounded-xl border transition-all hover:shadow-sm"
               :class="domain.bgColor">
            <span class="text-xl">{{ domain.icon }}</span>
            <div>
              <p class="text-sm font-semibold" :class="domain.color">{{ domain.name }}</p>
              <p class="text-[10px] text-gray-400">{{ domain.projects }} project{{ domain.projects > 1 ? 's' : '' }}</p>
            </div>
          </div>
        </div>
        <p class="text-xs text-gray-400 mt-4 text-center italic">
          "Phân tích & thiết kế hệ thống cho nhiều dạng nghiệp vụ khác nhau"
        </p>
      </div>

    </div>
  </div>
</template>
