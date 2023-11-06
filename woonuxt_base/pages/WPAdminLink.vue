<template>
  <DevOnly>
    <a
      v-if="linkStartsWithWpAdmin && wpBase"
      :href="formattedLink"
      target="_blank"
      rel="noopener noreferrer"
      title="This is a dev-only link, it will not be visible in production."
      class="inline-flex items-center bg-yellow-400 leading-tight py-1 px-2 rounded gap-1 text-sm text-yellow-900 border-b border-yellow-500 hover:bg-yellow-500 mx-3">
      <slot />
      <Icon name="ion:open-outline" size="14" />
    </a>
  </DevOnly>
</template>

<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();
const defaultClient = runtimeConfig?.public?.['graphql-client']?.clients?.default as { host: string } | undefined;

const { link } = defineProps<{ link: string }>();

const gqlEndpoint = defaultClient?.host || null;
const wpBase = gqlEndpoint?.replace('/graphql', '') || null;
const formattedLink = wpBase + link;

// link must start with /wp-admin
const linkStartsWithWpAdmin = link?.startsWith('/wp-admin') || false;
</script>
