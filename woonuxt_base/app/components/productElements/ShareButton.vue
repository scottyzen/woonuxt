<script setup lang="ts">
const props = defineProps({
  product: { type: Object, required: true },
});

const isOpen = ref(false);

const twitterUrl = computed(() => `https://twitter.com/intent/tweet?text=${props.product.name}&url=${window.location.href}`);
const facebookUrl = computed(() => `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`);
const pinterestUrl = computed(
  () => `https://pinterest.com/pin/create/button/?url=${window.location.href}&media=${props.product.image.sourceUrl}&description=${props.product.name}`,
);

const showShare = () => {
  isOpen.value = true;
};
</script>

<template>
  <Transition name="fade" mode="out-in">
    <button type="button" v-if="!isOpen" class="flex items-center gap-2 mt-4 text-sm text-gray-400 cursor-pointer" @click="showShare">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="18" height="18">
        <circle cx="128" cy="256" r="48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" />
        <circle cx="384" cy="112" r="48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" />
        <circle cx="384" cy="400" r="48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" />
        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M169.83 279.53l172.34 96.94M342.17 135.53l-172.34 96.94" />
      </svg>
      <span>{{ $t('messages.general.share') }}</span>
    </button>
    <div v-else class="flex items-center gap-2 mt-4 text-sm text-gray-400 cursor-pointer">
      <!-- Twitter -->
      <a :href="twitterUrl" target="_blank" title="Share on Twitter">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="18" height="18" fill="currentColor">
          <path
            d="M496 109.5a201.8 201.8 0 01-56.55 15.3 97.51 97.51 0 0043.33-53.6 197.74 197.74 0 01-62.56 23.5A99.14 99.14 0 00348.31 64c-54.42 0-98.46 43.4-98.46 96.9a93.21 93.21 0 002.54 22.1 280.7 280.7 0 01-203-101.3A95.69 95.69 0 0036 130.4c0 33.6 17.53 63.3 44 80.7A97.5 97.5 0 0135.22 199v1.2c0 47 34 86.1 79 95a100.76 100.76 0 01-25.94 3.4 94.38 94.38 0 01-18.51-1.8c12.51 38.5 48.92 66.5 92.05 67.3A199.59 199.59 0 0139.5 405.6a203 203 0 01-23.5-1.4A278.68 278.68 0 00166.74 448c181.36 0 280.44-147.7 280.44-275.8 0-4.2-.11-8.4-.31-12.5A198.48 198.48 0 00496 109.5z" />
        </svg>
      </a>
      <!-- Facebook -->
      <a :href="facebookUrl" target="_blank" title="Share on Facebook">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="18" height="18" fill="currentColor">
          <path
            d="M480 257.35c0-123.7-100.3-224-224-224s-224 100.3-224 224c0 111.8 81.9 204.47 189 221.29V322.12h-56.89v-64.77H221V208c0-56.13 33.45-87.16 84.61-87.16 24.51 0 50.15 4.38 50.15 4.38v55.13H327.5c-27.81 0-36.51 17.26-36.51 35v42h62.12l-9.92 64.77H291v156.54c107.1-16.81 189-109.48 189-221.31z"
            fill-rule="evenodd" />
        </svg>
      </a>
      <!-- Pinterest -->
      <a :href="pinterestUrl" target="_blank" title="Share on Pinterest">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="18" height="18" fill="currentColor">
          <path
            d="M256.05 32c-123.7 0-224 100.3-224 224 0 91.7 55.2 170.5 134.1 205.2-.6-15.6-.1-34.4 3.9-51.4 4.3-18.2 28.8-122.1 28.8-122.1s-7.2-14.3-7.2-35.4c0-33.2 19.2-58 43.2-58 20.4 0 30.2 15.3 30.2 33.6 0 20.5-13.1 51.1-19.8 79.5-5.6 23.8 11.9 43.1 35.4 43.1 42.4 0 71-54.5 71-119.1 0-49.1-33.1-85.8-93.2-85.8-67.9 0-110.3 50.7-110.3 107.3 0 19.5 5.8 33.3 14.8 43.9 4.1 4.9 4.7 6.9 3.2 12.5-1.1 4.1-3.5 14-4.6 18-1.5 5.7-6.1 7.7-11.2 5.6-31.3-12.8-45.9-47-45.9-85.6 0-63.6 53.7-139.9 160.1-139.9 85.5 0 141.8 61.9 141.8 128.3 0 87.9-48.9 153.5-120.9 153.5-24.2 0-46.9-13.1-54.7-27.9 0 0-13 51.6-15.8 61.6-4.7 17.3-14 34.5-22.5 48a225.13 225.13 0 0063.5 9.2c123.7 0 224-100.3 224-224S379.75 32 256.05 32z" />
        </svg>
      </a>
    </div>
  </Transition>
</template>
