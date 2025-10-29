<template>
  <div v-if="!loading">
    <h3>{{ category?.name }}</h3>
    <ul>
      <li v-for="child in children" :key="child.id">
        <NuxtLink :to="child.uri">{{ child.name }}</NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">

import { useCategoryChildren } from '~/woonuxt_base/app/composables/useCategoryChildren'

const { category, children, loading, error } = useCategoryChildren()
</script>
