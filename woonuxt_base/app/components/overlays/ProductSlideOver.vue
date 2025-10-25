<template>
  <ClientOnly>
    <Transition name="slide-from-right">
      <div
        v-if="visible"
        class="fixed inset-0 z-50 flex justify-end bg-black/50"
        @click.self="close"
      >
        <div class="w-full sm:max-w-md bg-white h-full overflow-auto p-6 relative">
          <!-- Sluitknop -->
          <button
            class="absolute top-4 right-4 text-gray-500 hover:text-black z-10"
            @click="close"
            aria-label="Sluiten"
          >
            ✕
          </button>

          <!-- Loader -->
          <div v-if="loading" class="flex justify-center items-center h-full">
            <div class="animate-spin h-8 w-8 border-t-2 border-primary mx-auto rounded-full"></div>
          </div>

          <!-- Productgegevens -->
          <div v-else-if="product">
            <div class="space-y-4">
              <!-- Afbeeldingen -->
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

              <!-- Titel en sterren -->
              <div>
                <h1 class="text-xl font-bold mb-2">{{ product.name }}</h1>
                <StarRating
                  :rating="Number(product.average_rating)"
                  :count="product.rating_count"
                />
              </div>

              <!-- Prijs -->
              <ProductPrice
                :regular-price="product.regular_price"
                :sale-price="product.sale_price"
              />

              <!-- Omschrijving -->
              <div v-html="product.short_description || product.description" class="prose" />

              <!-- Toevoegen aan winkelwagen -->
              <div class="flex flex-col gap-4">
                <AddToCartButton
                  :product-id="product.id"
                  class="w-full"
                />
              </div>
            </div>
          </div>

          <!-- Geen product gevonden -->
          <div v-else class="text-center text-gray-500 mt-20">
            Product niet gevonden.
          </div>
        </div>
      </div>
    </Transition>
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
  if (process.client) {
    lastPathBeforeModal = window.location.pathname
  }

  visible.value = true
  loading.value = true
  product.value = null

  $fetch(`https://wp.kledingzoeken.nl/wp-json/wc/v3/products/${productId}`, {
    headers: {
      Authorization: authHeader,
    },
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
  if (process.client) {
    lastPathBeforeModal = window.location.pathname
  }

  visible.value = true
  loading.value = true
  product.value = null

  try {
    const response = await $fetch(`https://wp.kledingzoeken.nl/wp-json/wc/v3/products`, {
      headers: {
        Authorization: authHeader,
      },
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

  // ✅ Ga terug naar vorige route als we via slug kwamen
  if (process.client && lastPathBeforeModal && router.currentRoute.value.path.startsWith('/p/')) {
    router.push(lastPathBeforeModal)
  }
}

defineExpose({ open, close, openBySlug })
</script>
