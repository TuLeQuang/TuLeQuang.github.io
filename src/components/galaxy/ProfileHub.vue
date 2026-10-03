<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { resumeData } from '@/data/resume'
import { useFocus } from '@/composables/useFocus'
import { careerYears } from '@/utils/experience'
import { formatPhone, socialIcons } from '@/utils/styleMaps'

const { t } = useI18n()
const { setHovered } = useFocus()
const { email, phone, socialLinks } = resumeData.personalInfo
const socials = socialLinks.filter(link => link.url)
</script>

<template>
  <div
    data-galaxy-node="hub"
    class="relative rounded-2xl border border-primary/25 bg-surface-container-low/90 backdrop-blur-2xl p-space-lg sm:p-space-xl shadow-2xl text-center flex flex-col items-center"
    @mouseenter="setHovered('hub')"
    @mouseleave="setHovered(null)"
  >
    <!-- Pulsing ambient halo -->
    <div class="absolute -inset-1 rounded-2xl bg-linear-to-r from-primary-container via-secondary-container to-primary-container opacity-40 blur-xl pointer-events-none" />

    <div class="relative w-20 h-20 rounded-full bg-linear-to-tr from-primary-blue-dark to-secondary-container flex items-center justify-center text-3xl shadow-lg ring-4 ring-surface-container-high mb-space-md">
      <span aria-hidden="true">👨‍💻</span>
      <span class="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-domain-supplychain flex items-center justify-center text-surface-container-lowest text-[12px] font-bold">✓</span>
    </div>

    <div class="relative flex flex-wrap items-center justify-center gap-space-xs mb-space-xs">
      <span class="text-label-md uppercase tracking-wider text-primary font-bold">{{ t('profile.role') }}</span>
      <span class="text-label-sm px-space-sm py-0.5 rounded-full bg-secondary-container/40 text-secondary-fixed font-bold tracking-tight">
        {{ t('profile.next') }}
      </span>
    </div>
    <h1 class="relative text-display-hero-mobile md:text-display-hero text-on-surface tracking-tight mb-space-xs">
      {{ t('profile.name') }}
    </h1>
    <p class="relative text-body-md text-on-surface-variant px-space-sm mb-space-lg leading-relaxed">
      “{{ t('profile.tagline', { n: careerYears() }) }}”
    </p>

    <div class="relative w-full flex flex-col gap-space-xs py-space-sm px-space-md border border-outline-variant/50 bg-surface-container/60 rounded-xl mb-space-lg text-left">
      <div class="flex items-center gap-space-sm text-label-md text-on-surface-variant">
        <span class="material-symbols-outlined text-[16px] text-primary">location_on</span>
        <span>{{ t('profile.location') }}</span>
      </div>
      <a class="flex items-center gap-space-sm text-label-md text-on-surface-variant hover:text-on-surface" :href="`mailto:${email}`">
        <span class="material-symbols-outlined text-[16px] text-secondary">mail</span>
        <span class="select-all">{{ email }}</span>
      </a>
      <a class="flex items-center gap-space-sm text-label-md text-on-surface-variant hover:text-on-surface" :href="`tel:${phone}`">
        <span class="material-symbols-outlined text-[16px] text-tertiary">call</span>
        <span>{{ formatPhone(phone) }}</span>
      </a>
    </div>

    <div class="relative flex items-center gap-space-sm w-full">
      <a
        v-for="link in socials"
        :key="link.platform"
        class="flex-1 py-space-xs px-space-sm rounded-lg bg-surface-container-high hover:bg-primary-container text-on-surface hover:text-on-primary-container transition-all text-center text-label-md font-semibold flex items-center justify-center gap-1"
        :href="link.url"
        rel="noopener noreferrer"
        target="_blank"
      >
        <span class="material-symbols-outlined text-[16px]">{{ socialIcons[link.icon] }}</span>
        {{ link.platform }}
      </a>
    </div>
  </div>
</template>
