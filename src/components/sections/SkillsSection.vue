<script setup lang="ts">
import { computed } from 'vue'
import { resumeData } from '@/data/resume'

const skills = resumeData.skills

const groupedSkills = computed(() => {
  const groups: Record<string, typeof skills> = {}
  for (const skill of skills) {
    if (!groups[skill.category]) {
      groups[skill.category] = []
    }
    groups[skill.category].push(skill)
  }
  return groups
})
</script>

<template>
  <section id="skills" class="py-20">
    <div class="container mx-auto px-6">
      <h2 class="text-3xl font-bold text-slate-900 text-center mb-12">
        Skills
      </h2>
      <div class="max-w-3xl mx-auto space-y-10">
        <div v-for="(categorySkills, category) in groupedSkills" :key="category">
          <h3 class="text-lg font-semibold text-slate-700 mb-4">
            {{ category }}
          </h3>
          <div class="space-y-4">
            <div v-for="skill in categorySkills" :key="skill.name">
              <div class="flex justify-between mb-1">
                <span class="text-sm font-medium text-slate-700">{{ skill.name }}</span>
                <span class="text-sm text-slate-500">{{ skill.level }}%</span>
              </div>
              <div class="w-full bg-slate-200 rounded-full h-2">
                <div
                  class="bg-blue-600 h-2 rounded-full transition-all duration-700"
                  :style="{ width: `${skill.level}%` }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
