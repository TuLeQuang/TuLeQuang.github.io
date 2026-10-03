<script setup lang="ts">
import type { Achievement } from '@/types'

interface Props {
  milestones: Array<{
    year: string
    title: string
    description: string
    company?: string
    achievement?: Achievement
    tags?: string[]
  }>
  accentColor: string  // 'blue' or 'purple'
}

const props = defineProps<Props>()
</script>

<template>
  <div class="relative pl-8 border-l-2" :class="props.accentColor === 'blue' ? 'border-blue-200' : 'border-purple-200'">
    <div v-for="(item, idx) in props.milestones" :key="idx" 
         class="mb-10 relative animate-on-scroll opacity-0 -translate-x-10 transition-all duration-700 delay-100">
      <div class="absolute -left-[41px] w-5 h-5 rounded-full flex items-center justify-center bg-white border-2"
           :class="item.achievement ? 'border-amber-400' : (props.accentColor === 'blue' ? 'border-blue-400' : 'border-purple-400')">
        <div v-if="item.achievement" class="w-3 h-3 bg-amber-400 rounded-full animate-ping"></div>
        <div v-else class="w-2.5 h-2.5 rounded-full" :class="props.accentColor === 'blue' ? 'bg-blue-500' : 'bg-purple-500'"></div>
      </div>
      <div class="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div class="flex justify-between items-start mb-2">
          <h3 class="font-bold text-lg text-gray-900">{{ item.title }}</h3>
          <span class="text-sm font-semibold" :class="props.accentColor === 'blue' ? 'text-blue-600' : 'text-purple-600'">{{ item.year }}</span>
        </div>
        <div v-if="item.company" class="text-sm text-gray-500 mb-2">{{ item.company }}</div>
        <p class="text-gray-600 text-sm mb-3">{{ item.description }}</p>
        <div v-if="item.tags" class="flex flex-wrap gap-2">
          <span v-for="tag in item.tags" :key="tag" class="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
            {{ tag }}
          </span>
        </div>
        <div v-if="item.achievement" class="mt-3 inline-flex items-center gap-1.5 text-xs font-medium bg-amber-50 text-amber-800 border border-amber-300 px-2 py-1 rounded-full">
          <span>{{ item.achievement.icon || '🏆' }}</span> {{ item.achievement.title }}
        </div>
      </div>
    </div>
  </div>
</template>
