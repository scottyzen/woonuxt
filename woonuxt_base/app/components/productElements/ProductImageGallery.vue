<script setup lang="ts">
import type { ImageFragment, Product, Variation } from '#types/gql';

const { FALLBACK_IMG } = useHelpers();
const { storeSettings } = useAppConfig();

type Gallery = { nodes: ImageFragment[] };
type ThumbnailPosition = 'bottom' | 'left';

const props = defineProps({
  mainImage: { type: Object as PropType<ImageFragment>, required: true },
  gallery: { type: Object as PropType<Gallery>, required: true },
  node: { type: Object as PropType<Product | Variation>, required: true },
  activeVariation: { type: Object as PropType<Variation | null>, default: null },
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

const thumbnailPosition = computed<ThumbnailPosition>(() => (storeSettings.productGalleryThumbnailsPosition === 'left' ? 'left' : 'bottom'));
const showLeftThumbnails = computed(() => thumbnailPosition.value === 'left');

const galleryRootClasses = computed(() => [
  'w-full min-w-0',
  { 'lg:grid lg:grid-cols-[88px_minmax(0,1fr)] lg:items-start lg:gap-4': showLeftThumbnails.value },
]);

const thumbnailListClasses = computed(() => [
  'mt-4 flex gap-3 overflow-auto scrollbar-none p-1 [&::-webkit-scrollbar]:hidden',
  showLeftThumbnails.value ? 'lg:order-first lg:mt-0 lg:max-h-[min(640px,calc(100vh-160px))] lg:w-24 lg:flex-col lg:overflow-x-hidden lg:overflow-y-auto' : '',
]);

const thumbnailButtonClasses = (galleryImg: ImageFragment) => [
  'size-20 shrink-0 overflow-hidden rounded-xl bg-gray-100 ring-offset-2 transition',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
  showLeftThumbnails.value ? 'lg:size-22' : '',
  galleryImg.databaseId === imageToShow.value.databaseId ? 'ring-2 ring-primary' : 'ring-1 ring-gray-200 hover:ring-gray-400',
];
</script>

<template>
  <div :class="galleryRootClasses">
    <div class="relative group aspect-square w-full min-w-0 overflow-hidden rounded-xl bg-gray-100">
      <SaleBadge :node class="absolute text-base top-4 right-4" />
      <NuxtImg
        class="h-full w-full object-contain"
        :width="imgWidth"
        :height="imgWidth"
        sizes="412px:100vw sm:100vw md:50vw lg:50vw xl:640px"
        densities="1x"
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

    <div v-if="gallery.nodes.length" :class="thumbnailListClasses">
      <button
        v-for="galleryImg in galleryImages"
        :key="galleryImg.databaseId"
        :class="thumbnailButtonClasses(galleryImg)"
        type="button"
        :aria-label="`Show image for ${node.name}`"
        :aria-pressed="galleryImg.databaseId === imageToShow.databaseId"
        @click="changeImage(galleryImg)">
        <NuxtImg
          class="h-full w-full object-contain"
          :width="160"
          :height="160"
          :src="galleryImg.sourceUrl || FALLBACK_IMG"
          :alt="galleryImg.altText || node.name"
          placeholder
          placeholder-class="blur-xl"
          loading="lazy" />
      </button>
    </div>
  </div>
</template>
