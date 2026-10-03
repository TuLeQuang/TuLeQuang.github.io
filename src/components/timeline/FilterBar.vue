<script setup lang="ts">
interface Props {
  filters: string[]
  activeFilter: string
  accentColor: string // 'blue' or 'purple'
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:activeFilter', value: string): void
}>()
</script>

<template>
  <div class="flex flex-wrap gap-2 mb-8">
    <button v-for="filter in props.filters" :key="filter"
            @click="emit('update:activeFilter', filter)"
            class="px-4 py-1.5 rounded-full text-sm font-medium transition-colors border"
            :class="[
              props.activeFilter === filter 
                ? (props.accentColor === 'blue' ? 'bg-blue-600 text-white border-blue-600' : 'bg-purple-600 text-white border-purple-600') 
                : (props.accentColor === 'blue' ? 'bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600' : 'bg-white border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-600')
            ]">
      {{ filter }}
    </button>
  </div>
</template>
