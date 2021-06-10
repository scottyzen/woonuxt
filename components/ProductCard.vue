<template>
  <nuxt-link :to="`/product/${node.slug}`">
    <nuxt-img
      class="w-full"
      :src="node.image.sourceUrl"
      width="300"
      height="300"
      format="webp"
      fit="cover"
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
