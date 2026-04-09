<script setup lang="ts">
const router = useRouter();
const { formatDate, scrollToTop } = useHelpers();
const { getOrders, orders } = useAuth();

if (orders.value === null) getOrders();

const refresh = () => {
  orders.value = null;
  scrollToTop();
  getOrders();
};

const goToOrder = (databaseId?: string | number | null): void => {
  if (!databaseId) return;
  router.push(`/order-summary/${databaseId}`);
};
</script>

<template>
  <div class="bg-white rounded-lg flex shadow-xs border border-gray-100 min-h-62.5 p-4 md:p-8 justify-center items-center">
    <div v-if="orders && orders.length" class="w-full">
      <table class="w-full text-left table-auto" aria-label="Order List">
        <thead>
          <tr>
            <th>{{ $t('shop.order') }}</th>
            <th>{{ $t('general.date') }}</th>
            <th>{{ $t('general.status') }}</th>
            <th class="text-right">{{ $t('shop.total') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="order in orders"
            :key="order.orderNumber || String(order.databaseId)"
            class="cursor-pointer hover:bg-gray-50 transition-colors"
            @click="goToOrder(order.databaseId)">
            <td class="rounded-l-lg">{{ order.orderNumber }}</td>
            <td>{{ formatDate(order.date) }}</td>
            <td><OrderStatusLabel v-if="order.status" :order="order" /></td>
            <td class="text-right rounded-r-lg" v-html="order.total"></td>
          </tr>
        </tbody>
      </table>
      <div class="text-center flex justify-center w-full mt-8">
        <button type="button" @click="refresh" class="flex items-center gap-1 text-sm leading-none hover:bg-gray-50 p-2 rounded transition-colors">
          <span>Refresh list</span>
          <Icon name="ion:refresh-outline" />
        </button>
      </div>
    </div>
    <div v-else-if="orders && orders.length === 0" class="min-h-62.5 flex items-center justify-center text-gray-500 text-lg">No orders found.</div>
    <LoadingIcon v-else size="24" stroke="2" />
  </div>
</template>

<style scoped>
@reference "#tailwind";

tbody tr:nth-child(odd) {
  @apply bg-gray-50;
}

tbody tr {
  @apply text-sm text-gray-500  hover:text-gray-800;
}

td,
th {
  @apply py-2 px-3;
}
</style>