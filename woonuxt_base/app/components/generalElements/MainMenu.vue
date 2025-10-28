<script setup lang="ts">
import { useCategoryMenu } from '~/composables/useCategoryMenu'

const { topMenu } = await useCategoryMenu()
const openIndex = ref<number | null>(null)

function onEnter(i: number) { openIndex.value = i }
function onLeave() { openIndex.value = null }
</script>

<template>
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
        class="py-2 px-2 text-gray-700 hover:text-primary transition relative after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-primary after:transition-all after:duration-200"
      >
        {{ item.label }}
      </NuxtLink>

      <!-- ✅ Full-width mega menu direct onder header -->
      <transition name="mega-panel">
        <div
          v-if="openIndex === i && item.columns.length"
          class="absolute left-0 top-[calc(100%+1px)] w-full bg-white border-t border-gray-200 shadow-[0_24px_64px_-24px_rgba(0,0,0,.12)] rounded-none z-50"
        >
          <!-- Geen container → echt full width -->
          <div class="px-8 py-8">
            <div class="grid grid-cols-4 gap-8 max-w-[1400px] mx-auto">
              <div v-for="col in item.columns" :key="col.title">
                <!-- level 1 titel -->
                <NuxtLink
                  :to="col.uri"
                  class="block font-semibold text-gray-900 hover:text-primary mb-3 relative after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-primary after:transition-all after:duration-200"
                >
                  {{ col.title }}
                </NuxtLink>

                <!-- level 2 items -->
                <ul class="space-y-1">
                  <li v-for="sub in col.items" :key="sub.uri">
                    <NuxtLink
                      :to="sub.uri"
                      class="text-sm text-gray-900 hover:text-primary relative after:absolute after:left-0 after:bottom-0 after:h-[1px] after:w-0 hover:after:w-full after:bg-primary after:transition-all after:duration-200"
                    >
                      {{ sub.label }}
                    </NuxtLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </li>
  </ul>

  <ul v-else class="flex items-center gap-6">
    <li v-for="i in 5" :key="i" class="h-5 w-16 rounded bg-gray-100 animate-pulse"></li>
  </ul>
</template>

<style scoped>
.mega-panel-enter-active,
.mega-panel-leave-active {
  transition:
    opacity 0.22s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.22s cubic-bezier(0.22, 1, 0.36, 1);
  transform-origin: top center;
}
.mega-panel-enter-from {
  opacity: 0;
  transform: translateY(6px) scale(0.985);
}
.mega-panel-leave-to {
  opacity: 0;
  transform: translateY(4px) scale(0.992);
}
</style>
