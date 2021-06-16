<template>
  <nuxt-link class="text-center" :to="`/product/${node.slug}`">
    <nuxt-img
      class="w-full mb-2"
      :src="node.image.sourceUrl"
      :alt="node.name"
      :title="node.name"
      fit="cover"
      width="136"
      height="136"
      sizes="xs:136px sm:296px md:325px xl:400px"
      loading="lazy"
      quality="80"
    />
    <div class="text-sm">{{ node.name }}</div>
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
