<script setup lang="ts">
import { resumeData } from '@/data/resume'

const experiences = resumeData.experiences
</script>

<template>
  <section id="experience" class="py-20 bg-slate-50">
    <div class="container mx-auto px-6">
      <h2 class="text-3xl font-bold text-slate-900 text-center mb-12">
        Experience
      </h2>
      <div class="max-w-3xl mx-auto space-y-8">
        <div
          v-for="(exp, index) in experiences"
          :key="index"
          class="relative pl-8 border-l-2 border-blue-200"
        >
          <div class="absolute left-[-9px] top-0 w-4 h-4 bg-blue-600 rounded-full" />
          <div class="bg-white p-6 rounded-lg shadow-sm">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
              <h3 class="text-lg font-semibold text-slate-900">
                {{ exp.position }}
              </h3>
              <span class="text-sm text-slate-500">
                {{ exp.startDate }} — {{ exp.endDate }}
              </span>
            </div>
            <p class="text-blue-600 font-medium mb-3">{{ exp.company }}</p>
            <p class="text-slate-600 mb-4">{{ exp.description }}</p>
            <ul class="list-disc list-inside space-y-1 text-slate-600 mb-4">
              <li v-for="(highlight, i) in exp.highlights" :key="i">
                {{ highlight }}
              </li>
            </ul>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tech in exp.technologies"
                :key="tech"
                class="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
              >
                {{ tech }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
