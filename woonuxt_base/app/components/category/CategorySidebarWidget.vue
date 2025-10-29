<template>
  <aside class="p-4 bg-gray-50 rounded-2xl shadow-sm">
    <div v-if="parent" class="mb-4">
      <h3 class="font-semibold text-lg mb-2">Hoofdcategorie</h3>
      <NuxtLink :to="`/${parent.slug}`" class="text-blue-600 hover:underline">
        {{ parent.name }}
      </NuxtLink>
    </div>

    <div v-if="siblings.length" class="mb-4">
      <h3 class="font-semibold text-lg mb-2">Gerelateerde categorieën</h3>
      <ul class="space-y-1">
        <li v-for="cat in siblings" :key="cat.id">
          <NuxtLink :to="`/${cat.slug}`" class="hover:underline text-gray-700">
            {{ cat.name }}
          </NuxtLink>
        </li>
      </ul>
    </div>

    <div v-if="children.length">
      <h3 class="font-semibold text-lg mb-2">Subcategorieën</h3>
      <ul class="space-y-1">
        <li v-for="cat in children" :key="cat.id">
          <NuxtLink :to="`/${cat.slug}`" class="hover:underline text-gray-700">
            {{ cat.name }}
          </NuxtLink>
        </li>
      </ul>
    </div>
       <!-- 👇 Debug: laat de data tijdelijk zien -->
    <pre class="mt-4 text-xs text-gray-500">{{ siblings }}</pre>
  </aside>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useRelatedCategories } from '~/composables/useRelatedCategories'

const route = useRoute()
const slug = route.params.slug as string

console.log('Current route slug:', slug) // 👈 tijdelijk toevoegen
const { parent, siblings, children } = await useRelatedCategories(slug)
</script>
