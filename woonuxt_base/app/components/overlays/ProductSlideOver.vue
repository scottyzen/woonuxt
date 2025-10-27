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
              {{ productData?.name || 'Laden...' }}
            </span>
            <span class="w-6" />
          </div>

          <!-- Loader -->
          <div v-if="fetching" class="flex justify-center items-center flex-1">
            <LoadingIcon class="w-10 h-10 text-primary" />
          </div>

          <!-- Inhoud -->
          <div v-else-if="productData" class="p-4 space-y-4">
            <!-- Afbeeldingen -->
            <ImageGallery :gallery="productData.galleryImages?.nodes || []" />

            <!-- Titel & prijs -->
            <h1 class="text-lg font-bold">{{ productData.name }}</h1>

            <ProductPrice
              :regular-price="productData.regularPrice"
              :sale-price="productData.salePrice"
            />

            <!-- Beschrijving -->
            <div
              v-html="productData.shortDescription || productData.description"
              class="text-sm text-gray-700"
            />

            <!-- Sticky knop-container -->
            <div class="sticky bottom-0 bg-white p-4 z-10 border-t border-gray-200">
              <a
                v-if="productData.externalUrl"
                :href="productData.externalUrl"
                target="_blank"
                rel="noopener"
                class="block w-full text-center bg-primary text-white font-bold py-3 rounded hover:bg-primary-dark transition"
              >
                {{ productData.buttonText || 'Bekijk product' }}
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
import { ref, computed } from 'vue'
import { useQuery, gql } from '@urql/vue'
import ImageGallery from '~/components/ImageGallery.vue'
import LoadingIcon from '~/components/generalElements/LoadingIcon.vue'

const visible = ref(false)
const slug = ref<string | null>(null)
let lastPathBeforeModal = ''
const router = useRouter()

// GraphQL query
const GET_PRODUCT_BY_SLUG = gql`
  query GetProductBySlug($slug: ID!) {
    product(id: $slug, idType: SLUG) {
      id
      name
      description
      shortDescription
      slug
      buttonText
      externalUrl
      regularPrice
      salePrice
      galleryImages {
        nodes {
          sourceUrl
          altText
        }
      }
    }
  }
`

// Query setup
const { data, fetching } = useQuery({
  query: GET_PRODUCT_BY_SLUG,
  variables: computed(() => ({ slug: slug.value })),
  pause: computed(() => !slug.value),
})

const productData = computed(() => data.value?.product ?? null)

// Open modal
function open(productSlug: string) {
  if (process.client) {
    lastPathBeforeModal = window.location.pathname
    document.body.style.overflow = 'hidden'
  }

  visible.value = true
  slug.value = productSlug
}

// Close modal
function close() {
  visible.value = false
  slug.value = null

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
</style>
