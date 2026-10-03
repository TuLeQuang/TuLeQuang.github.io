<script setup lang="ts">
import { resumeData } from '@/data/resume'
import type { SkillCategory } from '@/types'

interface SkillGroup {
  category: SkillCategory
  label: string
  icon: string
  color: string
  bgColor: string
  barColor: string
}

const skillGroups: SkillGroup[] = [
  { category: 'frontend', label: 'Frontend', icon: '🖥️', color: 'text-pink-600', bgColor: 'bg-pink-50', barColor: 'bg-pink-500' },
  { category: 'backend', label: 'Backend', icon: '⚙️', color: 'text-green-600', bgColor: 'bg-green-50', barColor: 'bg-green-500' },
  { category: 'database', label: 'Database', icon: '📦', color: 'text-blue-600', bgColor: 'bg-blue-50', barColor: 'bg-blue-500' },
]

const maxYears = 8

const getSkillsByGroup = (category: SkillCategory) => {
  return resumeData.skills
    .filter(s => s.category === category)
    .sort((a, b) => b.years - a.years)
}

const getBarWidth = (years: number) => {
  return Math.min((years / maxYears) * 100, 100)
}
</script>

<template>
  <div class="mb-12 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
    <h3 class="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
      <span class="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-sm">💻</span>
      Tech Stack
    </h3>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="group in skillGroups" :key="group.category"
           class="rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow"
           :class="group.bgColor">
        <div class="flex items-center gap-2 mb-4">
          <span class="text-lg">{{ group.icon }}</span>
          <h4 class="font-bold text-base" :class="group.color">{{ group.label }}</h4>
        </div>
        <div class="space-y-3">
          <div v-for="skill in getSkillsByGroup(group.category)" :key="skill.name">
            <div class="flex justify-between items-center mb-1">
              <span class="text-sm font-medium text-gray-700">{{ skill.name }}</span>
              <span class="text-xs text-gray-400">{{ skill.years }}yr</span>
            </div>
            <div class="h-2 bg-white/80 rounded-full overflow-hidden">
              <div class="h-full rounded-full transition-all duration-1000 ease-out"
                   :class="group.barColor"
                   :style="{ width: `${getBarWidth(skill.years)}%` }">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
