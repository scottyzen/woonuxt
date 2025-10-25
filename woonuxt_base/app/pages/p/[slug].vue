<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const productSlideOver = inject('productSlideOver')

onMounted(() => {
  const slug = route.params.slug
  if (slug && productSlideOver?.value?.openBySlug) {
    productSlideOver.value.openBySlug(slug as string)
  } else {
    router.replace('/') // fallback als slug niet klopt
  }
})
</script>

<template>
  <!-- Leeg template, alleen bedoeld voor slide-over -->
</template>
