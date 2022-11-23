<template>
  <div class="md:w-[500px]" v-if="mainImage">
    <SaleBadge :node="node" class="text-base top-4 right-4 absolute" />
    <NuxtImg class="object-contain rounded-2xl w-full min-w-[350px]" width="700" height="700" format="webp" fit="outside" :src="firstImage" v-show="imageToShow === null" />
    <NuxtImg class="object-contain rounded-2xl w-full min-w-[350px]" width="700" height="700" format="webp" fit="outside" :src="mainImage" v-show="imageToShow === 0" />
    <NuxtImg
      class="object-contain rounded-2xl w-full min-w-[350px]"
      width="700"
      height="700"
      format="webp"
      fit="outside"
      v-for="(node, i) in gallery.nodes"
      :key="i"
      :src="node.sourceUrl"
      v-show="imageToShow === i + 1"
    />
    <div v-if="gallery.nodes.length" class="my-4 gallery-images">
      <NuxtImg class="cursor-pointer rounded-2xl" width="110" height="140" format="webp" :src="firstImage" @click.native="changeImage(null)" />
      <NuxtImg
        class="cursor-pointer rounded-2xl"
        width="110"
        height="140"
        fit="outside"
        v-for="(node, i) in gallery.nodes"
        :key="i"
        :src="node.sourceUrl"
        @click.native="changeImage(i + 1)"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imageToShow: 0,
    };
  },
  props: ["firstImage", "mainImage", "gallery", "node"],
  methods: {
    changeImage(index) {
      this.imageToShow = index;
    },
  },
  watch: {
    mainImage(newImage) {
      this.imageToShow = 0;
    },
  },
};
</script>

<style>
.gallery-images {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 1rem;
}

.gallery-images img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
