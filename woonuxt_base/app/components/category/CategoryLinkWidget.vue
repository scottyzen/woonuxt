<script setup lang="ts">
import { useCategoryChildren } from '~/composables/useCategoryChildren'

const { loading, error, category, children, siblings } = useCategoryChildren()

// Links maken we direct op basis van slug → "/{slug}"
const toPath = (slug: string) => `/${slug}`
</script>

<template>
  <div v-if="!loading && (siblings.length || children.length)" class="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
    <!-- Titel: naam van parent of 'Categorieën' als fallback -->
    <h2 class="text-lg font-semibold text-gray-900 mb-4">
      {{ category?.parent?.node?.name || 'Categorieën' }}
    </h2>

    <!-- Siblings-lijst (zelfde level) -->
    <ul class="space-y-1">
      <li v-for="s in siblings" :key="s.id">
        <NuxtLink
          :to="toPath(s.slug)"
          class="block hover:underline"
          :class="{ 'font-semibold underline': s.slug === category?.slug }"
        >
          {{ s.name }}
        </NuxtLink>

        <!-- Als dit de actieve sibling is (de huidige categorie), toon zijn children -->
        <ul v-if="s.slug === category?.slug && children.length" class="ml-4 mt-1 space-y-1">
          <li v-for="c in children" :key="c.id">
            <NuxtLink :to="toPath(c.slug)" class="text-gray-700 hover:underline">
              {{ c.name }}
            </NuxtLink>
          </li>
        </ul>
      </li>
    </ul>

    <!-- Als géén siblings maar wel children (bijv. root of uniek pad) -->
    <div v-if="!siblings.length && children.length" class="mt-4">
      <h3 class="text-sm font-semibold text-gray-900 mb-2">
        Subcategorieën van {{ category?.name }}
      </h3>
      <ul class="space-y-1">
        <li v-for="c in children" :key="c.id">
          <NuxtLink :to="toPath(c.slug)" class="hover:underline">
            {{ c.name }}
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>

  <!-- Skeleton / laad-state -->
  <div v-else-if="loading" class="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
    <div class="h-5 w-40 rounded bg-gray-100 animate-pulse mb-4"></div>
    <div class="space-y-2">
      <div class="h-4 w-56 rounded bg-gray-100 animate-pulse"></div>
      <div class="h-4 w-44 rounded bg-gray-100 animate-pulse"></div>
      <div class="h-4 w-48 rounded bg-gray-100 animate-pulse"></div>
    </div>
  </div>
</template>
