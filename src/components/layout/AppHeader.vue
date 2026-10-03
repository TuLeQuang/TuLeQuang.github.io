<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from './LanguageSwitcher.vue'
import { resumeData } from '@/data/resume'
import { useFocus } from '@/composables/useFocus'
import { useScrollSpy } from '@/composables/useScrollSpy'
import { baYears, careerYears } from '@/utils/experience'
import { scrollToSection, SECTION_IDS, SECTION_NAV_KEYS, TRACK_SECTION, type SectionId } from '@/utils/sections'

const { t } = useI18n()
const { active } = useScrollSpy()
const { focus, clear } = useFocus()
const email = resumeData.personalInfo.email

const navLabel = (id: SectionId): string => {
  if (id === 'the-builder') return t(SECTION_NAV_KEYS[id], { n: careerYears() })
  if (id === 'the-analyst') return t(SECTION_NAV_KEYS[id], { n: baYears() })
  return t(SECTION_NAV_KEYS[id])
}

/** Galaxy › <focused item> › The Builder / The Analyst */
const crumbs = computed(() => {
  if (!focus.value) return null
  const track = focus.value.track
  return {
    label: t(focus.value.labelKey),
    sectionId: TRACK_SECTION[track],
    sectionLabel: t(track === 'builder' ? 'nav.builderShort' : 'nav.analystShort')
  }
})
</script>

<template>
  <header class="fixed top-0 left-0 w-full z-50 bg-surface-container-lowest/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
    <div class="h-20 w-full px-gutter-mobile sm:px-gutter lg:px-margin flex items-center justify-between gap-space-sm">
      <a class="flex items-center gap-space-sm group min-w-0" href="#skill-galaxy">
        <span class="text-headline-sm text-on-surface group-hover:text-primary transition-colors tracking-tight truncate">
          {{ t('profile.name') }}
        </span>
        <span class="hidden sm:inline-flex items-center px-space-sm py-space-xs rounded-full bg-surface-container-high text-label-sm text-primary">
          {{ t('nav.badge') }}
        </span>
      </a>

      <nav class="hidden xl:flex items-center gap-space-lg">
        <a
          v-for="id in SECTION_IDS"
          :key="id"
          :href="`#${id}`"
          :aria-current="active === id ? 'page' : undefined"
          class="transition-colors py-space-xs px-space-sm rounded-lg"
          :class="
            active === id
              ? 'bg-primary-container text-on-primary-container text-headline-sm'
              : 'text-body-md text-on-surface-variant hover:text-on-surface'
          "
        >
          {{ navLabel(id) }}
        </a>
      </nav>

      <div class="flex items-center gap-space-sm sm:gap-space-md shrink-0">
        <a
          class="hidden md:inline-flex items-center px-space-md py-space-xs rounded-full bg-surface-container text-label-md text-on-surface-variant hover:text-on-surface transition-colors"
          :href="`mailto:${email}`"
        >
          {{ email }}
        </a>
        <a
          class="hidden sm:inline-flex items-center px-space-lg py-space-sm rounded-lg bg-primary-container text-on-primary-container text-headline-sm shadow-md hover:bg-primary-blue-dark transition-all"
          href="#contact"
        >
          {{ t('nav.cta') }}
        </a>
        <LanguageSwitcher />
        <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
          <span class="material-symbols-outlined text-on-primary text-[18px]">person</span>
        </div>
      </div>
    </div>

    <!-- Context breadcrumb (ui_plan_v2): visible while a focus is active -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      leave-active-class="transition duration-150 ease-in"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div
        v-if="crumbs"
        class="h-10 px-gutter-mobile sm:px-gutter lg:px-margin flex items-center gap-space-xs bg-surface-container-low/90 text-label-md text-on-surface-variant"
      >
        <button type="button" class="hover:text-primary transition-colors" @click="scrollToSection('skill-galaxy')">
          {{ t('nav.breadcrumbRoot') }}
        </button>
        <span class="material-symbols-outlined text-[16px] text-outline">chevron_right</span>
        <span class="text-on-surface font-semibold">{{ crumbs.label }}</span>
        <span class="material-symbols-outlined text-[16px] text-outline">chevron_right</span>
        <button type="button" class="hover:text-primary transition-colors" @click="scrollToSection(crumbs.sectionId)">
          {{ crumbs.sectionLabel }}
        </button>
        <button
          type="button"
          class="ml-auto inline-flex items-center gap-1 px-space-sm py-0.5 rounded-full bg-surface-container-high hover:text-on-surface transition-colors"
          :aria-label="t('nav.clearFocus')"
          @click="clear"
        >
          <span class="material-symbols-outlined text-[16px]">close</span>
          <span class="hidden sm:inline">{{ t('nav.clearFocus') }}</span>
        </button>
      </div>
    </Transition>
  </header>
</template>
