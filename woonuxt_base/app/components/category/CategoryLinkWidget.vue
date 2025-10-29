<script setup lang="ts">
import { useCategoryChildren } from '~/composables/useCategoryChildren'

const { category, children, error } = useCategoryChildren()

// Debug-log, handig bij testen
watch(children, (val) => {
  console.log('👀 Children ontvangen in widget:', val)
})

// Kleine helper om nette URL's te maken
function cleanUri(slug: string | undefined): string {
  if (!slug) return '/'
  return `/${slug}`
}
</script>

<template>
  <div
    v-if="children && children.length > 0"
    class="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
  >
    <h2 class="text-lg font-semibold text-gray-900 mb-4">
      Gerelateerde categorieën
    </h2>

    <div class="space-y-6">
      <div v-for="(cat, i) in children" :key="i">
        <h3 class="font-semibold text-gray-900 mb-2">
          <NuxtLink :to="cleanUri(cat.slug)" class="hover:underline">
            {{ cat.name }}
          </NuxtLink>
        </h3>

        <ul v-if="cat.children?.nodes?.length" class="space-y-1">
          <li v-for="(sub, j) in cat.children.nodes" :key="j">
            <NuxtLink
              :to="cleanUri(sub.slug)"
              class="block text-gray-700 hover:underline ml-4"
            >
              {{ sub.name }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
