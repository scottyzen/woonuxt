<script setup lang="ts">
import { useCategoryMenu } from '~/composables/useCategoryMenu'

const { topMenu } = await useCategoryMenu()
const openIndex = ref<number | null>(null)

function onEnter(i: number) {
  openIndex.value = i
}
function onLeave() {
  openIndex.value = null
}
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
        class="py-2 px-2 text-gray-700 hover:text-gray-900 transition"
      >
        {{ item.label }}
      </NuxtLink>

      <!-- Mega menu -->
      <transition name="mega-panel">
        <div
          v-if="openIndex === i && item.columns.length"
          class="absolute left-0 top-full w-full bg-white border-t border-gray-100 shadow-lg z-50"
        >
          <div class="max-w-[1400px] mx-auto px-6 py-6 grid grid-cols-4 gap-8">
            <div v-for="col in item.columns" :key="col.title">
              <NuxtLink
                :to="col.uri"
                class="block font-semibold text-gray-900 mb-2"
              >
                {{ col.title }}
              </NuxtLink>

              <ul class="space-y-1">
                <li v-for="sub in col.items" :key="sub.uri">
                  <NuxtLink :to="sub.uri" class="text-sm text-gray-700 hover:text-gray-900">
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

  <!-- Skeleton als data nog laadt -->
  <ul v-else class="flex items-center gap-6">
    <li v-for="i in 5" :key="i" class="h-5 w-16 rounded bg-gray-100 animate-pulse"></li>
  </ul>
</template>

<style scoped>
.mega-panel-enter-active,
.mega-panel-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
  transform-origin: top;
}
.mega-panel-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.mega-panel-leave-to {
  opacity: 0;
  transform: translateY(6px);
}
</style>
