<script setup lang="ts">
const props = defineProps({
  product: { type: Object, required: true },
});

const isOpen = ref(false);
const requestUrl = useRequestURL();
const currentUrl = computed(() => requestUrl.href);
const encodedProductName = computed(() => encodeURIComponent(props.product.name || ''));
const encodedCurrentUrl = computed(() => encodeURIComponent(currentUrl.value));
const encodedImageUrl = computed(() => encodeURIComponent(props.product.image?.sourceUrl || ''));

const xShareUrl = computed(() => `https://twitter.com/intent/tweet?text=${encodedProductName.value}&url=${encodedCurrentUrl.value}`);
const facebookUrl = computed(() => `https://www.facebook.com/sharer/sharer.php?u=${encodedCurrentUrl.value}`);
const pinterestUrl = computed(
  () => `https://pinterest.com/pin/create/button/?url=${encodedCurrentUrl.value}&media=${encodedImageUrl.value}&description=${encodedProductName.value}`,
);

const showShare = () => {
  isOpen.value = true;
};
</script>

<template>
  <Transition name="fade" mode="out-in">
    <button v-if="!isOpen" type="button" class="flex items-center gap-2 mt-4 text-sm text-gray-400 cursor-pointer" @click="showShare">
      <Icon name="ion:share-social-outline" size="18" />
      <span>{{ $t('general.share') }}</span>
    </button>
    <div v-else class="flex items-center gap-2 mt-4 text-sm text-gray-400 cursor-pointer">
      <a :href="xShareUrl" target="_blank" rel="noopener noreferrer" title="Share on X">
        <Icon name="ion:logo-x" size="18" />
      </a>
      <a :href="facebookUrl" target="_blank" rel="noopener noreferrer" title="Share on Facebook">
        <Icon name="ion:logo-facebook" size="18" />
      </a>
      <a :href="pinterestUrl" target="_blank" rel="noopener noreferrer" title="Share on Pinterest">
        <Icon name="ion:logo-pinterest" size="18" />
      </a>
    </div>
  </Transition>
</template>
