<template>
  <header class="container flex justify-between py-4 border-b">
    <nuxt-link to="/">
      <h1 class="text-lg font-bold text-purple-700">WooNuxt</h1>
    </nuxt-link>
    <nav>
      <nuxt-link class="ml-4" to="/products">All Products</nuxt-link>
      <nuxt-link class="ml-4" to="/product-category/music">Music</nuxt-link>
      <nuxt-link class="ml-4" to="/product-category/accessories">
        Accessories
      </nuxt-link>
      <nuxt-link class="ml-4" to="/product-category/tshirts">Tshirts</nuxt-link>
      <nuxt-link class="ml-4" to="/product-category/hoodies">Hoodies</nuxt-link>
      <nuxt-link class="ml-4" to="/product-category/decor">Decor</nuxt-link>
    </nav>
  </header>
</template>
