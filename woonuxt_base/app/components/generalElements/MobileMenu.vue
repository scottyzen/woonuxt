<script setup lang="ts">
import { useCategoryMenu } from '~/composables/useCategoryMenu'

defineProps<{ open: boolean }>()
const emit = defineEmits(['update:open'])
const { topMenu } = await useCategoryMenu()

const active = ref<number | null>(null)

function close() {
  emit('update:open', false)
  active.value = null
}
</script>

<template>
  <!-- overlay -->
  <div
    v-if="open"
    class="fixed inset-0 bg-black/30 z-40"
    @click="close"
  ></div>

  <!-- drawer -->
  <Transition name="slide">
    <aside
      v-if="open"
      class="fixed top-0 left-0 w-[80%] h-full bg-white z-50 overflow-y-auto"
    >
      <header class="flex items-center justify-between p-4 border-b border-gray-100">
        <span class="font-semibold text-gray-800">Menu</span>
        <button @click="close" class="text-gray-500">✕</button>
      </header>

      <nav class="p-4">
        <ul v-if="!active">
          <li
            v-for="(item, i) in topMenu"
            :key="item.id"
            class="border-b border-gray-100"
          >
            <button
              @click="active = i"
              class="w-full text-left py-3 text-gray-700 font-medium"
            >
              {{ item.label }}
            </button>
          </li>
        </ul>

        <!-- subniveau -->
        <div v-else>
          <button
            class="text-sm text-gray-500 mb-4"
            @click="active = null"
          >
            ← Terug
          </button>

          <div v-if="topMenu[active]">
            <ul class="space-y-4">
              <li
                v-for="col in topMenu[active].columns"
                :key="col.title"
              >
                <NuxtLink
                  :to="col.uri"
                  class="block font-semibold text-gray-900 mb-1"
                  @click="close"
                >
                  {{ col.title }}
                </NuxtLink>
                <ul class="pl-3 space-y-1">
                  <li v-for="sub in col.items" :key="sub.uri">
                    <NuxtLink
                      :to="sub.uri"
                      class="block text-sm text-gray-600 hover:text-primary"
                      @click="close"
                    >
                      {{ sub.label }}
                    </NuxtLink>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </aside>
  </Transition>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
