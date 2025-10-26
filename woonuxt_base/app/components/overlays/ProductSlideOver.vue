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
          class="relative bg-white w-full sm:max-w-md h-full overflow-auto shadow-xl pointer-events-auto flex flex-col"
        >
          <!-- Header -->
          <div class="flex items-center justify-between p-4 border-b">
            <button class="text-2xl font-light" @click="close">×</button>
            <span class="text-base font-semibold truncate max-w-[60%]">
              {{ product?.name || 'Laden...' }}
            </span>
            <span class="w-6" />
          </div>

          <!-- Loader -->
          <div v-if="loading" class="flex justify-center items-center flex-1">
            <div class="animate-spin h-8 w-8 border-t-2 border-primary mx-auto rounded-full" />
          </div>

          <!-- Inhoud -->
          <div v-else-if="product" class="p-4 space-y-4">
            <p class="text-xs text-gray-500">Aantal afbeeldingen: {{ product.images?.length }}</p>
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

            <!-- Wishlist & Share -->
            <div class="flex flex-wrap gap-3">
              <!-- Wishlist knop -->
              <button
                @click="toggleWishlist"
                class="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition"
              >
                <span v-if="isInWishlist">❤️</span>
                <span v-else>🤍</span>
                Bewaar
              </button>
            
              <!-- Share knop -->
              <button
                @click="shareProduct"
                class="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition"
              >
                🔗 Delen
              </button>
</div>


            <!-- Externe knop -->
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
import ImageGallery from '~/components/ImageGallery.vue'  // ✅ Hier is de import toegevoegd
import WishlistButton from '~/components/productElements/WishlistButton.vue' 
import ShareButton from '~/components/productElements/ShareButton.vue'

  
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

// jp share button
  // Wishlist state (client-side via localStorage)
const isInWishlist = ref(false)

// Controleer of product op wishlist staat
function checkWishlist() {
  if (!process.client || !product.value) return

  const stored = JSON.parse(localStorage.getItem('wishlist') || '[]')
  isInWishlist.value = stored.includes(product.value.id)
}

// Wishlist toggle functie
function toggleWishlist() {
  if (!product.value || !process.client) return

  const stored = JSON.parse(localStorage.getItem('wishlist') || '[]')
  const index = stored.indexOf(product.value.id)

  if (index > -1) {
    stored.splice(index, 1)
    isInWishlist.value = false
  } else {
    stored.push(product.value.id)
    isInWishlist.value = true
  }

  localStorage.setItem('wishlist', JSON.stringify(stored))
}

// Share knop logica
function shareProduct() {
  const url = product.value?.permalink || window.location.href
  const title = product.value?.name || 'Bekijk dit product'

  if (navigator.share) {
    navigator.share({ title, url }).catch((error) => {
      console.error('❌ Delen mislukt:', error)
    })
  } else {
    navigator.clipboard.writeText(url).then(() => {
      alert('🔗 Link gekopieerd naar klembord!')
    }).catch((err) => {
      console.error('❌ Kon link niet kopiëren:', err)
    })
  }
}

  // end

  
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
