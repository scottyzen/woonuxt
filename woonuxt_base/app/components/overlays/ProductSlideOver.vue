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

          <!-- 🔄 Loader (WooNuxt-stijl) -->
          <transition name="fade" mode="out-in">
            <div
              v-if="showLoader"
              key="loader"
              class="flex justify-center items-center flex-1 min-h-[300px]"
            >
              <LoadingIcon class="animate-spin h-8 w-8 text-primary" />
            </div>

            <!-- 🧩 Inhoud -->
            <div
              v-else-if="product"
              key="content"
              class="p-4 space-y-4 animate-fadeIn"
            >
              <!-- Afbeelding of galerij -->
              <template v-if="product">
                <ImageGallery
                  v-if="product?.galleryImages?.nodes?.length"
                  :gallery="product.galleryImages?.nodes"
                  :image="product.image"
                  :featured-image="product.featuredImage?.node"
                  :external-product="product"
                />
                <img
                  v-else
                  :src="
                    product?.image?.sourceUrl ||
                    product?.featuredImage?.node?.sourceUrl ||
                    '/images/placeholder.jpg'
                  "
                  :alt="product?.image?.altText || product?.name || 'Product afbeelding'"
                  class="rounded-lg object-contain w-full aspect-square"
                />
              </template>

              <!-- Titel & prijs -->
              <h1 class="text-lg font-bold">{{ product.name }}</h1>

              <ProductPrice
                :regular-price="product.regularPrice"
                :sale-price="product.salePrice"
              />

              <!-- Beschrijving -->
              <div
                v-html="product.shortDescription || product.description"
                class="text-sm text-gray-700"
              />

              <!-- Knop voor externe producten -->
              <div
                class="sticky bottom-0 bg-white p-4 z-10 border-t border-gray-200"
                v-if="product.externalUrl"
              >
                <a
                  :href="product.externalUrl"
                  target="_blank"
                  rel="sponsored noopener noreferrer"
                  class="block w-full text-center bg-primary text-white font-bold py-3 rounded hover:bg-primary-dark transition"
                >
                  {{ product.buttonText || 'Bekijk product' }}
                </a>
              </div>
            </div>

            <!-- ❌ Fallback -->
            <div v-else key="fallback" class="p-4 text-center text-gray-500">
              Product niet gevonden...
            </div>
          </transition>
        </div>
      </Transition>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import ImageGallery from '~/components/ImageGallery.vue'

// 🔹 Refs
const visible = ref(false)
const loading = ref(false)
const product = ref<any | null>(null)

// 🔹 Computed loader-state (zoals bij My Account)
const showLoader = computed(() => loading.value || !product.value)

const router = useRouter()
let lastPathBeforeModal = ''

// 🔹 Open modal & laad product
async function open(_id: number, slug: string) {
  if (process.client) {
    lastPathBeforeModal = window.location.pathname
    document.body.style.overflow = 'hidden'
  }

  visible.value = true
  loading.value = true
  product.value = null

  try {
    const { data, error } = await useAsyncGql('getProduct', { slug })
    if (error.value) {
      console.error('❌ Fout bij ophalen product:', error.value)
      product.value = null
    } else {
      product.value = data.value?.product
      console.log('🧩 Product geladen via slug:', slug, product.value)
    }
  } catch (err) {
    console.error('❌ Onverwachte fout:', err)
    product.value = null
  } finally {
    loading.value = false
  }
}

// 🔹 Sluit modal
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
.slide-panel-enter-active,
.slide-panel-leave-active {
  transition: transform 0.3s ease;
}
.slide-panel-enter-from,
.slide-panel-leave-to {
  transform: translateX(100%);
}

/* Fade in/out voor loader */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
</style>
