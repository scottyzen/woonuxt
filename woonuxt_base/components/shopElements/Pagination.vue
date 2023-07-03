<script setup lang="ts">
const route = useRoute();
const runtimeConfig = useRuntimeConfig();
const { products } = await useProducts();

const currentQuery = computed(() => {
  const query = route.query;
  return Object.keys(query)
    .map((key) => `${key}=${query[key]}`)
    .join('&');
});

const page = ref(route.params.pageNumber ? parseInt(route.params.pageNumber as string) : 1);
const productsPerPage: number = runtimeConfig.public.PRODUCTS_PER_PAGE;
const numberOfPages = computed(() => Math.ceil(products.value.length / productsPerPage));
</script>

<template>
  <div class="flex mt-8 mb-16 col-span-full justify-center tabular-nums">
    <!-- Pagination -->
    <nav v-if="numberOfPages > 1" class="-space-x-px rounded-md shadow-sm isolate inline-flex self-end" aria-label="Pagination">
      <!-- PREV -->
      <NuxtLink
        :to="page > 1 ? `/products/page/${page - 1}/?${currentQuery}` : `/products/page/${page}/?${currentQuery}`"
        class="prev"
        :disabled="page == 1"
        :class="{ 'cursor-not-allowed': page == 1 }"
        :aria-disabled="page == 1"
        aria-label="Previous">
        <Icon name="ion:chevron-back-outline" size="20" class="h-5 w-5" />
      </NuxtLink>

      <!-- NUMBERS -->
      <NuxtLink
        v-for="pageNumber in numberOfPages"
        :key="pageNumber"
        :to="`/products/page/${pageNumber}/?${currentQuery}`"
        :aria-current="pageNumber === page ? 'page' : undefined"
        class="page-number"
        >{{ pageNumber }}</NuxtLink
      >

      <!-- NEXT -->
      <NuxtLink
        :to="page < numberOfPages ? `/products/page/${page + 1}/?${currentQuery}` : `/products/page/${page}/?${currentQuery}`"
        class="next"
        :disabled="page === numberOfPages"
        :class="{ 'cursor-not-allowed': page === numberOfPages }"
        :aria-disabled="page === numberOfPages"
        aria-label="Next">
        <Icon name="ion:chevron-forward-outline" size="20" class="h-5 w-5" />
      </NuxtLink>
    </nav>
  </div>
</template>

<style lang="postcss" scoped>
.prev,
.next,
.page-number {
  @apply bg-white border font-medium border-gray-300 text-sm p-2 text-gray-500 relative inline-flex items-center hover:bg-gray-50 focus:z-10;
}

.prev {
  @apply rounded-l-md;
}

.next {
  @apply rounded-r-md;
}

.page-number {
  @apply px-3;
}

.page-number[aria-current='page'] {
  @apply bg-primary border-primary border bg-opacity-10 text-primary z-10;
}
</style>
