<script setup lang="ts">
import { ref } from 'vue'
import type { NavLink } from '@/types'

const isMenuOpen = ref(false)

const navLinks: NavLink[] = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
    <nav class="container mx-auto px-6 py-4 flex items-center justify-between">
      <a href="#" class="text-xl font-bold text-slate-900 hover:text-blue-600 transition-colors">
        TLQ
      </a>

      <!-- Desktop Navigation -->
      <ul class="hidden md:flex items-center gap-8">
        <li v-for="link in navLinks" :key="link.href">
          <a
            :href="link.href"
            class="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
          >
            {{ link.label }}
          </a>
        </li>
      </ul>

      <!-- Mobile Menu Button -->
      <button
        class="md:hidden p-2 text-slate-600 hover:text-slate-900"
        @click="toggleMenu"
        :aria-label="isMenuOpen ? 'Close menu' : 'Open menu'"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            v-if="!isMenuOpen"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
          <path
            v-else
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </nav>

    <!-- Mobile Navigation -->
    <div
      v-if="isMenuOpen"
      class="md:hidden bg-white border-t border-slate-200"
    >
      <ul class="px-6 py-4 space-y-4">
        <li v-for="link in navLinks" :key="link.href">
          <a
            :href="link.href"
            class="block text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
            @click="closeMenu"
          >
            {{ link.label }}
          </a>
        </li>
      </ul>
    </div>
  </header>
</template>
