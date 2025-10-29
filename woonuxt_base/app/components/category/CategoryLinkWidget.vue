<script setup lang="ts">
import { useCategoryChildren } from '~/composables/useCategoryChildren'

const { category, children, siblings } = useCategoryChildren()

function cleanUri(slug: string) {
  return '/' + slug
}
</script>

<template>
  <div v-if="siblings.length" class="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
    <h2 class="text-lg font-semibold text-gray-900 mb-4">
      {{ category?.parent?.node?.name || 'Categorieën' }}
    </h2>

    <ul class="space-y-1">
      <li v-for="sibling in siblings" :key="sibling.id">
        <NuxtLink
          :to="cleanUri(sibling.slug)"
          class="block hover:underline"
          :class="{ 'font-bold underline': sibling.slug === category?.slug }"
        >
          {{ sibling.name }}
        </NuxtLink>

        <!-- Alleen bij actieve categorie: toon subcategorieën -->
        <ul v-if="sibling.slug === category?.slug && children.length" class="ml-4 mt-1 space-y-1">
          <li v-for="sub in children" :key="sub.id">
            <NuxtLink :to="cleanUri(sub.slug)" class="text-gray-700 hover:underline">
              {{ sub.name }}
            </NuxtLink>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>
