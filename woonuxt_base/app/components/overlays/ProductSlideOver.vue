<template>
  <ClientOnly>
    <Transition name="slide">
      <div
        v-if="visible && product"
        class="fixed inset-0 z-50 flex justify-end bg-black/50"
        @click.self="close"
      >
        <div class="w-full sm:max-w-xl bg-white h-full overflow-auto p-6">
          <button class="text-gray-500 hover:text-black" @click="close">✕</button>

          <div v-if="loading" class="mt-4 text-center">Laden...</div>

          <div v-else-if="product">
            <h1 class="text-xl font-bold mb-2">{{ product.name }}</h1>
            <div v-html="product.description" class="prose"></div>
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
const product = ref<any>(null)

const router = useRouter()

async function open(productId: number) {
  visible.value = true
  loading.value = true

  try {
    const data = await $fetch(`https://wp.kledingzoeken.nl/wp-json/wc/v3/products/${productId}`, {
      headers: {
        Authorization: authHeader,
      },
    })
    product.value = data
  } catch (error) {
    console.error('❌ Fout bij ophalen product:', error)
  } finally {
    loading.value = false
  }
}

// ✅ Nieuw: open op basis van slug
// Nieuw: ophalen via slug i.p.v. ID
async function openBySlug(slug: string) {
  visible.value = true
  loading.value = true

  try {
    const response = await $fetch(`https://wp.kledingzoeken.nl/wp-json/wc/v3/products`, {
      headers: {
        Authorization: authHeader,
      },
      params: {
        slug, // zoeken op slug
      },
    })

    if (Array.isArray(response) && response.length > 0) {
      product.value = response[0]
    } else {
      console.error('❌ Geen product gevonden voor slug:', slug)
      close()
    }
  } catch (error) {
    console.error('❌ Fout bij ophalen product via slug:', error)
    close()
  } finally {
    loading.value = false
  }
}

function close() {
  visible.value = false
  product.value = null
  router.push('/', undefined, { shallow: true })
}

defineExpose({ open, close, openBySlug })
</script>


<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
