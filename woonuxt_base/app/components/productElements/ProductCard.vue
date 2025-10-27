<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, watch, computed } from 'vue'
import type { PropType } from 'vue'
import type { Product } from '~/types/product'

// 🌍 App config
const { storeSettings } = useAppConfig()

// 🧩 Props
const props = defineProps({
  node: { type: Object as PropType<Product>, required: true },
  index: { type: Number, default: 1 },
})

// 🖼️ Afbeeldingsmaten
const imgWidth = 280
const imgHeight = Math.round(imgWidth * 1.125)

// 🎨 Filters (kleurvariaties)
const route = useRoute()
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

/**
 * 🧩 Overlay openen (zonder Pinia)
 * Zet globale state die door ProductSlideOver wordt gelezen
 */
function openProductSlideOver() {
  const visible = useState('slideOverVisible', () => false)
  const slug = useState<string | null>('slideOverSlug', () => null)
  slug.value = props.node.slug
  visible.value = true
}
</script>

<template>
  <div class="relative group cursor-pointer" @click="openProductSlideOver">
    <SaleBadge :node="node" class="absolute top-2 right-2 z-10" />

    <NuxtImg
      v-if="imagetoDisplay"
      :width="imgWidth"
      :height="imgHeight"
      :src="imagetoDisplay"
      :alt="node.image?.altText || node.name || 'Product image'"
      :title="node.image?.title || node.name"
      :loading="index <= 3 ? 'eager' : 'lazy'"
      :sizes="`sm:${imgWidth / 2}px md:${imgWidth}px`"
      class="rounded-lg object-top object-cover w-full aspect-9/8 transition-transform duration-200 group-hover:scale-[1.03]"
      placeholder
      placeholder-class="blur-xl"
    />

    <div class="p-2">
      <StarRating
        v-if="storeSettings.showReviews"
        :rating="node.averageRating"
        :count="node.reviewCount"
      />

      <h2 class="mb-2 font-light leading-tight group-hover:text-primary">
        {{ node.name }}
      </h2>

      <ProductPrice
        class="text-sm"
        :sale-price="node.salePrice"
        :regular-price="node.regularPrice"
      />
    </div>
  </div>
</template>
