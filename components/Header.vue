<template>
  <header class="sticky top-0 bg-white shadow-sm">
    <div class="container flex items-center justify-between py-4">
      <nuxt-link to="/">
        <h1 class="text-lg font-bold">WooNuxt</h1>
      </nuxt-link>
      <nav class="text-sm uppercase">
        <nuxt-link class="ml-4" to="/products">All Products</nuxt-link>

        <nuxt-link
          v-for="category in $store.state.productCategories"
          :key="category.id"
          :to="`/product-category/${category.slug}`"
          class="ml-4"
        >
          {{ category.name }}
        </nuxt-link>
      </nav>
    </div>
  </header>
</template>
