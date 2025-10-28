<script setup lang="ts">
  import { navigateTo } from '#app'               // ✅ ADD THIS
import { useCategoryMenu, type MenuItem } from '~/composables/useCategoryMenu'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ (e: 'update:open', v: boolean): void }>()

const { topMenu } = await useCategoryMenu()

const isOpen = computed({
  get: () => props.open,
  set: (v: boolean) => emit('update:open', v)
})

interface LayerCtx {
  title?: string
  items: any[]
}
const history = ref<LayerCtx[]>([])
const current = ref<LayerCtx>({ title: 'Menu', items: topMenu.value })
const direction = ref<'forward' | 'back'>('forward')

function openSubmenu(item: any) {
  const children =
    item.columns ||
    item.children?.nodes?.map((c: any) => ({
      label: c.name,
      uri: c.uri,
      children: c.children?.nodes
    })) ||
    []
  if (!children.length) return navigate(item.uri)

  direction.value = 'forward'
  history.value.push(current.value)
  current.value = { title: item.label || item.name, items: children }
}

function goBack() {
  if (!history.value.length) return close()
  direction.value = 'back'
  const prev = history.value.pop()!
  current.value = prev
}

function navigate(uri: string) {
  isOpen.value = false
  navigateTo(uri)
}

function close() {
  isOpen.value = false
  history.value = []
  current.value = { title: 'Menu', items: topMenu.value }
}
</script>

<template>
  <transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 z-50">
      <div class="absolute inset-0 bg-black/30 backdrop-blur-sm" @click="close" />
      <div
        class="absolute right-0 top-0 h-full w-4/5 max-w-sm bg-white shadow-2xl flex flex-col rounded-l-2xl border border-gray-100"
      >
        <div class="flex items-center gap-2 h-14 px-4 border-b border-gray-100">
          <button
            v-if="history.length"
            @click="goBack"
            class="p-2 rounded hover:bg-gray-100"
          >
            ←
          </button>
          <div class="font-semibold text-gray-900">{{ current.title }}</div>
          <button
            class="ml-auto p-2 rounded hover:bg-gray-100"
            @click="close"
          >
            ✕
          </button>
        </div>

        <div class="relative flex-1 overflow-hidden">
          <transition
            :name="direction === 'forward' ? 'slide-left' : 'slide-right'"
            mode="out-in"
          >
            <ul
              :key="history.length"
              class="absolute inset-0 overflow-y-auto divide-y divide-gray-100"
            >
              <li
                v-for="item in current.items"
                :key="item.uri"
                class="flex justify-between items-center px-4 py-3"
              >
                <NuxtLink
                  :to="item.uri"
                  class="text-gray-900 hover:text-primary transition"
                  @click.native="!item.columns && !item.children && (isOpen=false)"
                >
                  {{ item.label || item.name }}
                </NuxtLink>
                <button
                  v-if="item.columns?.length || item.children?.length"
                  @click="openSubmenu(item)"
                  class="text-gray-400 hover:text-gray-600"
                >
                  ›
                </button>
              </li>
            </ul>
          </transition>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active,.fade-leave-active { transition: opacity .15s ease }
.fade-enter-from,.fade-leave-to { opacity: 0 }

.slide-left-enter-active,.slide-left-leave-active,
.slide-right-enter-active,.slide-right-leave-active {
  transition: transform .25s ease, opacity .25s ease;
}
.slide-left-enter-from { transform: translateX(100%); opacity: 0.5; }
.slide-left-leave-to { transform: translateX(-20%); opacity: 0; }
.slide-right-enter-from { transform: translateX(-20%); opacity: 0.5; }
.slide-right-leave-to { transform: translateX(100%); opacity: 0; }
</style>
