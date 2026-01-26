<script setup lang="ts">
const route = useRoute();
const { storeSettings } = useAppConfig();

const props = defineProps({
  node: { type: Object as PropType<Product>, required: true },
  index: { type: Number, default: 1 },
});

type ProductImage = {
  src: string;
  alt: string;
  title: string;
  key: string;
};

const imgWidth = 280;
const imgHeight = Math.round(imgWidth * 1.125);

// example: ?filter=pa_color[green,blue],pa_size[large]
const paColor = computed(() => (route.query?.filter as string | undefined)?.split('pa_color[')[1]?.split(']')[0]?.split(',') || []);
const placeholderImage = '/images/placeholder.jpg';

const sliderRef = ref<HTMLElement | null>(null);
const currentSlide = ref(0);

const mainImage = computed<string>(() => props.node?.image?.producCardSourceUrl || props.node?.image?.sourceUrl || placeholderImage);

const matchesSelectedColor = (variation: any) => {
  if (!paColor.value.length) return false;
  const hasMatchingAttributes = variation.attributes?.nodes?.some((attribute: any) => paColor.value.some((color) => attribute?.value?.includes(color)));
  const hasMatchingSlug = paColor.value.some((color) => variation.slug?.includes(color));
  return hasMatchingAttributes || hasMatchingSlug;
};

const sliderImages = computed<ProductImage[]>(() => {
  const images: ProductImage[] = [];
  const seen = new Set<string>();
  const addImage = (image: ProductImage) => {
    if (!image?.src || seen.has(image.src)) return;
    seen.add(image.src);
    images.push(image);
  };
  const addVariationImage = (variation: any) => {
    const src = variation?.image?.producCardSourceUrl || variation?.image?.sourceUrl;
    addImage({
      src,
      alt: variation?.image?.altText || props.node?.name || 'Product image',
      title: variation?.image?.title || props.node?.name || 'Product image',
      key: `variation-${variation?.databaseId || src}`,
    });
  };
  const addGalleryImage = (image: any) => {
    addImage({
      src: image?.sourceUrl,
      alt: image?.altText || props.node?.name || 'Product image',
      title: image?.title || props.node?.name || 'Product image',
      key: `gallery-${image?.databaseId || image?.sourceUrl}`,
    });
  };

  const variations = props.node?.variations?.nodes || [];
  const gallery = props.node?.galleryImages?.nodes || [];
  const main = {
    src: mainImage.value,
    alt: props.node?.image?.altText || props.node?.name || 'Product image',
    title: props.node?.image?.title || props.node?.name || 'Product image',
    key: `main-${props.node?.image?.databaseId || mainImage.value}`,
  };

  if (paColor.value.length) {
    const matching = variations.filter(matchesSelectedColor);
    if (matching.length) {
      if (matching.some((variation) => (variation?.image?.producCardSourceUrl || variation?.image?.sourceUrl) === main.src)) {
        addImage(main);
      }
      matching.forEach(addVariationImage);
      return images;
    }
  }

  if (main.src !== placeholderImage || (!variations.length && !gallery.length)) {
    addImage(main);
  }

  variations.forEach(addVariationImage);
  gallery.forEach(addGalleryImage);

  return images;
});

const activeVariationImageSrc = computed<string | null>(() => {
  if (!paColor.value.length) return null;
  const activeColorImage = props.node?.variations?.nodes.filter((variation) => matchesSelectedColor(variation));
  if (activeColorImage?.length) return activeColorImage[0]?.image?.producCardSourceUrl || activeColorImage[0]?.image?.sourceUrl || null;
  return null;
});

const activeImageIndex = computed<number>(() => {
  if (!activeVariationImageSrc.value) return 0;
  const index = sliderImages.value.findIndex((image) => image.src === activeVariationImageSrc.value);
  return index >= 0 ? index : 0;
});

const updateCurrentSlide = () => {
  const container = sliderRef.value;
  if (!container) return;
  const firstSlide = container.querySelector('.product-card-slide') as HTMLElement | null;
  const slideWidth = firstSlide?.offsetWidth || container.clientWidth;
  const styles = getComputedStyle(container);
  const gap = parseFloat(styles.columnGap || styles.gap || '0');
  const stride = slideWidth + gap;
  const index = stride ? Math.round(container.scrollLeft / stride) : 0;
  currentSlide.value = Math.min(Math.max(index, 0), Math.max(sliderImages.value.length - 1, 0));
};

const scrollToSlide = (index: number) => {
  const container = sliderRef.value;
  if (!container) return;
  const target = container.querySelector(`[data-index="${index}"]`) as HTMLElement | null;
  target?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
};

watch(
  () => [activeImageIndex.value, sliderImages.value.length],
  () => {
    nextTick(() => {
      const container = sliderRef.value;
      if (!container?.children?.length) return;
      const target = container.querySelector(`[data-index="${activeImageIndex.value}"]`) as HTMLElement | null;
      target?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      currentSlide.value = activeImageIndex.value;
    });
  },
  { immediate: true },
);
</script>

<template>
  <div class="relative group">
    <div class="block relative">
      <SaleBadge :node class="absolute top-2 right-2 z-10" />
      <div
        ref="sliderRef"
        class="no-slider flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth touch-pan-x overscroll-x-contain overscroll-y-auto [-webkit-overflow-scrolling:touch]"
        @scroll.passive="updateCurrentSlide">
        <template v-for="(image, slideIndex) in sliderImages" :key="image.key">
          <NuxtLink
            v-if="node.slug"
            class="product-card-slide block flex-[0_0_100%] snap-start snap-always aspect-8/9 overflow-hidden rounded-lg"
            :data-index="slideIndex"
            :to="`/product/${decodeURIComponent(node.slug)}`">
            <NuxtImg
              :width="imgWidth"
              :height="imgHeight"
              :src="image.src"
              :alt="image.alt"
              :title="image.title"
              :loading="slideIndex === 0 && index <= 3 ? 'eager' : 'lazy'"
              :sizes="`sm:${imgWidth / 2}px md:${imgWidth}px`"
              class="rounded-lg object-top object-cover w-full h-full"
              placeholder
              placeholder-class="blur-xl" />
          </NuxtLink>
          <div v-else class="product-card-slide block flex-[0_0_100%] snap-start snap-always aspect-8/9 overflow-hidden rounded-lg" :data-index="slideIndex">
            <NuxtImg
              :width="imgWidth"
              :height="imgHeight"
              :src="image.src"
              :alt="image.alt"
              :title="image.title"
              :loading="slideIndex === 0 && index <= 3 ? 'eager' : 'lazy'"
              :sizes="`sm:${imgWidth / 2}px md:${imgWidth}px`"
              class="rounded-lg object-top object-cover w-full h-full"
              placeholder
              placeholder-class="blur-xl" />
          </div>
        </template>
      </div>
      <div v-if="sliderImages.length > 1" class="absolute bottom-2 flex gap-1 justify-self-center">
        <button
          v-for="(image, dotIndex) in sliderImages"
          :key="`dot-${image.key}`"
          class="product-card-dot rounded-full h-1.5 w-1.5 transition-colors cursor-pointer"
          :class="dotIndex === currentSlide ? 'bg-white' : 'bg-gray-400/60'"
          type="button"
          tabindex="-1"
          :aria-label="`View image ${dotIndex + 1} of ${sliderImages.length}`"
          @click="scrollToSlide(dotIndex)" />
      </div>
    </div>
    <div class="p-2">
      <StarRating v-if="storeSettings.showReviews" :rating="node.averageRating" :count="node.reviewCount" />
      <NuxtLink v-if="node.slug" :to="`/product/${decodeURIComponent(node.slug)}`" :title="node.name">
        <h2 class="mb-2 font-light leading-tight text-gray-900 dark:text-gray-200 group-hover:text-primary">{{ node.name }}</h2>
      </NuxtLink>
      <ProductPrice class="text-sm" :sale-price="node.salePrice" :regular-price="node.regularPrice" />
    </div>
  </div>
</template>
