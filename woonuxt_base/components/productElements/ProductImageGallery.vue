<script setup lang="ts">
const { fallbackImage } = useHelpers();

const props = defineProps({
  mainImage: { type: Object, required: true },
  gallery: { type: Object, required: true },
  node: { type: Object, required: true },
  activeVariation: { type: Object, required: false },
});

const primaryImage = computed(() => ({
  sourceUrl: props.mainImage.sourceUrl || fallbackImage,
  title: props.mainImage.title,
  altText: props.mainImage.altText,
  databaseId: props.mainImage.databaseId,
}));

const imageToShow = ref(primaryImage.value);

const galleryImages = computed(() => {
  // Add the primary image to the start of the gallery and remove duplicates
  return [primaryImage.value, ...props.gallery.nodes].filter((img, index, self) => index === self.findIndex((t) => t?.databaseId === img?.databaseId));
});

const changeImage = (image: any) => {
  if (image) imageToShow.value = image;
};

watch(
  () => props.activeVariation,
  (newVal) => {
    if (newVal?.image) {
      const foundImage = galleryImages.value.find((img) => img.databaseId === newVal.image?.databaseId);
      if (foundImage) imageToShow.value = foundImage;
    }
  },
);
</script>

<template>
  <div>
    <SaleBadge :node="node" class="absolute text-base top-4 right-4" />
    <NuxtImg
      class="rounded-xl object-contain w-full min-w-[350px]"
      width="640"
      height="640"
      :alt="imageToShow.altText || node.name"
      :title="imageToShow.title || node.name"
      :src="imageToShow.sourceUrl || fallbackImage"
      fetchpriority="high"
      placeholder
      placeholder-class="blur-xl" />
    <div v-if="gallery.nodes.length" class="my-4 gallery-images">
      <NuxtImg
        v-for="galleryImg in galleryImages"
        :key="galleryImg.databaseId"
        class="cursor-pointer rounded-xl"
        width="640"
        height="640"
        :src="galleryImg.sourceUrl"
        :alt="galleryImg.altText || node.name"
        :title="galleryImg.title || node.name"
        @click.native="changeImage(galleryImg)"
        placeholder
        placeholder-class="blur-xl"
        loading="lazy" />
    </div>
  </div>
</template>

<style scoped>
.gallery-images {
  display: flex;
  overflow: auto;
  gap: 1rem;

  &::-webkit-scrollbar {
    display: none;
  }
}

.gallery-images img {
  width: 72px;
  aspect-ratio: 5/6;
  object-fit: cover;
}

@media (min-width: 768px) {
  .gallery-images {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(72px, 1fr));

    img {
      width: 100%;
    }
  }
}
</style>
