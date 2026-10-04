<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import BottomSheet from '@/components/common/BottomSheet.vue'
import ContactActions from '@/components/common/ContactActions.vue'
import { useScrollSpy } from '@/composables/useScrollSpy'
import { MOBILE_SECTION_ORDER, navParams, scrollToSection, SECTION_NAV_KEYS, type SectionId } from '@/utils/sections'

/** Mobile ☰ menu: every section in BA-first order + contact actions (call, CV). */
defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()
const { t } = useI18n()
const { active } = useScrollSpy()

const go = (id: SectionId): void => {
  emit('close')
  // Wait for the sheet to release the scroll lock / history entry before scrolling
  setTimeout(() => scrollToSection(id), 250)
}
</script>

<template>
  <BottomSheet :open="open" :label="t('mobileNav.menuTitle')" full @close="emit('close')">
    <h2 class="text-label-sm text-text-muted uppercase tracking-wider mb-space-sm">{{ t('mobileNav.menuTitle') }}</h2>
    <nav class="flex flex-col gap-1 mb-space-xl">
      <button
        v-for="id in MOBILE_SECTION_ORDER"
        :key="id"
        type="button"
        class="min-h-12 px-space-md rounded-xl flex items-center justify-between text-left text-headline-sm transition-colors"
        :class="active === id ? 'bg-primary-blue-light text-primary-blue-dark' : 'text-text-primary hover:bg-content-surface'"
        :aria-current="active === id ? 'page' : undefined"
        @click="go(id)"
      >
        <span>{{ t(SECTION_NAV_KEYS[id], navParams(id)) }}</span>
        <span class="material-symbols-outlined text-[20px] text-text-muted">chevron_right</span>
      </button>
    </nav>
    <ContactActions tone="light" />
  </BottomSheet>
</template>
