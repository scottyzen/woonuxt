<script setup lang="ts">
import { navigateTo } from '#app'
import { useCategoryMenu } from '~/composables/useCategoryMenu'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ (e:'update:open', v:boolean): void }>()

const { topMenu } = await useCategoryMenu()

// v-model helper
const isOpen = computed({
  get: () => props.open,
  set: (v: boolean) => emit('update:open', v)
})

// --- helpers ---
function cleanUri (uri: string): string {
  if (!uri) return '/'
  const noPc = uri.replace('/product-category', '').replace(/\/$/, '')
  const parts = noPc.split('/').filter(Boolean)
  return '/' + (parts.pop() || '')
}

// body scroll lock (simpel & effectief)
watch(isOpen, (v) => {
  if (process.client) document.documentElement.style.overflow = v ? 'hidden' : ''
})

// --- layered state ---
type Layer0Item = { label: string; uri: string; columns: Layer1Item[] }
type Layer1Item = { title: string; uri: string; items: Layer2Item[] }
type Layer2Item = { label: string; uri: string }

const layer = ref<0 | 1 | 2>(0)
const sel0 = ref<Layer0Item | null>(null)
const sel1 = ref<Layer1Item | null>(null)

// map composable-structuur generiek
const layer0 = computed<Layer0Item[]>(() =>
  (topMenu.value || []).map(i => ({
    label: i.label,
    uri: i.uri,
    columns: (i.columns || []).map(c => ({
      title: c.title,
      uri: c.uri,
      items: (c.items || []).map(s => ({ label: s.label, uri: s.uri }))
    }))
  }))
)

function openLayer1(item: Layer0Item) {
  sel0.value = item
  sel1.value = null
  layer.value = 1
}

function openLayer2(col: Layer1Item) {
  sel1.value = col
  layer.value = 2
}

function goBack() {
  if (layer.value === 2) { layer.value = 1; sel1.value = null; return }
  if (layer.value === 1) { layer.value = 0; sel0.value = null; return }
  close()
}

function close() {
  isOpen.value = false
  layer.value = 0
  sel0.value = null
  sel1.value = null
}

async function go(url: string) {
  close()
  await navigateTo(cleanUri(url))
}
</script>

<template>
  <!-- overlay -->
  <div v-if="isOpen" class="fixed inset-0 bg-light-500/40 z-40" @click="close" />

  <!-- drawer -->
  <Transition name="slide-left">
    <aside
      v-if="isOpen"
      class="fixed top-0 left-0 h-full w-[80%] max-w-sm bg-white z-50 shadow-xl flex flex-col"
      role="dialog" aria-modal="true" aria-label="Hoofdmenu"
    >
      <!-- header -->
      <div class="h-14 flex items-center gap-2 px-4 border-b border-gray-100">
        <button v-if="layer>0" @click="goBack" class="p-2 text-gray-600 hover:text-gray-900" aria-label="Terug">
          <!-- ArrowLeft -->
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <span class="font-semibold text-gray-900">
          {{ layer===0 ? 'Menu' : layer===1 ? sel0?.label : sel1?.title }}
        </span>
        <button class="ml-auto p-2 text-gray-600 hover:text-gray-900" @click="close" aria-label="Sluiten">✕</button>
      </div>

      <!-- content -->
      <div class="relative flex-1 overflow-hidden">
        <!-- layer 0 -->
        <Transition name="slide-left" mode="out-in">
          <ul v-if="layer===0" key="l0" class="absolute inset-0 overflow-y-auto divide-y divide-gray-100">
            <li v-for="(item, i) in layer0" :key="`l0-${i}`" class="flex items-center">
              <!-- label = naar laag 1 -->
              <button class="flex-1 text-left px-4 py-3 text-gray-800 font-medium"
                      @click="openLayer1(item)">
                {{ item.label }}
              </button>
              <!-- chevron = direct naar /dames etc. -->
              <button class="px-4 py-3 text-gray-500 hover:text-gray-800"
                      :aria-label="`Ga naar ${item.label}`"
                      @click="go(item.uri)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
            </li>
          </ul>
        </Transition>

        <!-- layer 1 -->
        <Transition name="slide-left" mode="out-in">
          <ul v-if="layer===1 && sel0" key="l1" class="absolute inset-0 overflow-y-auto divide-y divide-gray-100">
            <li v-for="(col, i) in sel0.columns" :key="`l1-${i}`" class="flex items-center">
              <!-- label = naar laag 2 -->
              <button class="flex-1 text-left px-4 py-3 text-gray-800 font-medium"
                      @click="openLayer2(col)">
                {{ col.title }}
              </button>
              <!-- chevron = direct naar /kleding etc. -->
              <button class="px-4 py-3 text-gray-500 hover:text-gray-800"
                      :aria-label="`Ga naar ${col.title}`"
                      @click="go(col.uri)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
            </li>
          </ul>
        </Transition>

        <!-- layer 2 -->
        <Transition name="slide-left" mode="out-in">
          <ul v-if="layer===2 && sel1" key="l2" class="absolute inset-0 overflow-y-auto divide-y divide-gray-100">
            <li v-for="(sub, i) in sel1.items" :key="`l2-${i}`">
              <!-- laatste laag: géén chevron, klik = navigate -->
              <button class="w-full text-left px-4 py-3 text-gray-700 hover:text-gray-900"
                      @click="go(sub.uri)">
                {{ sub.label }}
              </button>
            </li>
          </ul>
        </Transition>
      </div>
    </aside>
  </Transition>
</template>

<style scoped>
.slide-left-enter-active, .slide-left-leave-active { transition: transform .25s ease, opacity .25s ease }
.slide-left-enter-from   { transform: translateX(-100%); opacity: .6 }
.slide-left-leave-to     { transform: translateX(-20%);  opacity: 0 }
</style>
