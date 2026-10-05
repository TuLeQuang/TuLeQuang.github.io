<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { resumeData } from '@/data/resume'
import { useFocus } from '@/composables/useFocus'
import { scrollToSection } from '@/utils/sections'
import { formatPhone, socialIcons } from '@/utils/styleMaps'

const { t } = useI18n()
const { setHovered } = useFocus()
const { email, phone, socialLinks } = resumeData.personalInfo
const socials = socialLinks.filter(link => link.url)
</script>

<template>
  <div
    data-galaxy-node="hub"
    class="group relative rounded-2xl border border-primary/25 hover:border-primary/80 bg-surface-container-low/90 backdrop-blur-2xl p-space-md sm:p-space-lg shadow-2xl hover:shadow-[0_0_45px_rgba(180,197,255,0.35)] hover:scale-[1.018] transition-all duration-300 ease-out text-center flex flex-col items-center"
    @mouseenter="setHovered('hub')"
    @mouseleave="setHovered(null)"
  >
    <!-- Pulsing ambient halo & core border -->
    <div class="absolute -inset-1 rounded-2xl bg-linear-to-r from-primary-container via-secondary-container to-primary-container opacity-40 group-hover:opacity-75 blur-xl transition-opacity duration-300 pointer-events-none" />
    <div class="absolute -inset-px rounded-2xl border border-primary/35 group-hover:border-primary/80 animate-pulse pointer-events-none transition-colors duration-300" />

    <!-- 1. Icon và Tên hiển thị inline, giảm font size tên -->
    <div class="relative flex items-center justify-center gap-space-sm mb-space-sm">
      <div class="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-linear-to-tr from-primary-blue-dark to-secondary-container flex items-center justify-center text-xl sm:text-2xl shadow-md ring-2 ring-surface-container-high shrink-0">
        <span aria-hidden="true">👨‍💻</span>
        <span class="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-domain-supplychain flex items-center justify-center text-surface-container-lowest text-[9px] font-bold">✓</span>
      </div>
      <h1 class="text-headline-md sm:text-headline-lg text-on-surface tracking-tight font-bold">
        {{ t('profile.name') }}
      </h1>
    </div>

    <!-- Mô tả nhanh tích hợp hành trình chuyển đổi (gọn gàng) -->
    <div class="relative flex flex-col items-center gap-space-xs px-space-xs mb-space-sm text-center max-w-full">
      <p class="text-body-sm sm:text-body-md text-on-surface-variant leading-relaxed">
        “{{ t('profile.tagline') }}”
      </p>

      <!-- Hành trình chuyển dịch trên 1 dòng duy nhất -->
      <div class="inline-flex items-center gap-1.5 p-1 px-2 rounded-full bg-surface-container-high/70 border border-outline-variant/40 shadow-xs backdrop-blur-md">
        <!-- From: Fullstack Developer -->
        <button
          type="button"
          class="group inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-container/20 border border-primary/30 text-primary-fixed text-label-sm font-semibold hover:bg-primary-container/30 hover:scale-105 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          :title="t('profile.viewBuilder')"
          @click="scrollToSection('the-builder')"
        >
          <span class="material-symbols-outlined text-[14px] text-primary" aria-hidden="true">terminal</span>
          <span>{{ t('profile.role') }}</span>
        </button>

        <!-- Mũi tên chuyển dịch phát sáng -->
        <span class="material-symbols-outlined text-[16px] text-secondary animate-pulse" aria-hidden="true">
          trending_flat
        </span>

        <!-- To: Business Analyst (Nổi bật) -->
        <button
          type="button"
          class="group inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-container/40 border border-secondary/60 text-secondary-fixed text-label-sm font-bold shadow-[0_0_12px_rgba(209,174,255,0.25)] ring-1 ring-secondary/40 hover:bg-secondary-container/60 hover:scale-105 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
          :title="t('profile.viewAnalyst')"
          @click="scrollToSection('the-analyst')"
        >
          <span class="material-symbols-outlined text-[14px] text-secondary" aria-hidden="true">analytics</span>
          <span>{{ t('profile.targetRole') }}</span>
        </button>
      </div>
    </div>

    <!-- 2. Phần thông tin liên hệ và phần link inline, xếp danh sách link dọc từ trên xuống bên cạnh -->
    <div class="relative w-full flex items-center justify-between gap-space-sm p-space-sm border border-outline-variant/40 bg-surface-container/60 rounded-xl text-left">
      <!-- Cột thông tin liên hệ -->
      <div class="flex-1 flex flex-col justify-center gap-1.5 min-w-0 pr-space-xs">
        <div class="flex items-center gap-1.5 text-label-md text-on-surface-variant truncate">
          <span class="material-symbols-outlined text-[16px] text-primary shrink-0">location_on</span>
          <span class="truncate">{{ t('profile.location') }}</span>
        </div>
        <a class="flex items-center gap-1.5 text-label-md text-on-surface-variant hover:text-on-surface transition-colors truncate" :href="`mailto:${email}`">
          <span class="material-symbols-outlined text-[16px] text-secondary shrink-0">mail</span>
          <span class="select-all truncate">{{ email }}</span>
        </a>
        <a class="flex items-center gap-1.5 text-label-md text-on-surface-variant hover:text-on-surface transition-colors truncate" :href="`tel:${phone}`">
          <span class="material-symbols-outlined text-[16px] text-tertiary shrink-0">call</span>
          <span class="truncate">{{ formatPhone(phone) }}</span>
        </a>
      </div>

      <!-- Đường phân cách nhẹ giữa 2 phần -->
      <div class="w-px self-stretch bg-outline-variant/30 my-0.5 shrink-0" aria-hidden="true" />

      <!-- Cột danh sách link (GitHub, LinkedIn, Facebook) xếp dọc từ trên xuống -->
      <div class="flex flex-col justify-center gap-1 shrink-0 w-[112px] sm:w-[124px]">
        <a
          v-for="link in socials"
          :key="link.platform"
          class="py-1 px-2 rounded-md bg-surface-container-high/80 hover:bg-primary-container text-on-surface hover:text-on-primary-container transition-all text-label-sm font-semibold flex items-center gap-1.5"
          :href="link.url"
          rel="noopener noreferrer"
          target="_blank"
        >
          <span class="material-symbols-outlined text-[15px] shrink-0">{{ socialIcons[link.icon] }}</span>
          <span class="truncate">{{ link.platform }}</span>
        </a>
      </div>
    </div>
  </div>
</template>
