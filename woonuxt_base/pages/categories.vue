<script lang="ts" setup>
const { data } = await useAsyncGql('getProductCategories');
const productCategories = data.value?.productCategories;
</script>

<template>
  <main class="container">
    <div v-if="productCategories" v-once class="grid grid-cols-2 gap-4 my-6 md:grid-cols-3 lg:gap-8 xl:grid-cols-4">
      <CategoryCard v-for="(category, i) in productCategories.nodes" :key="i" :node="category" />
    </div>
  </main>
</template>
