<script setup lang="ts">
import type { Product } from '~/types/product'

// ✅ Gebruik onze centrale composable
const { allProducts, hasProducts, storeSettings, pending, error } = useProductListing()

// ✅ Haal route op voor slug en navigatie
const route = useRoute()
const slug = route.params.categorySlug as string

// ✅ Zelfde GraphQL-query opnieuw gebruiken voor categorie-meta
const { data: categoryData } = await useAsyncGql('GetProductsByCategory', { slug, first: 1 })

const category = computed(() => categoryData.value?.productCategory ?? null)

// ✅ Metadata (SEO + <head>)
useHead(() => ({
  title: category.value?.name || 'Categorie',
  meta: [
    {
      hid: 'description',
      name: 'description',
      content: category.value?.description?.replace(/<[^>]+>/g, '').substring(0, 155) || '',
    },
  ],
}))
</script>

<template>
  <div class="container py-8">
    <!-- Loader -->
    <div v-if="pending" class="flex justify-center items-center min-h-[50vh]">
      <Loader />
    </div>

    <!-- Foutmelding -->
    <div v-else-if="error" class="text-center text-red-600 p-8">
      Er is een fout opgetreden bij het laden van deze categorie.
    </div>

    <!-- ✅ Categorie content -->
    <div v-else class="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-10 mt-8">
      <!-- Sidebar -->
      <aside class="order-2 md:order-1">
        <Filters v-if="storeSettings.showFilters" :hide-categories="true" />
      </aside>

      <!-- Main content -->
      <section class="order-1 md:order-2 w-full">
        <!-- ✅ Breadcrumb -->
        <nav class="text-sm text-gray-500 mb-2">
          <NuxtLink to="/" class="hover:underline">Home</NuxtLink>
          <span class="mx-2">/</span>
          <NuxtLink to="/products" class="hover:underline">Kleding</NuxtLink>

          <span class="mx-2">/</span>
          <span class="tex
