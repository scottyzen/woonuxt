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
const visible = ref(false)
const loading = ref(false)
const product = ref<any>(null)

function open(productId: number) {
  visible.value = true
  loading.value = true

  // Client-side fetch direct naar WooCommerce API
  $fetch(`https://wp.kledingzoeken.nl/wp-json/wc/v3/products/${productId}`, {
    headers: {
      Authorization: 'Basic ' + btoa('CK_JOUW_PUBLIC_KEY:CS_JOUW_SECRET_KEY'),
    },
  })
    .then((data) => {
      product.value = data
    })
    .finally(() => {
      loading.value = false
    })
}

function close() {
  visible.value = false
  product.value = null
}

defineExpose({ open, close })
</script>


<style scoped>
.slide-enter-active, .slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from, .slide-leave-to {
  transform: translateX(100%);
}
</style>
