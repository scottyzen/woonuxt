<script setup>
// const { productCategories } = await GqlGetProductCategories();
const { data } = await useAsyncGql('getProductCategories');
const productCategories = data.value?.productCategories;
</script>

<template>
  <main class="container">
    <div v-if="productCategories" v-once class="my-6 grid gap-4 grid-cols-2 md:grid-cols-3 lg:gap-8 xl:grid-cols-4">
      <CategoryCard v-for="(category, i) in productCategories.nodes" :key="i" :node="category" />
    </div>
  </main>
</template>
