<template>
  <nuxt-link class="text-center" :to="`/product/${node.slug}`">
    <nuxt-img
      class="w-full mb-2"
      :src="node.image.sourceUrl"
      format="webp"
      fit="cover"
      width="200"
      height="200"
      loading="lazy"
    />
    <h3 class="text-sm">{{ node.name }}</h3>
    <strong>{{ node.price }}</strong>
  </nuxt-link>
</template>

<script>
export default {
  props: {
    node: {
      type: Object,
      default: null,
    },
  },
}
</script>
