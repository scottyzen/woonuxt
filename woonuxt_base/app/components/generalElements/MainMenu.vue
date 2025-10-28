<script setup lang="ts">
import { useCategoryMenu } from '~/composables/useCategoryMenu'

const { topMenu } = await useCategoryMenu()
const openIndex = ref<number | null>(null)

function onEnter(i: number) { openIndex.value = i }
function onLeave() { openIndex.value = null }

// Debug: uncomment tijdelijk als je wilt checken of data binnenkomt
// watchEffect(() => { if (process.client) console.debug('[topMenu]', topMenu.value) })
</script>

<template>
  <!-- Render alleen als er data is, voorkomt flicker/hydration issues -->
  <ul v-if="topMenu?.length" class="flex items-center gap-6">
    <li
      v-for="(item, i) in topMenu"
      :key="item.id"
      class="relative"
      @mouseenter="onEnter(i)"
      @mouseleave="onLeave"
    >
      <NuxtLink
        :to="item.uri"
        class="py-2 px-2 text-gray-700 hover:text-black transition"
      >
        {{ item.label }}
      </NuxtLink>

      <!-- MEGA PANEL -->
      <transition name="mega-panel">
        <div
          v-if="openIndex === i && item.columns.length"
          class="absolute left-0 top-full w-screen max-w-6xl bg-white border border-gray-100 shadow-[0_24px_64px_-24px_rgba(0,0,0,.18)] rounded-3xl mt-2 z-50 will-change-transform"
        >
          <div class="grid grid-cols-4 gap-8 p-6">
            <div v-for="col in item.columns" :key="col.title" class="min-w-[180px]">
              <!-- kolomtitel = bold + klikbaar -->
              <NuxtLink
                :to="col.uri"
                class="block font-semibold text-gray-900 hover:text-primary mb-2"
              >
                {{ col.title }}
              </NuxtLink>

              <ul class="space-y-1">
                <li v-for="(sub, idx) in col.items" :key="sub.uri" class="opacity-0 translate-y-[4px] animate-[fadeUp_.28s_cubic-bezier(0.22,1,0.36,1)_forwards] [animation-delay:calc(var(--i)*16ms)]" :style="{'--i': idx}">
                  <NuxtLink :to="sub.uri" class="text-sm text-gray-600 hover:text-gray-900">
                    {{ sub.label }}
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </transition>
    </li>
  </ul>

  <!-- Skeleton/fallback als er (heel kort) nog geen data is -->
  <ul v-else class="flex items-center gap-6">
    <li v-for="i in 5" :key="i" class="h-5 w-16 rounded bg-gray-100 animate-pulse"></li>
  </ul>
</template>

<style scoped>
.mega-panel-enter-active, .mega-panel-leave-active {
  transition:
    opacity .22s cubic-bezier(0.22,1,0.36,1),
    transform .22s cubic-bezier(0.22,1,0.36,1);
  transform-origin: top center;
  will-change: transform, opacity;
}
.mega-panel-enter-from { opacity: 0; transform: translateY(6px) scale(0.985); }
.mega-panel-leave-to   { opacity: 0; transform: translateY(4px) scale(0.992); }

@keyframes fadeUp { to { opacity: 1; transform: translateY(0) } }
@media (prefers-reduced-motion: reduce) {
  .mega-panel-enter-active, .mega-panel-leave-active { transition: none }
}
</style>
