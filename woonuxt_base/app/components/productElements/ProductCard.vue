<script setup lang="ts">
import type { PropType } from 'vue'
import type { Product } from '~/types/product'

const route = useRoute()
const { storeSettings } = useAppConfig()

// 🧩 Props
const props = defineProps({
  node: { type: Object as PropType<Product>, required: true },
  index: { type: Number, default: 1 },
})

// 📐 Afbeeldingsmaten
const imgWidth = 280
const imgHeight = Math.round(imgWidth * 1.125)

// 🪟 Overlay (Woonuxt provide/inject)
const productSlideOver = inject('productSlideOver') as Ref<any>
const router = useRouter()
function openProduct(id: number, slug: string) {
  productSlideOver?.value?.open(id, slug)
}

// 🎨 Filters (kleurvariaties)
const filterQuery = ref(route.query?.filter as string)
const paColor = ref(
  filterQuery.value?.split('pa_color[')[1]?.split(']')[0]?.split(',') || []
)

// 🔁 Reageer op query-veranderingen
watch(
  () => route.query,
  () => {
    filterQuery.value = route.query.filter as string
    paColor.value =
      filterQuery.value?.split('pa_color[')[1]?.split(']')[0]?.split(',') || []
  }
)

// 🖼️ Afbeelding bepalen
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

// 🧠 Debug (optioneel)
// onMounted(() => {
//   if (props.node?.__typename === 'ExternalProduct') {
//     console.log('External product:', props.node)
//   }
// })
</script>

<template>
  <div class="relative group">
    <!-- Altijd slide-over openen (ook bij ExternalProduct) -->
    <a
      href="#"
      @click.prevent="openProduct(node.databaseId, node.slug)"
      :title="node.name"
    >
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
        class="rounded-lg object-top object-cover w-full aspect-9/8 transition-transform duration-200 group-hover:scale-[1.03]"
        placeholder
        placeholder-class="blur-xl"
      />
    </a>

    <div class="p-2">
      <NuxtLink
        v-if="node.slug"
        :to="`/product/${decodeURIComponent(node.slug)}`"
        :title="node.name"
      >
        <h2 class="mb-2 font-light leading-tight group-hover:text-primary">
          {{ node.name }}
        </h2>
      </NuxtLink>

      <!-- Prijs met fallback voor ExternalProduct -->
      <ProductPrice
        class="text-sm"
        :sale-price="node.salePrice || node.price"
        :regular-price="node.regularPrice || node.price"
      />
    </div>
  </div>
</template>
