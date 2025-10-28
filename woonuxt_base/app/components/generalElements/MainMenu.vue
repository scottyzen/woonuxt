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

const activeItem = computed(() =>
  openIndex.value !== null ? topMenu.value?.[openIndex.value] : null
)
</script>

<template>
  <div class="relative hidden lg:block">
    <!-- top-level menu -->
    <ul v-if="topMenu?.length" class="flex items-center gap-8">
      <li
        v-for="(item, i) in topMenu"
        :key="item.id"
        @mouseenter="onEnter(i)"
        @mouseleave="onLeave"
        class="relative"
      >
        <NuxtLink
          :to="item.uri"
          class="py-3 px-2 text-gray-800 font-medium hover:text-primary transition"
        >
          {{ item.label }}
        </NuxtLink>
      </li>
    </ul>

    <!-- Mega Menu -->
    <transition name="fade">
      <div
        v-if="activeItem && activeItem.columns?.length"
        class="absolute left-0 top-full w-screen bg-white border-t border-gray-200 shadow-lg z-40"
        @mouseenter="null"
        @mouseleave="onLeave"
      >
        <div class="max-w-[1400px] mx-auto px-10 py-8 grid grid-cols-4 gap-10">
          <div
            v-for="col in activeItem.columns"
            :key="col.title"
            class="text-gray-800"
          >
            <NuxtLink
              :to="col.uri"
              class="block font-semibold mb-3 hover:text-primary"
            >
              {{ col.title }}
            </NuxtLink>

            <ul class="space-y-2">
              <li v-for="sub in col.items" :key="sub.uri">
                <NuxtLink
                  :to="sub.uri"
                  class="block text-sm text-gray-600 hover:text-primary transition"
                >
                  {{ sub.label }}
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(6px);
}
</style>
