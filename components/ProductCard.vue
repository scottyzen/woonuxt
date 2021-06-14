<template>
  <nuxt-link class="text-center" :to="`/product/${node.slug}`">
    <nuxt-img
      class="w-full mb-2"
      :src="node.image.sourceUrl"
      format="webp"
      fit="cover"
      width="200"
      provider="static"
      height="200"
      sizes="xs:136px sm:296px md:376px lg:400px"
      loading="lazy"
      quality="90"
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
