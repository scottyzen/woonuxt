<script setup lang="ts">
import { useCategoryMenu } from '~/composables/useCategoryMenu'

const { topMenu } = await useCategoryMenu()
const openIndex = ref<number | null>(null)
let hoverTimer: ReturnType<typeof setTimeout> | null = null

function onEnter(i: number) {
  if (hoverTimer) clearTimeout(hoverTimer)
  hoverTimer = setTimeout(() => {
    openIndex.value = i
  }, 120)
}

function onLeave() {
  if (hoverTimer) clearTimeout(hoverTimer)
  hoverTimer = setTimeout(() => {
    openIndex.value = null
  }, 160)
}
</script>

<template>
  <ul class="flex items-center gap-6">
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

      <!-- ⚡ GEEN Vue transition meer, enkel CSS -->
      <ClientOnly>
        <div
          v-show="openIndex === i && item.columns.length"
          class="absolute left-0 top-full w-screen max-w-6xl bg-white border border-gray-100 shadow-lg shadow-gray-200 rounded-2xl mt-2 opacity-0 pointer-events-none transition-all duration-200 ease-in-out"
          :class="{ 'opacity-100 pointer-events-auto': openIndex === i }"
        >
          <div class="grid grid-cols-4 gap-8 p-6">
            <div
              v-for="col in item.columns"
              :key="col.title"
              class="min-w-[180px]"
            >
              <NuxtLink
                :to="col.uri"
                class="block font-semibold text-gray-900 hover:text-primary mb-2"
              >
                {{ col.title }}
              </NuxtLink>
              <ul class="space-y-1">
                <li v-for="sub in col.items" :key="sub.uri">
                  <NuxtLink
                    :to="sub.uri"
                    class="text-sm text-gray-600 hover:text-gray-900"
                  >
                    {{ sub.label }}
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </ClientOnly>
    </li>
  </ul>
</template>

<style scoped>
/* optionele fallback fade */
[style*="opacity-100"] {
  transition-property: opacity, transform;
}
</style>
