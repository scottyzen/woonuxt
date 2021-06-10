<template>
  <nuxt-link :to="`/product/${node.slug}`">
    <img class="w-full" :src="node.image.sourceUrl" width="100" height="100" />
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
