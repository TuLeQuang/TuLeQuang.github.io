<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useScrollSpy } from '@/composables/useScrollSpy'
import { scrollToSection, type SectionId } from '@/utils/sections'

/** Mobile bottom navigation (Q-M4): always within thumb reach; "Contact" doubles as a permanent CTA. */
const { t } = useI18n()
const { active } = useScrollSpy()

const tabs: { id: SectionId; icon: string; key: string }[] = [
  { id: 'all-about-me', icon: 'person', key: 'mobileNav.profile' },
  { id: 'the-analyst', icon: 'analytics', key: 'mobileNav.analyst' },
  { id: 'the-builder', icon: 'terminal', key: 'mobileNav.builder' },
  { id: 'contact', icon: 'mail', key: 'mobileNav.contact' }
]
</script>

<template>
  <nav
    class="md:hidden fixed bottom-0 inset-x-0 z-50 bg-surface-container-lowest/90 backdrop-blur-xl border-t border-outline-variant/30 pb-[env(safe-area-inset-bottom)]"
    :aria-label="t('mobileNav.menuTitle')"
  >
    <div class="h-16 grid grid-cols-4">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        class="relative flex flex-col items-center justify-center gap-0.5 text-label-sm transition-colors"
        :class="active === tab.id ? 'text-primary' : 'text-on-surface-variant'"
        :aria-current="active === tab.id ? 'page' : undefined"
        @click="scrollToSection(tab.id)"
      >
        <span
          class="absolute top-0 h-0.5 w-8 rounded-full bg-primary transition-opacity"
          :class="active === tab.id ? 'opacity-100' : 'opacity-0'"
          aria-hidden="true"
        />
        <span
          class="material-symbols-outlined text-[22px]"
          :style="active === tab.id ? { fontVariationSettings: `'FILL' 1` } : undefined"
        >{{ tab.icon }}</span>
        <span class="font-medium">{{ t(tab.key) }}</span>
      </button>
    </div>
  </nav>
</template>
