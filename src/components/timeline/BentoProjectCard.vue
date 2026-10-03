<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  title: string
  company?: string
  domain?: string
  role?: string
  period?: string
  teamSize?: number | string
  technologies: string[]
  achievement?: string
  featured?: boolean
  highlighted?: boolean
  muted?: boolean
  responsibilities?: string[]
  deliverables?: string[]
  accentColor: string
}

const props = defineProps<Props>()

const expanded = ref(false)

const toggleProject = () => {
  expanded.value = !expanded.value
}

const getRoleBadgeClass = (role?: string) => {
  if (!role) return 'bg-gray-100 text-gray-800'
  const lower = role.toLowerCase()
  if (lower.includes('ba') && lower.includes('dev')) return 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
  if (lower.includes('ba')) return 'bg-purple-100 text-purple-800'
  if (lower.includes('leader')) return 'bg-green-100 text-green-800'
  if (lower.includes('module')) return 'bg-teal-100 text-teal-800'
  if (lower.includes('dev')) return 'bg-blue-100 text-blue-800'
  return 'bg-gray-100 text-gray-800'
}

const getDomainTagClass = (domain?: string) => {
  const d = domain?.toLowerCase()
  if (d === 'ai') return 'bg-violet-100 text-violet-800'
  if (d === 'logistics') return 'bg-blue-100 text-blue-800'
  if (d === 'iot') return 'bg-teal-100 text-teal-800'
  if (d === 'warehouse') return 'bg-orange-100 text-orange-800'
  if (d === 'adtech') return 'bg-pink-100 text-pink-800'
  if (d === 'supply chain') return 'bg-emerald-100 text-emerald-800'
  return 'bg-gray-100 text-gray-800'
}
</script>

<template>
  <div @click="toggleProject"
       class="bg-white border border-gray-100 p-5 rounded-2xl cursor-pointer transition-all duration-500 animate-on-scroll opacity-0 translate-y-10"
       :class="[
         props.featured ? 'md:col-span-2' : '',
         props.highlighted ? `ring-2 ${props.accentColor === 'blue' ? 'ring-blue-500' : 'ring-purple-500'} shadow-xl scale-[1.02]` : 'hover:shadow-lg',
         props.muted ? 'opacity-40 scale-[0.98]' : ''
       ]">
    <div class="flex justify-between items-start mb-3">
      <h4 class="font-bold text-lg text-gray-900">{{ props.title }}</h4>
      <span v-if="props.company" class="text-xs text-gray-400 uppercase tracking-wider font-semibold">{{ props.company }}</span>
    </div>
    
    <div class="flex flex-wrap gap-2 mb-3">
      <span v-if="props.domain" class="text-xs px-2 py-1 rounded-full font-medium" :class="getDomainTagClass(props.domain)">{{ props.domain }}</span>
      <span v-if="props.role" class="text-xs px-2 py-1 rounded-full font-medium" :class="getRoleBadgeClass(props.role)">{{ props.role }}</span>
      <span class="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">{{ props.period }} • {{ props.teamSize }}</span>
    </div>

    <div v-if="props.achievement" class="mb-3 inline-flex items-center gap-1.5 text-xs font-medium bg-amber-50 text-amber-800 border border-amber-300 px-2 py-1 rounded-md">
      <span>🏆</span> {{ props.achievement }}
    </div>

    <div class="flex flex-wrap gap-1.5 mb-4">
      <span v-for="tech in props.technologies" :key="tech" class="text-[11px] bg-slate-50 border border-slate-200 text-slate-500 px-1.5 py-0.5 rounded">
        {{ tech }}
      </span>
    </div>

    <!-- Expanded Content -->
    <div v-if="expanded" class="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-600">
      <div v-if="props.responsibilities && props.responsibilities.length > 0" class="mb-3">
        <h5 class="font-semibold text-gray-800 mb-1">Responsibilities</h5>
        <ul class="list-disc pl-4 space-y-1">
          <li v-for="res in props.responsibilities" :key="res">{{ res }}</li>
        </ul>
      </div>
      <div v-if="props.deliverables && props.deliverables.length > 0">
        <h5 class="font-semibold text-gray-800 mb-1">Deliverables</h5>
        <ul class="space-y-1">
          <li v-for="del in props.deliverables" :key="del" class="flex gap-2 items-start">
            <span class="text-green-500">✓</span>
            <span>{{ del }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
