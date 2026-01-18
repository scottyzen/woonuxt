<script setup lang="ts">
const { product } = defineProps({
  product: { type: Object as PropType<Product>, required: true },
});
const { storeSettings } = useAppConfig();
const { t } = useI18n();

const tabs = computed(() => {
  const tabList = [];

  if (product.description) {
    tabList.push({
      label: t('shop.productDescription'),
    });
  }

  if (storeSettings.showReviews) {
    tabList.push({
      label: t('shop.reviews'),
      badge: product.reviewCount ?? undefined,
    });
  }

  return tabList;
});

const activeTab = ref(0);
</script>

<template>
  <Tabs v-if="tabs.length" v-model="activeTab" :tabs="tabs">
    <template #default="{ activeTab: currentTab }">
      <div v-if="currentTab === 0 && product.description" class="font-light prose dark:prose-invert" v-html="product.description" />
      <ProductReviews v-else-if="currentTab === 1 || (currentTab === 0 && !product.description)" :product="product" />
    </template>
  </Tabs>
</template>
