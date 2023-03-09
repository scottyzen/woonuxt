<script setup>
const { getOrderQuery, setOrderQuery } = await useSorting();
const selectedOrder = ref(getOrderQuery());
const orderby = ref(selectedOrder.value.orderBy || 'date');
const order = ref(selectedOrder.value.order);

// Update the URL when the checkbox is changed
watch([orderby, order], () => {
  setOrderQuery(orderby.value, order.value);
});
</script>

<template>
  <div class="-space-x-px rounded-m shadow-sm isolate inline-flex">
    <button
      class="bg-white border rounded-l-md font-medium border-gray-300 text-sm p-2 text-gray-500 relative inline-flex items-center hover:bg-gray-50 focus:z-20"
      aria-label="Sort"
      @click="order = order === 'ASC' ? 'DESC' : 'ASC'">
      <Icon
        name="ion:filter-outline"
        size="18"
        :class="order === 'ASC' ? 'rotate-180' : ''"
        class="transform transform-origin-center transition-transform" />
    </button>
    <select
      v-model="orderby"
      class="bg-white border rounded-l-none rounded-r-md font-medium border-gray-300 flex-1 text-sm p-1.5 pr-12 pl-4 text-gray-500 relative inline-flex items-center hover:bg-gray-50 focus:z-20"
      aria-label="Order by">
      <option value="date">{{ $t('messages.general.latest') }}</option>
      <option value="alphabetically">{{ $t('messages.general.alphabetically') }}</option>
      <option value="price">{{ $t('messages.shop.price') }}</option>
      <option value="rating">{{ $t('messages.shop.rating') }}</option>
      <option value="discount">{{ $t('messages.shop.discount') }}</option>
    </select>
  </div>
</template>
