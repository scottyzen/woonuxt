<template>
  <div class="category-widget p-4 bg-white rounded-2xl shadow-sm">
    <h3 class="text-lg font-semibold mb-3">Categorieën</h3>

    <!-- Laden -->
    <div v-if="loading" class="text-gray-400 text-sm">Laden...</div>

    <!-- Fout -->
    <div v-else-if="error" class="text-red-500 text-sm">
      Er ging iets mis bij het laden van de categorieën.
    </div>

    <!-- Subcategorieën -->
    <ul v-else-if="children && children.length">
      <li
        v-for="child in children"
        :key="child.id"
        class="py-1"
      >
        <NuxtLink
          :to="child.uri"
          class="hover:text-primary transition-colors"
        >
          {{ child.name }}
        </NuxtLink>
      </li>
    </ul>

    <!-- Geen subcategorieën -->
    <div v-else class="text-gray-400 text-sm">
      Geen subcategorieën gevonden.
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCategoryChildren } from '~/app/composables/useCategoryChildren'

const { category, children, loading, error } = useCategoryChildren()
</script>
