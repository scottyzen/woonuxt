<template>
  <ClientOnly>
    <div
      v-if="visible"
      class="fixed inset-0 z-50 flex justify-end bg-black/50"
      @click.self="close"
    >
      <!-- Slide-in wit paneel -->
      <Transition name="slide">
        <div
          v-show="visible"
          class="relative bg-white w-full sm:max-w-md h-full overflow-auto shadow-xl pointer-events-auto flex flex-col"
        >
          <!-- Header -->
          <div class="flex items-center justify-between p-4 border-b">
            <button class="text-2xl font-light" @click="close">×</button>
            <span class="text-base font-semibold truncate max-w-[60%]">
              {{ product?.name || 'Product' }}
            </span>
            <span class="w-6" />
          </div>

          <!-- Loader -->
          <div v-if="loading" class="flex justify-center items-center flex-1">
            <div class="animate-spin h-8 w-8 border-t-2 border-primary mx-auto rounded-full" />
          </div>

          <!-- Inhoud -->
          <div v-else-if="product" class="p-4 space-y-4">
            <ProductImageGallery
              v-if="product.image"
              :main-image="product.image"
              :gallery="product.gallery_images"
              :node="product"
            />
            <img
              v-else
              src="/images/placeholder.jpg"
              alt="Geen afbeelding"
              class="w-full rounded-lg"
            />

            <h1 class="text-lg font-bold">{{ product.name }}</h1>

            <ProductPrice
              :regular-price="product.regular_price"
              :sale-price="product.sale_price"
            />

            <div
              v-html="product.short_description || product.description"
              class="text-sm text-gray-700"
            />

            <div class="flex flex-wrap gap-3">
              <WishlistButton :product="product" />
              <ShareButton :product="product" />
            </div>

            <a
              v-if="product.external_url"
              :href="product.external_url"
              target="_blank"
              rel="noopener"
              class="block w-full mt-6 text-center bg-primary text-white font-bold py-3 rounded hover:bg-primary-dark transition"
            >
              {{ product.button_text || 'Bekijk product' }}
            </a>
          </div>

          <div v-else class="p-4 text-center text-gray-500">
            Product niet gevonden.
          </div>
        </div>
      </Transition>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const authHeader = 'Basic ' + btoa(`${config.public.wcKey}:${config.public.wcSecret}`)

const visible = ref(false)
const loading = ref(false)
const product = ref<any | null>(null)

const router = useRouter()
let lastPathBeforeModal = ''

function open(productId: number) {
  if (process.client) lastPathBeforeModal = window.location.pathname

  visible.value = true
  loading.value = true
  product.value = null

  $fetch(`https://wp.kledingzoeken.nl/wp-json/wc/v3/products/${productId}`, {
    headers: { Authorization: authHeader },
  })
    .then((data) => {
      product.value = data
    })
    .catch((error) => {
      console.error('❌ Fout bij ophalen product:', error)
      product.value = null
    })
    .finally(() => {
      loading.value = false
    })
}

async function openBySlug(slug: string) {
  if (process.client) lastPathBeforeModal = window.location.pathname

  visible.value = true
  loading.value = true
  product.value = null

  try {
    const response = await $fetch(`https://wp.kledingzoeken.nl/wp-json/wc/v3/products`, {
      headers: { Authorization: authHeader },
      params: { slug },
    })

    if (Array.isArray(response) && response.length > 0) {
      product.value = response[0]
    } else {
      console.warn('❌ Geen product gevonden voor slug:', slug)
      product.value = null
    }
  } catch (error) {
    console.error('❌ Fout bij ophalen product via slug:', error)
    product.value = null
  } finally {
    loading.value = false
  }
}

function close() {
  visible.value = false
  product.value = null

  if (process.client && lastPathBeforeModal && router.currentRoute.value.path.startsWith('/p/')) {
    router.push(lastPathBeforeModal)
  }
}

defineExpose({ open, close, openBySlug })
</script>

<style scoped>
/* Alleen witte paneel animeren */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
