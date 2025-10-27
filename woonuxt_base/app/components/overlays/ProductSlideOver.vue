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

          <!-- Loader -->
          <div v-if="loading" class="flex justify-center items-center flex-1">
            <div class="animate-spin h-8 w-8 border-t-2 border-primary mx-auto rounded-full" />
          </div>

          <!-- Inhoud -->
          <div v-else-if="product" class="p-4 space-y-4">
            <!-- Afbeeldingen -->
            <ImageGallery :gallery="product.galleryImages?.nodes || []" />




            <!-- Titel & prijs -->
            <h1 class="text-lg font-bold">{{ product.name }}</h1>

            <ProductPrice
              :regular-price="product.regularPrice"
              :sale-price="product.salePrice"
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
            Product niet gevonden..
          </div>
        </div>
      </Transition>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import ImageGallery from '~/components/ImageGallery.vue'
import GetProductBySlug from '~/woonuxt_base/app/queries/getProductBySlug.gql'


const visible = ref(false)
const loading = ref(false)
const product = ref<any | null>(null)

const { client } = useApollo() // Woonuxt/Apollo GraphQL client
const router = useRouter()
let lastPathBeforeModal = ''

// ⬇️ Slug gebruiken i.p.v. id
async function open(_id: number, slug: string) {
  if (process.client) {
    lastPathBeforeModal = window.location.pathname
    document.body.style.overflow = 'hidden'
  }

  visible.value = true
  loading.value = true
  product.value = null

  try {
    const { data } = await client.query({
      query: GetProductBySlug,
      variables: { slug },
      fetchPolicy: 'no-cache',
    })

    product.value = data?.product
    console.log('🧩 Product geladen via slug:', slug, product.value)
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
