<template>
  <!-- Ambient space glows & stardust -->
  <div class="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
    <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] rounded-full bg-primary-container/15 blur-[120px]" />
    <div class="absolute bottom-1/4 right-1/4 w-[480px] h-[480px] rounded-full bg-secondary-container/20 blur-[140px]" />
    <div class="absolute top-1/3 left-1/5 w-[360px] h-[360px] rounded-full bg-domain-iot/10 blur-[100px]" />
    <span class="absolute top-[12%] left-[18%] w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse" />
    <span class="absolute top-[28%] left-[75%] w-1 h-1 rounded-full bg-primary-fixed/80" />
    <span class="absolute top-[65%] left-[12%] w-1.5 h-1.5 rounded-full bg-secondary-fixed/60 animate-pulse" />
    <span class="absolute top-[78%] left-[82%] w-2 h-2 rounded-full bg-tertiary-fixed/70" />
    <span class="absolute top-[45%] left-[88%] w-1 h-1 rounded-full bg-white/50" />
    <span class="absolute top-[85%] left-[30%] w-1.5 h-1.5 rounded-full bg-primary/70 animate-ping" />
  </div>

  <!-- Decorative orbital track rings -->
  <div class="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
    <svg class="w-full max-w-[1300px] h-[950px] opacity-25" fill="none" viewBox="0 0 1200 900">
      <circle class="text-primary/40" cx="600" cy="450" r="230" stroke="currentColor" stroke-dasharray="6 8" stroke-width="1.5" />
      <ellipse class="text-secondary/30" cx="600" cy="450" rx="460" ry="380" stroke="currentColor" stroke-dasharray="4 6" stroke-width="1.2" />
      <line class="text-outline/30" stroke="currentColor" stroke-width="1" x1="600" x2="940" y1="220" y2="180" />
      <line class="text-outline/30" stroke="currentColor" stroke-width="1" x1="840" x2="1010" y1="450" y2="450" />
      <line class="text-outline/30" stroke="currentColor" stroke-width="1" x1="600" x2="920" y1="680" y2="720" />
    </svg>
  </div>
</template>
