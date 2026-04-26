<script setup lang="ts">
import type { ImageFragment, Product, Variation } from '#types/gql';

const { FALLBACK_IMG } = useHelpers();

type Gallery = { nodes: ImageFragment[] };

const props = defineProps({
  mainImage: { type: Object as PropType<ImageFragment>, required: true },
  gallery: { type: Object as PropType<Gallery>, required: true },
  node: { type: Object as PropType<Product | Variation>, required: true },
  activeVariation: { type: Object as PropType<Variation | null>, required: false },
});

const primaryImage = computed<ImageFragment>(() => ({
  sourceUrl: props.mainImage.sourceUrl || FALLBACK_IMG,
  title: props.mainImage.title,
  altText: props.mainImage.altText,
  databaseId: props.mainImage.databaseId,
}));

const imageToShow = ref<ImageFragment>(primaryImage.value);

const galleryImages = computed<ImageFragment[]>(() => {
  // Add the primary image to the start of the gallery and remove duplicates
  return [primaryImage.value, ...(props.gallery.nodes || [])].filter((img, index, self) => index === self.findIndex((t) => t?.databaseId === img?.databaseId));
});

const changeImage = (image: ImageFragment) => {
  if (image) imageToShow.value = image;
};

const changeImageByOffset = (offset: number) => {
  const images = galleryImages.value;
  if (images.length <= 1) return false;

  const currentIndex = images.findIndex((image) => image.databaseId === imageToShow.value.databaseId);
  const fallbackIndex = offset > 0 ? 0 : images.length - 1;
  const nextIndex = currentIndex === -1 ? fallbackIndex : (currentIndex + offset + images.length) % images.length;
  const nextImage = images[nextIndex];
  if (nextImage) {
    changeImage(nextImage);
    return true;
  }
  return false;
};

watch(
  () => props.activeVariation,
  (newVal) => {
    if (newVal?.image) {
      const foundImage = galleryImages.value.find((img) => img.sourceUrl && img.sourceUrl === newVal.image?.sourceUrl);
      if (foundImage) imageToShow.value = foundImage;
    }
  },
);

const imgWidth = 640;
</script>

<template>
  <div>
    <div class="relative group">
      <SaleBadge :node class="absolute text-base top-4 right-4" />
      <NuxtImg
        class="rounded-xl object-contain w-full min-w-87.5"
        :width="imgWidth"
        :height="imgWidth"
        :alt="imageToShow.altText || node.name"
        :title="imageToShow.title || node.name"
        :src="imageToShow.sourceUrl || FALLBACK_IMG"
        :preload="{ fetchPriority: 'high' }"
        placeholder
        placeholder-class="blur-xl" />

      <button
        v-if="galleryImages.length > 1"
        class="absolute left-4 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/25 text-gray-900 opacity-0 shadow-md transition-[opacity,background-color,box-shadow] ease-in hover:bg-white/70 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary group-hover:opacity-100"
        type="button"
        :aria-label="`Previous image for ${node.name}`"
        @click="changeImageByOffset(-1)">
        <Icon name="ion:chevron-back-outline" size="24" />
      </button>

      <button
        v-if="galleryImages.length > 1"
        class="absolute right-4 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/25 text-gray-900 opacity-0 shadow-md transition-[opacity,background-color,box-shadow] ease-in hover:bg-white/70 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary group-hover:opacity-100"
        type="button"
        :aria-label="`Next image for ${node.name}`"
        @click="changeImageByOffset(1)">
        <Icon name="ion:chevron-forward-outline" size="24" />
      </button>
    </div>

    <div
      v-if="gallery.nodes.length"
      class="my-4 flex gap-4 overflow-auto [scrollbar-width:none] md:grid md:grid-cols-[repeat(auto-fill,minmax(72px,1fr))] [&::-webkit-scrollbar]:hidden">
      <NuxtImg
        v-for="galleryImg in galleryImages"
        :key="galleryImg.databaseId"
        class="aspect-5/6 w-18 cursor-pointer rounded-xl object-cover md:w-full"
        :width="imgWidth"
        :height="imgWidth"
        :src="galleryImg.sourceUrl || FALLBACK_IMG"
        :alt="galleryImg.altText || node.name"
        :title="galleryImg.title || node.name"
        placeholder
        placeholder-class="blur-xl"
        loading="lazy"
        @click="changeImage(galleryImg)" />
    </div>
  </div>
</template>
