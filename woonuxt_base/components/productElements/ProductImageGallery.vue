<script setup lang="ts">
defineProps({
  firstImage: { type: String, required: true },
  mainImage: { type: String, required: true },
  gallery: { type: Object, required: true },
  node: { type: Object, required: true },
});

const imageToShow = ref(0);

const changeImage = (index = 0) => {
  imageToShow.value = index;
};
</script>

<template>
  <div v-if="mainImage" class="-mx-4 md:m-0">
    <SaleBadge :node="node" class="text-base top-4 right-4 absolute" />
    <NuxtImg v-show="imageToShow === null" class="rounded-xl object-contain w-full min-w-[350px]" width="700" height="700" fit="outside" :src="firstImage" fetchpriority="high" />
    <NuxtImg v-show="imageToShow === 0" class="rounded-xl object-contain w-full min-w-[350px]" width="700" height="700" fit="outside" :src="mainImage" fetchpriority="high" />
    <NuxtImg
      v-for="(galleryImg, i) in gallery.nodes"
      v-show="imageToShow === i + 1"
      :key="i"
      class="rounded-xl object-contain w-full min-w-[350px]"
      width="700"
      height="700"
      fit="outside"
      :src="galleryImg.sourceUrl" />
    <div v-if="gallery.nodes.length" class="my-4 gallery-images">
      <NuxtImg class="rounded-xl cursor-pointer" width="110" height="140" :src="firstImage" @click.native="changeImage(null)" />
      <NuxtImg
        v-for="(galleryImg, i) in gallery.nodes"
        :key="i"
        class="rounded-xl cursor-pointer"
        width="110"
        height="140"
        fit="outside"
        :src="galleryImg.sourceUrl"
        @click.native="changeImage(i + 1)" />
    </div>
  </div>
</template>

<style>
.gallery-images {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(72px, 1fr));
  gap: 1rem;
}

.gallery-images img {
  width: 100%;
  object-fit: cover;
  aspect-ratio: 5/6;
}
</style>
