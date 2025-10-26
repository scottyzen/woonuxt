<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()

const slugParts = Array.isArray(route.params.category)
  ? route.params.category
  : [route.params.category]

const slug = slugParts[slugParts.length - 1] // laatste deel is de slug van de categorie

const authHeader = 'Basic ' + btoa(`${config.public.wcKey}:${config.public.wcSecret}`)

// Stap 1: Haal de categorie op op basis van slug
const { data: categories } = await useFetch('https://wp.jouwsite.nl/wp-json/wc/v3/products/categories', {
  headers: { Authorization: authHeader },
  params: { slug }
})

const category = categories.value?.[0]

if (!category) {
  throw createError({ statusCode: 404, statusMessage: 'Categorie niet gevonden' })
}

// Stap 2: Haal producten op van deze categorie
const { data: products } = await useFetch('https://wp.jouwsite.nl/wp-json/wc/v3/products', {
  headers: { Authorization: authHeader },
  params: { category: category.id }
})
</script>

<template>
  <div>
    <h1 class="text-xl font-bold mb-4">Categorie: {{ category?.name }}</h1>

    <ul class="grid grid-cols-2 gap-4">
      <li v-for="product in products" :key="product.id">
        {{ product.name }}
      </li>
    </ul>
  </div>
</template>
