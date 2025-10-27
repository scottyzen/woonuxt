<template>
  <ClientOnly>
    <div
      v-if="visible"
      class="fixed inset-0 z-50 flex justify-end bg-black/50"
      @click.self="close"
    >
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
            <LoadingIcon size="lg" color="primary" />
          </div>

          <!-- Inhoud -->
          <div v-else-if="product" class="p-4 space-y-4">
            <!-- Afbeeldingen -->
            <ImageGallery :gallery="gallery" />

            <!-- Titel & prijs -->
            <h1 class="text-lg font-bold">{{ product.name }}</h1>

            <ProductPrice
              :regular-price="product?.regularPrice"
              :sale-price="product?.salePrice"
            />

            <!-- Beschrijving -->
            <div
              v-html="product?.shortDescription || product?.description"
              class="text-sm text-gray-700"
            />

            <!-- Sticky knop-container -->
            <div
              class="sticky bottom-0 bg-white p-4 z-10 border-t border-gray-200"
            >
              <a
                v-if="product?.externalUrl"
                :href="product.externalUrl"
                target="_blank"
                rel="noopener"
                class="block w-full text-center bg-primary text-white font-bold py-3 rounded hover:bg-primary-dark transition"
              >
                {{ product?.buttonText || 'Bekijk product' }}
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
import { gql } from 'graphql-tag'
import { useAsyncQuery } from '#imports'
import ImageGallery from '~/components/ImageGallery.vue'
import ProductPrice from '~/components/productElements/ProductPrice.vue'
import LoadingIcon from '~/components/generalElements/LoadingIcon.vue'
import getProductBySlug from '~/graphql/queries/getProductBySlug.gql'

const visible = useState('slideOverVisible', () => false)
const slug = useState<string | null>('slideOverSlug', () => null)
const loading = ref(false)
const product = ref<any | null>(null)
const router = useRouter()
let lastPathBeforeModal = ''

// Map voor ImageGallery
const gallery = computed(() => {
  const nodes = product.value?.galleryImages?.nodes ?? []
  return nodes.map((n: any) => ({
    sourceUrl: n?.sourceUrl,
    altText: n?.altText,
  }))
})

// Watch: als slug wijzigt → laad product
watch(slug, async (newSlug) => {
  if (!newSlug) return
  await open(newSlug)
})

async function open(productSlug: string) {
  if (process.client) {
    lastPathBeforeModal = window.location.pathname
    document.body.style.overflow = 'hidden'
  }

  visible.value = true
  loading.value = true
  product.value = null

  try {
    const { data, error } = await useAsyncQuery(getProductBySlug, { slug: productSlug })
    if (error.value) throw error.value
    product.value = data.value?.product || null
  } catch (err) {
    console.error('❌ GraphQL fout:', err)
  } finally {
    loading.value = false
  }
}

function close() {
  visible.value = false
  slug.value = null
  product.value = null

  if (process.client) {
    document.body.style.overflow = ''
    if (lastPathBeforeModal && router.currentRoute.value.path.startsWith('/p/')) {
      router.push(lastPathBeforeModal)
    }
  }
}
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
</style>
