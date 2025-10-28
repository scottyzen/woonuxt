<script setup lang="ts">
import { useCategoryMenu } from '~/composables/useCategoryMenu'

const { topMenu } = await useCategoryMenu()
const openIndex = ref<number | null>(null)

// hoogte van de header (wordt berekend in mounted)
const headerOffset = ref(64)

onMounted(() => {
  const header = document.querySelector('header')
  if (header) headerOffset.value = header.offsetHeight
})

function onEnter(i: number) {
  openIndex.value = i
}
function onLeave(e: MouseEvent) {
  const target = e.relatedTarget as HTMLElement | null
  if (target && target.closest('.mega-menu-panel')) return
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


     <!-- Overlay (Woonuxt-style) -->
    <transition name="fade">
      <div
        v-if="activeItem"
        class="fixed inset-0 bg-light-500/40 backdrop-blur-sm z-40"
        @mouseenter="null"
        @mouseleave="onLeave"
      ></div>
    </transition>
    

    <!-- Full-width Mega Menu Panel -->
    <transition name="fade">
      <div
        v-if="activeItem && activeItem.columns?.length"
        class="mega-menu-panel fixed left-0 w-screen bg-white border-t border-gray-200 shadow-lg z-50"
        :style="{ top: headerOffset + 'px' }"
        @mouseenter="null"
        @mouseleave="onLeave"
      >
        <div class="max-w-[1600px] mx-auto px-12 py-10 grid grid-cols-4 gap-12">
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
