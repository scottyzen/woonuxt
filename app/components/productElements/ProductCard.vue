<script setup lang="ts">
import type { Product } from '#types/gql';

const props = defineProps({ node: { type: Object as PropType<Product>, required: true }, index: { type: Number, default: 0 } });
const productUrl = computed(() => `/product/${decodeURIComponent(props.node.slug || '')}`);
const image = computed(() => props.node.image?.productCardSourceUrl || props.node.image?.sourceUrl || '/images/placeholder.jpg');
</script>

<template>
  <article class="group relative min-w-0 rounded-2xl bg-white p-2">
    <NuxtLink :to="productUrl" class="relative block aspect-square overflow-hidden rounded-xl bg-[#f5f6f1]">
      <SaleBadge :node class="absolute left-3 top-3" />
      <NuxtImg
        :src="image"
        :alt="node.image?.altText || node.name || 'Plant'"
        width="400"
        height="400"
        :preload="index === 0"
        class="size-full object-cover object-center transition duration-500 group-hover:scale-105" />
    </NuxtLink>
    <div class="px-2 pb-2 pt-4">
      <div class="mb-1 flex items-center justify-between gap-2">
        <span class="text-[11px] font-semibold text-[#779080]">Indoor plant</span>
        <span v-if="Number(node.averageRating) > 0" class="text-xs text-[#e5ad00]">★ <b class="text-[#183724]">{{ node.averageRating }}</b></span>
      </div>
      <NuxtLink :to="productUrl" class="block truncate text-[15px] font-extrabold text-[#183724]">{{ node.name }}</NuxtLink
      ><ProductPrice
        class="mt-1 text-sm font-extrabold text-[#183724]"
        :sale-price="node.salePrice ?? undefined"
        :regular-price="node.regularPrice ?? undefined" />
    </div>
  </article>
</template>
