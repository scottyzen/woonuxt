<script setup lang="ts">
import { useCategoryMenu } from '~/composables/useCategoryMenu'

const { topMenu } = await useCategoryMenu()
const openIndex = ref<number | null>(null)
const headerOffset = ref(64)
let closeTimer: NodeJS.Timeout | null = null

onMounted(() => {
  const header = document.querySelector('header')
  if (header) headerOffset.value = header.offsetHeight
})

function openMenu(i: number) {
  if (closeTimer) clearTimeout(closeTimer)
  openIndex.value = i
}

function scheduleClose() {
  closeTimer = setTimeout(() => {
    openIndex.value = null
  }, 180)
}

// 🔧 Slug-correctie
function cleanUri(uri: string): string {
  if (!uri) return '/'
  // verwijder trailing slash + /product-category
  let clean = uri.replace('/product-category', '').replace(/\/$/, '')
  // neem laatste slug uit pad
  const parts = clean.split('/').filter(Boolean)
  const last = parts.pop() || ''
  return '/' + last
}

const activeItem = computed(() =>
  openIndex.value !== null ? topMenu.value?.[openIndex.value] : null
)
</script>

<template>
  <div
    class="relative hidden lg:block"
    @mouseleave="scheduleClose"
    @mouseenter="closeTimer && clearTimeout(closeTimer)"
  >
    <!-- Hoofdmenu -->
    <ul v-if="topMenu?.length" class="flex items-center gap-8">
      <li
        v-for="(item, i) in topMenu"
        :key="item.id"
        class="relative"
        @mouseenter="openMenu(i)"
      >
        <NuxtLink
          :to="cleanUri(item.uri)"
          class="py-3 px-2 text-gray-800 font-medium hover:text-primary transition"
        >
          {{ item.label }}
        </NuxtLink>
      </li>
    </ul>

    <!-- Overlay -->
    <transition name="fade">
      <div
        v-if="activeItem"
        class="fixed inset-0 bg-light-500/40 z-40"
        @click="openIndex = null"
      ></div>
    </transition>

    <!-- Mega-menu -->
    <transition name="fade">
      <div
        v-if="activeItem && activeItem.columns?.length"
        class="mega-menu-panel fixed left-0 w-screen bg-white border-t border-gray-200 shadow-lg z-50"
        :style="{ top: headerOffset + 'px' }"
      >
        <div class="max-w-[1600px] mx-auto px-12 py-10 grid grid-cols-4 gap-12">
          <div
            v-for="col in activeItem.columns"
            :key="col.title"
            class="text-gray-800"
          >
            <NuxtLink
              :to="cleanUri(col.uri)"
              class="block font-semibold mb-3 hover:text-primary"
            >
              {{ col.title }}
            </NuxtLink>

            <ul class="space-y-2">
              <li v-for="sub in col.items" :key="sub.uri">
                <NuxtLink
                  :to="cleanUri(sub.uri)"
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
  transition: opacity 0.25s ease, transform 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(6px);
}
</style>
