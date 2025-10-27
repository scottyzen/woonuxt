<template>
  <ClientOnly>
    <div
      v-if="visible"
      class="fixed inset-0 z-50 flex justify-end bg-black/50"
      @click.self="close"
    >
      <!-- Slide-in wit paneel -->
      <Transition name="slide-panel">
        <div
          v-show="visible"
          class="relative bg-white w-[90%] sm:max-w-md h-full overflow-auto shadow-xl pointer-events-auto flex flex-col"
        >
          <!-- Header -->
          <div class="flex items-center justify-between p-4 border-b">
            <button class="text-2xl font-light" @click="close">×</button>
            <span class="text-base font-semibold truncate max-w-[60%]">
              {{ product?.name || 'Laden...' }}
            </span>
            <span class="w-6" />
          </div>

          <!-- Loader (originele WooNuxt loader) -->
          <div v-if="loading" class="flex justify-center items-center flex-1">
            <LoadingIcon class="w-10 h-10 text-primary" />
          </div>

          <!-- Inhoud -->
          <div v-else-if="product" class="p-4 space-y-4">
            <!-- Afbeeldingen -->
            <ImageGallery :gallery="product.images" />

            <!-- Titel & prijs -->
            <h1 class="text-lg font-bold">{{ product.name }}</h1>

            <ProductPrice
              :regular-price="product.regular_price"
              :sale-price="product.sale_price"
            />

            <!-- Beschrijving -->
            <div
              v-html="product.short_description || product.description"
              class="text-sm text-gray-700"
            />

            <!-- Sticky knop-container -->
            <div class="sticky bottom-0 bg-white p-4 z-10 border-t border-gray-200">
              <a
                v-if="product.external_url"
                :href="product.external_url"
                target="_blank"
                rel="noopener"
                class="block w-full text-center bg-primary text-white font-bold py-3 rounded hover:bg-primary-dark transition"
              >
                {{ product.button_text || 'Bekijk product' }}
              </a>
            </div>
          </div>

          <!-- Fallback -->
          <div v-else class="p-4 text-center text-gray-500">
            Product niet gevonden.
          </div>
        </div>
      </Transition>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import ImageGallery from '~/components/ImageGallery.vue'
import LoadingIcon from 'woonuxt_base/app/components/generalElements/LoadingIcon.vue'

const config = useRuntimeConfig()
const authHeader = 'Basic ' + btoa(`${config.public.wcKey}:${config.public.wcSecret}`)

const visible = ref(false)
const loading = ref(false)
const product = ref<any | null>(null)

const router = useRouter()
let lastPathBeforeModal = ''

async function open(productId: number) {
  if (process.client) {
    lastPathBeforeModal = window.location.pathname
    document.body.style.overflow = 'hidden'
  }

  visible.value = true
  loading.value = true
  product.value = null

  try {
    const data = await $fetch(`https://wp.kledingzoeken.nl/wp-json/wc/v3/products/${productId}`, {
      headers: { Authorization: authHeader },
    })

    product.value = data
    console.log('🖼️ Product geladen:', data)

    // Extra check als afbeeldingen ontbreken
    if (!Array.isArray(data.images) || data.images.length === 0) {
      console.warn('⚠️ Geen afbeeldingen gevonden voor product:', data)
    }
  } catch (error) {
    console.error('❌ Fout bij ophalen product:', error)
    product.value = null
  } finally {
    loading.value = false
  }
}

function close() {
  visible.value = false
  product.value = null

  if (process.client) {
    document.body.style.overflow = ''
    if (lastPathBeforeModal && router.currentRoute.value.path.startsWith('/p/')) {
      router.push(lastPathBeforeModal)
    }
  }
}

defineExpose({ open, close })
</script>

<style scoped>
/* Alleen witte paneel animeren */
.slide-panel-enter-active,
.slide-panel-leave-active {
  transition: transform 0.3s ease;
}
.slide-panel-enter-from,
.slide-panel-leave-to {
  transform: translateX(100%);
}
</style>
