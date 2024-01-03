<script setup lang="ts">
const route = useRoute();
const { productsPerPage } = useHelpers();
const { formatURI } = useHelpers();
const { products } = useProducts();

const currentQuery = computed(() => {
  const query = route.query;
  const queryKeys = Object.keys(query);
  let currentQuery = '';
  if (queryKeys.length > 0) {
    queryKeys.forEach((key, index) => {
      currentQuery += index === 0 ? `${key}=${query[key]}` : `&${key}=${query[key]}`;
    });
  }
  return formatURI(currentQuery);
});

const page = ref(route.params.pageNumber_0 ? parseInt(route.params.pageNumber_0 as string) : 1);
let numberOfPages: number = parseInt(route.params.pageNumber_0 as string)

console.log('p')
console.log(products.value.length)
const productsCount = products.value.length
console.log(page)
const prevSrc = (pageNumber: number) => {
  if (currentQuery.value === '') {
    return formatURI(`/products/page/${pageNumber > 1 ? pageNumber - 1 : pageNumber}`);
  } else {
    return formatURI(pageNumber > 1 ? `/products/page/${pageNumber - 1}/?${currentQuery.value}` : `/products/page/${pageNumber}/?${currentQuery.value}`);
  }
};

const nextSrc = (pageNumber: number) => {
  if (currentQuery.value === '') {
    return formatURI(`/products/page/${pageNumber < page.value ? pageNumber + 1 : pageNumber}`);
  } else {
    return formatURI(pageNumber < page.value ? `/products/page/${pageNumber + 1}/?${currentQuery.value}` : `/products/page/${pageNumber}/?${currentQuery.value}`);
  }
};

const numberSrc = (pageNumber: number) => {
  if (currentQuery.value === '') {
    return formatURI(`/products/page/${pageNumber}`);
  } else {
    return formatURI(`/products/page/${pageNumber}/?${currentQuery.value}`);
  }
};
</script>

<template>
  <div class="flex justify-center mt-8 mb-16 col-span-full tabular-nums">
    <!-- Pagination -->
    <nav class="inline-flex self-end -space-x-px rounded-md shadow-sm isolate" aria-label="Pagination">
      <!-- PREV -->
      <NuxtLink :to="prevSrc(page)" class="prev" :disabled="page == 1" :class="{ 'cursor-not-allowed': page == 1 }"
        :aria-disabled="page == 1" aria-label="Previous">
        <Icon name="ion:chevron-back-outline" size="20" class="w-5 h-5" />
      </NuxtLink>

      <!-- NUMBERS -->
      <NuxtLink :to="numberSrc(page)" :aria-current="page === page ? 'page' : undefined" class="page-number">{{
        page
      }}</NuxtLink>

      <!-- NEXT -->

      <NuxtLink :to="nextSrc(page + 1)" class="next" :disabled="productsCount < 10"
        :class="{ 'cursor-not-allowed': productsCount < 10 }" :aria-disabled="productsCount < 10" aria-label="Next">
        <Icon name="ion:chevron-forward-outline" size="20" class="w-5 h-5" />
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