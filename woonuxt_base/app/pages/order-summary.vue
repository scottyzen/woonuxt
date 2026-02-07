<script setup lang="ts">
import { OrderStatusEnum } from '#gql/default';
import type { Order } from '#types/gql';

const { query, params, name } = useRoute();
const { customer } = useAuth();
const { formatDate, formatPrice, getErrorMessage } = useHelpers();
const { t } = useI18n();
const { cart, emptyCart, refreshCart } = useCart();

const order = ref<Order | null>(null);
const fetchDelay = ref<boolean>(query.fetch_delay === 'true');
const delayLength = 2500;
const isLoaded = ref<boolean>(false);
const errorMessage = ref('');

const isGuest = computed(() => !customer.value?.email);
const isSummaryPage = computed<boolean>(() => name === 'order-summary');
const isCheckoutPage = computed<boolean>(() => name === 'order-received');
const orderIsNotCompleted = computed<boolean>(() => order.value?.status !== OrderStatusEnum.COMPLETED);
const hasDiscount = computed<boolean>(() => !!parseFloat(order.value?.rawDiscountTotal || '0'));
const downloadableItems = computed(() => order.value?.downloadableItems?.nodes || []);

onBeforeMount(() => {
  /**
   * This is to close the child PayPal window we open on the checkout page.
   * It will fire off an event that redirects the parent window to the order summary page.
   */
  if (isCheckoutPage.value && (query.cancel_order || query.from_paypal || query.PayerID)) window.close();
});

onMounted(async () => {
  await getOrder();

  // Clear the cart once the order is confirmed to be loaded
  // This prevents the cart flash on the checkout page during navigation
  // Only clear if cart has items to avoid "Cart is empty" errors
  if (order.value && isCheckoutPage.value && cart.value?.contents?.nodes?.length) {
    await emptyCart();
    await refreshCart();
  }

  /**
   * WooCommerce sometimes takes a while to update the order status.
   * This is a workaround to fetch the order again after a delay.
   * The length of the delay might need to be adjusted depending on your server.
   */

  if (isCheckoutPage.value && fetchDelay.value && orderIsNotCompleted.value) {
    setTimeout(() => {
      getOrder();
    }, delayLength);
  }
});

async function getOrder() {
  try {
    const { customer } = await GqlGetOrder({ id: params.orderId as string });
    const fetchedOrder = customer?.orders?.nodes?.[0];

    if (fetchedOrder) {
      order.value = fetchedOrder;
    } else {
      errorMessage.value = 'Could not find order';
    }
  } catch (err: unknown) {
    errorMessage.value = getErrorMessage(err) || 'Could not find order';
  }
  isLoaded.value = true;
}

const refreshOrder = async () => {
  isLoaded.value = false;
  await getOrder();
};

useSeoMeta({
  title() {
    return isSummaryPage.value ? t('shop.orderSummary') : t('shop.orderReceived');
  },
});
</script>

<template>
  <div
    class="w-full min-h-[600px] flex items-center p-4 text-gray-800 dark:text-gray-200 md:bg-white md:dark:bg-gray-800 md:rounded-xl md:mx-auto md:shadow-lg md:my-24 md:mt-8 md:max-w-3xl md:p-16 flex-col">
    <LoadingIcon v-if="!isLoaded" class="flex-1" />
    <template v-else>
      <div v-if="order" class="w-full">
        <template v-if="isSummaryPage">
          <div class="flex items-center gap-4">
            <NuxtLink
              to="/my-account?tab=orders"
              class="inline-flex items-center justify-center p-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              title="Back to orders"
              aria-label="Back to orders">
              <Icon name="ion:chevron-back-outline" />
            </NuxtLink>
            <h1 class="text-xl font-semibold text-gray-900 dark:text-white">{{ $t('shop.orderSummary') }}</h1>
          </div>
        </template>
        <template v-else-if="isCheckoutPage">
          <div class="flex items-center justify-between w-full mb-2">
            <h1 class="text-xl font-semibold text-gray-900 dark:text-white">{{ $t('shop.orderReceived') }}</h1>
            <button
              v-if="orderIsNotCompleted"
              type="button"
              class="inline-flex items-center justify-center p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              title="Refresh order"
              aria-label="Refresh order"
              @click="refreshOrder">
              <Icon name="ion:refresh-outline" />
            </button>
          </div>
          <p class="text-gray-600 dark:text-gray-400">{{ $t('shop.orderThanks') }}</p>
        </template>
        <hr class="my-8 border-gray-200 dark:border-gray-700" />
      </div>
      <div v-if="order" class="flex-1 w-full">
        <div class="flex items-start justify-between">
          <div class="w-[21%]">
            <div class="mb-2 text-xs text-gray-400 dark:text-gray-500 uppercase">{{ $t('shop.order') }}</div>
            <div class="leading-none text-gray-900 dark:text-white">#{{ order.databaseId! }}</div>
          </div>
          <div class="w-[21%]">
            <div class="mb-2 text-xs text-gray-400 dark:text-gray-500 uppercase">{{ $t('general.date') }}</div>
            <div class="leading-none text-gray-900 dark:text-white">{{ formatDate(order.date) }}</div>
          </div>
          <div class="w-[21%]">
            <div class="mb-2 text-xs text-gray-400 dark:text-gray-500 uppercase">{{ $t('general.status') }}</div>
            <OrderStatusLabel v-if="order.status" :order="order" />
          </div>
          <div class="w-[21%]">
            <div class="mb-2 text-xs text-gray-400 dark:text-gray-500 uppercase">{{ $t('general.paymentMethod') }}</div>
            <div class="leading-none text-gray-900 dark:text-white">{{ order.paymentMethodTitle }}</div>
          </div>
        </div>

        <template v-if="order.lineItems">
          <hr class="my-8 border-gray-200 dark:border-gray-700" />

          <div class="grid gap-2">
            <div v-for="item in order.lineItems.nodes" :key="item.id" class="flex items-center justify-between gap-8">
              <NuxtLink v-if="item.product?.node" :to="`/product/${item.product.node.slug}`">
                <NuxtImg
                  class="w-16 h-16 rounded-xl"
                  :src="item.variation?.node?.image?.sourceUrl || item.product.node?.image?.sourceUrl || '/images/placeholder.png'"
                  :alt="item.variation?.node?.image?.altText || item.product.node?.image?.altText || 'Product image'"
                  :title="item.variation?.node?.image?.title || item.product.node?.image?.title || 'Product image'"
                  width="64"
                  height="64"
                  loading="lazy" />
              </NuxtLink>
              <div class="flex-1 leading-tight text-gray-900 dark:text-white">
                {{ item.variation ? item.variation?.node?.name : item.product?.node.name! }}
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Qty. {{ item.quantity }}</div>
              <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ formatPrice(item.total!) }}</span>
            </div>
          </div>
        </template>

        <hr class="my-8 border-gray-200 dark:border-gray-700" />

        <div v-if="downloadableItems.length && !orderIsNotCompleted">
          <DownloadableItems :downloadableItems="downloadableItems" />
          <hr class="my-8 border-gray-200 dark:border-gray-700" />
        </div>

        <div class="text-gray-800 dark:text-gray-200">
          <div class="flex justify-between">
            <span>{{ $t('shop.subtotal') }}</span>
            <span v-html="order.subtotal"></span>
          </div>
          <div class="flex justify-between">
            <span>{{ $t('general.tax') }}</span>
            <span v-html="order.totalTax"></span>
          </div>
          <div class="flex justify-between">
            <span>{{ $t('general.shipping') }}</span>
            <span v-html="order.shippingTotal"></span>
          </div>
          <div v-if="hasDiscount" class="flex justify-between text-primary">
            <span>{{ $t('shop.discount') }}</span>
            <span>- <span v-html="order.discountTotal"></span></span>
          </div>
          <hr class="my-8 border-gray-200 dark:border-gray-700" />
          <div class="flex justify-between text-gray-900 dark:text-white">
            <span class>{{ $t('shop.total') }}</span>
            <span class="font-semibold" v-html="order.total"></span>
          </div>
        </div>
      </div>
      <div v-else-if="errorMessage" class="flex flex-col items-center justify-center flex-1 w-full gap-4 text-center">
        <Icon name="ion:sad-outline" size="96" class="text-gray-700 dark:text-gray-400" />
        <h1 class="text-xl font-semibold text-gray-900 dark:text-white">Error</h1>
        <div v-if="errorMessage" class="text-sm text-red-500 dark:text-red-400" v-html="errorMessage" />
      </div>
    </template>
  </div>
</template>
