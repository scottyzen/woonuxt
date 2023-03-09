<script setup>
const route = useRoute();
const order = ref(null);
const error = ref(null);

onMounted(() => {
  if (route.params.orderId) getOrder();
});

async function getOrder() {
  try {
    const data = await GqlGetOrder({ id: route.params.orderId });
    order.value = data.order;

    if (data.order === null) {
      error.value = true;
    }
  } catch (err) {
    error.value = err;
  }
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatPrice(price) {
  price = parseFloat(price);
  return price.toLocaleString('nl-NL', { style: 'currency', currency: 'EUR' });
}
</script>

<template>
  <div
    class="w-full min-h-80 p-8 text-gray-800 md:bg-white md:rounded-xl md:mx-auto md:shadow-lg md:my-24 md:mt-8 md:max-w-3xl md:p-16">
    <div v-if="order">
      <h1 class="font-semibold text-xl mb-2">{{ $t('messages.shop.orderSummary') }}</h1>
      <p v-if="order">
        {{ $t('messages.shop.orderThanks') }}
      </p>

      <hr class="my-8" />

      <div class="flex justify-between">
        <div>
          <div class="text-xs text-gray-400 uppercase">{{ $t('messages.shop.order') }}</div>
          <div>#{{ order.databaseId }}</div>
        </div>
        <div>
          <div class="text-xs text-gray-400 uppercase">{{ $t('messages.general.date') }}</div>
          <div>{{ formatDate(order.date) }}</div>
        </div>
        <div>
          <div class="text-xs text-gray-400 uppercase">{{ $t('messages.general.status') }}</div>
          <div>{{ order.status }}</div>
        </div>
        <div>
          <div class="text-xs text-gray-400 uppercase">{{ $t('messages.billing.paymentMethod') }}</div>
          <div>{{ order.paymentMethodTitle }}</div>
        </div>
      </div>

      <hr class="my-8" />

      <div class="grid gap-2">
        <div
          v-for="item in order.lineItems.nodes"
          :key="item.product.databaseId"
          class="flex gap-8 items-center justify-between">
          <img
            v-if="item.product.node.image"
            class="rounded-xl h-16 w-16"
            :src="
              item.variation
                ? item.variation.node.image.sourceUrl
                : item.product.node.image.sourceUrl || '/images/placeholder.png'
            "
            :alt="
              item.variation
                ? item.variation.node.altText
                : item.product.node.image.altText || 'Product image'
            "
            :title="
              item.variation
                ? item.variation.node.title
                : item.product.node.image.title || 'Product image'
            "
            width="64"
            height="64"
            loading="lazy" />
          <div class="flex-1 leading-tight">
            {{
              item.variation ? item.variation.node.name : item.product.node.name
            }}
          </div>
          <div class="text-sm text-gray-600">Qty. {{ item.quantity }}</div>
          <span class="font-semibold text-sm">{{
            formatPrice(item.total)
          }}</span>
        </div>
      </div>

      <hr class="my-8" />

      <div>
        <div class="flex justify-between">
          <span>{{ $t('messages.shop.subtotal') }}</span>
          <span>{{ order.subtotal }}</span>
        </div>
        <div class="flex justify-between">
          <span>{{ $t('messages.general.tax') }}</span>
          <span>{{ order.totalTax }}</span>
        </div>
        <div class="flex justify-between">
          <span>{{ $t('messages.general.shipping') }}</span>
          <span>{{ order.shippingTotal }}</span>
        </div>
        <hr class="my-8" />
        <div class="flex justify-between">
          <span class>{{ $t('messages.shop.total') }}</span>
          <span class="font-semibold">{{ order.total }}</span>
        </div>
      </div>
    </div>
    <div v-else-if="error" class="flex min-h-80 justify-center items-center">
      <div class="text-center">
        <h1 class="font-semibold mb-4 text-2xl">{{ $t('messages.error.general') }}</h1>
        <p class="mb-8">
          {{ $t('messages.error.noOrder') }}
        </p>
        <NuxtLink
          to="/"
          class="bg-primary rounded-lg font-bold text-white text-center min-w-[150px] p-2.5 focus:outline-noney">
          {{ $t('messages.general.goHome') }}
        </NuxtLink>
      </div>
    </div>
    <div v-else class="flex min-h-80 justify-center items-center">
      <LoadingIcon />
    </div>
  </div>
</template>
