<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { inject, ref, watch, computed } from 'vue'
import type { PropType } from 'vue'
import type { Product } from '~/types/product'

// 🌍 App config
const route = useRoute()
const router = useRouter()
const { storeSettings } = useAppConfig()

// 🧩 Props
const props = defineProps({
  node: { type: Object as PropType<Product>, required: true },
  index: { type: Number, default: 1 },
})

// 📦 Emits
const emit = defineEmits<{ (e: 'open', slug: string): void }>()

// 📸 Afbeeldingsmaten
const imgWidth = 280
const imgHeight = Math.round(imgWidth * 1.125)

// 🎨 Filters (kleurvariaties)
const filterQuery = ref(route.query?.filter as string)
const paColor = ref(
  filterQuery.value?.split('pa_color[')[1]?.split(']')[0]?.split(',') || []
)

// 🔁 Watch filter query veranderingen
watch(
  () => route.query,
  () => {
    filterQuery.value = route.query.filter as string
    paColor.value =
      filterQuery.value?.split('pa_color[')[1]?.split(']')[0]?.split(',') || []
  }
)

// 🖼️ Afbeelding bepalen o.b.v. actieve kleur
const mainImage = computed<string>(
  () =>
    props.node?.image?.producCardSourceUrl ||
    props.node?.image?.sourceUrl ||
    '/images/placeholder.jpg'
)

const imagetoDisplay = computed<string>(() => {
  if (paColor.value.length) {
    const activeColorImage = props.node?.variations?.nodes.filter((variation) => {
      const hasMatchingAttributes = variation.attributes?.nodes.some((attribute) =>
        paColor.value.some((color) => attribute?.value?.includes(color))
      )
      const hasMatchingSlug = paColor.value.some((color) =>
        variation.slug?.includes(color)
      )
      return hasMatchingAttributes || hasMatchingSlug
    })
    if (activeColorImage?.length)
      return (
        activeColorImage[0]?.image?.producCardSourceUrl ||
        activeColorImage[0]?.image?.sourceUrl ||
        mainImage.value
      )
  }
  return mainImage.value
})

// 🧩 Overlay integratie
// (oude inject openProduct behouden voor backwards compat)
const productSlideOver = inject('productSlideOver') as Ref<any> | undefined
function openProduct(id: number, _slug: string) {
  productSlideOver?.value?.open(id)
}

// 🔔 Nieuw event gebaseerd overlay trigger
function openOverlay() {
  emit('open', props.node.slug)
}
</script>

<template>
  <div class="relative group">
    <!-- Klik opent overlay via emit -->
    <a href="#" @click.prevent="openOverlay" :title="node.name">
      <SaleBadge :node class="absolute top-2 right-2" />
      <NuxtImg
        v-if="imagetoDisplay"
        :width="imgWidth"
        :height="imgHeight"
        :src="imagetoDisplay"
        :alt="node.image?.altText || node.name || 'Product image'"
        :title="node.image?.title || node.name"
        :loading="index <= 3 ? 'eager' : 'lazy'"
        :sizes="`sm:${imgWidth / 2}px md:${imgWidth}px`"
        class="rounded-lg object-top object-cover w-full aspect-9/8"
        placeholder
        placeholder-class="blur-xl"
      />
    </a>

    <div class="p-2">
      <StarRating
        v-if="storeSettings.showReviews"
        :rating="node.averageRating"
        :count="node.reviewCount"
      />

      <NuxtLink
        v-if="node.slug"
        :to="`/product/${decodeURIComponent(node.slug)}`"
        :title="node.name"
      >
        <h2 class="mb-2 font-light leading-tight group-hover:text-primary">
          {{ node.name }}
        </h2>
      </NuxtLink>

      <ProductPrice
        class="text-sm"
        :sale-price="node.salePrice"
        :regular-price="node.regularPrice"
      />
    </div>
  </div>
</template>
