<script setup lang="ts">
const route = useRoute();
const { productsPerPage } = useHelpers();
const { products } = useProducts();

const currentQuery = computed(() => {
  const params = new URLSearchParams(route.query as Record<string, string>).toString();
  return params ? decodeURIComponent(params) : '';
});

const page = ref(route.params.pageNumber ? parseInt(route.params.pageNumber as string) : 1);
const numberOfPages = computed<number>(() => Math.ceil(products.value.length / productsPerPage || 1));

const pageSrc = (pageNumber: number) => {
  const base = `/products/page/${pageNumber}`;
  return currentQuery.value ? `${base}/?${currentQuery.value}` : base;
};

const prevSrc = (pageNumber: number) => pageSrc(Math.max(1, pageNumber - 1));
const nextSrc = (pageNumber: number) => pageSrc(Math.min(numberOfPages.value, pageNumber + 1));
const numberSrc = (pageNumber: number) => pageSrc(pageNumber);
</script>

<template>
  <div class="flex justify-center mt-8 mb-16 col-span-full tabular-nums">
    <!-- Pagination -->
    <nav v-if="numberOfPages && numberOfPages > 1" class="inline-flex self-end -space-x-px rounded-md shadow-xs isolate" aria-label="Pagination">
      <!-- PREV -->
      <NuxtLink
        :to="prevSrc(page)"
        class="prev"
        :disabled="page == 1"
        :class="{ 'cursor-not-allowed': page == 1 }"
        :aria-disabled="page == 1"
        aria-label="Previous">
        <Icon name="ion:chevron-back-outline" size="20" class="w-5 h-5" />
      </NuxtLink>

      <!-- NUMBERS -->
      <NuxtLink
        v-for="pageNumber in numberOfPages"
        :key="pageNumber"
        :to="numberSrc(pageNumber)"
        :aria-current="pageNumber === page ? 'page' : undefined"
        class="page-number">
        {{ pageNumber }}
      </NuxtLink>

      <!-- NEXT -->
      <NuxtLink
        :to="nextSrc(page)"
        class="next"
        :disabled="page === numberOfPages"
        :class="{ 'cursor-not-allowed': page === numberOfPages }"
        :aria-disabled="page === numberOfPages"
        aria-label="Next">
        <Icon name="ion:chevron-forward-outline" size="20" class="w-5 h-5" />
      </NuxtLink>
    </nav>
  </div>
</template>

<style scoped>
@reference "#tailwind";

.prev,
.next,
.page-number {
  @apply bg-white  border font-medium border-gray-300  text-sm p-2 text-gray-500  relative inline-flex items-center hover:bg-gray-50  focus:z-10;
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
  @apply bg-primary/10  border-primary  border text-primary  z-10;
}
</style>
