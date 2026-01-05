<script setup>
const { getOrderQuery, setOrderQuery } = await useSorting();
const { storeSettings } = useAppConfig();
const selectedOrder = ref(getOrderQuery());
const orderby = ref(selectedOrder.value.orderBy || 'date');
const order = ref(selectedOrder.value.order);

// Update the URL when the checkbox is changed
watch([orderby, order], () => {
  setOrderQuery(orderby.value, order.value);
});
</script>

<template>
  <div class="inline-flex ml-auto -space-x-px shadow-sm rounded-m isolate">
    <button
      class="relative inline-flex items-center p-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-l-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:z-20"
      aria-label="Sort"
      @click="order = order === 'ASC' ? 'DESC' : 'ASC'">
      <Icon name="ion:filter-outline" size="18" :class="order === 'ASC' ? 'rotate-180' : ''" class="transition-transform transform transform-origin-center" />
    </button>
    <select id="orderby-dropdown" v-model="orderby" class="bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 rounded-l-none" aria-label="Order by">
      <option value="date">{{ $t('general.latest') }}</option>
      <option value="alphabetically">{{ $t('general.alphabetically') }}</option>
      <option value="price">{{ $t('shop.price') }}</option>
      <option v-if="storeSettings.showReviews" value="rating">{{ $t('shop.rating') }}</option>
      <option value="discount">{{ $t('shop.discount') }}</option>
    </select>
  </div>
</template>
