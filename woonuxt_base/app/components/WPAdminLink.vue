<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();
const defaultClient = runtimeConfig?.public?.['graphql-client']?.clients?.default as { host: string } | undefined;

const { link } = defineProps<{ link: string }>();

const gqlEndpoint = defaultClient?.host ?? null;
const wpBase = gqlEndpoint?.replace('/graphql', '') ?? null;
const formattedLink = wpBase + link;
const linkStartsWithWpAdmin = link?.startsWith('/wp-admin') || false;
</script>

<template>
  <DevOnly>
    <ClientOnly>
      <a
        v-if="linkStartsWithWpAdmin && wpBase && link"
        :href="formattedLink"
        target="_blank"
        class="wp-admin-link"
        title="This is a dev-only link, it will not be visible in production.">
        <span class="link">
          <slot />
        </span>
        <Icon name="ion:open-outline" size="14" />
      </a>
    </ClientOnly>
  </DevOnly>
</template>

<style scoped lang="postcss">
.wp-admin-link {
  @apply inline-flex items-center bg-yellow-400 leading-tight py-1 px-2 rounded gap-1 text-xs text-yellow-900 border-b border-yellow-500 uppercase transition-all duration-100 ease-in-out;

  &:hover {
    @apply bg-yellow-500 border-yellow-600 border-b;
  }
}
</style>
