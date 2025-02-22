<template>
  <div class="container mx-auto p-4">
    <div class="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
      <h1 class="text-2xl font-bold mb-4">Bitcoin Payment</h1>
      
      <div v-if="loading" class="text-center">
        <div class="animate-pulse">
          <div class="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
          <div class="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      </div>

      <div v-else-if="error" class="text-red-600 text-center p-4 bg-red-50 rounded">
        {{ error }}
      </div>

      <div v-else>
        <!-- Payment Status -->
        <div class="mb-6">
          <div class="flex items-center justify-center gap-2 mb-4">
            <div class="h-3 w-3 rounded-full" 
                 :class="{
                   'bg-yellow-400 animate-pulse': paymentStatus === 'pending',
                   'bg-green-500': paymentStatus === 'completed',
                   'bg-red-500': paymentStatus === 'expired'
                 }">
            </div>
            <span class="font-medium" :class="{
              'text-yellow-700': paymentStatus === 'pending',
              'text-green-700': paymentStatus === 'completed',
              'text-red-700': paymentStatus === 'expired'
            }">
              {{ statusMessage }}
            </span>
          </div>
        </div>

        <!-- BTCPay Checkout Container -->
        <div class="btcpay-checkout-container">
          <div 
            v-if="checkoutMode === 'modal'"
            id="btcpay-modal-checkout"
            :data-invoice-id="invoiceId"
            class="rounded-lg overflow-hidden shadow-lg"
          ></div>
          
          <div v-else class="rounded-lg overflow-hidden shadow-lg">
            <iframe 
              :src="checkoutUrl"
              class="w-full min-h-[600px]"
              frameborder="0"
              allowfullscreen
            ></iframe>
          </div>
        </div>

        <!-- Help Text -->
        <div class="mt-6 text-center text-sm text-gray-600">
          <p>Having trouble? <a href="#" @click.prevent="reloadCheckout" class="text-blue-600 hover:text-blue-800">Reload payment window</a></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const router = useRouter();
const orderId = route.query.order_id;
const orderKey = route.query.key;
const { cart } = useCart();

const loading = ref(true);
const error = ref(null);
const checkoutUrl = ref(null);
const checkoutMode = ref(null);
const paymentStatus = ref('pending');
const invoiceId = ref(null);

let paymentStatusTimeout = null;

const statusMessage = computed(() => {
  switch (paymentStatus.value) {
    case 'pending':
      return 'Waiting for payment...';
    case 'completed':
      return 'Payment completed!';
    case 'expired':
      return 'Payment expired';
    default:
      return 'Unknown status';
  }
});

const checkPaymentStatus = async () => {
  try {
    const response = await fetch(
      `${process.env.GQL_HOST.replace('graphql', '')}?wc-api=BTCPay_Check_Payment&order_id=${orderId}&order_key=${orderKey}`
    );
    const data = await response.json();
    
    if (data.invoiceId) {
      invoiceId.value = data.invoiceId;
    }

    paymentStatus.value = data.status;

    if (data.status === 'completed') {
      setTimeout(() => {
        router.push(`/checkout/order-received/${orderId}`);
      }, 2000);
    } else if (data.status === 'expired') {
      error.value = 'Payment time expired. Please try again.';
    } else {
      paymentStatusTimeout = setTimeout(checkPaymentStatus, 5000);
    }
  } catch (e) {
    console.error('Error checking payment status:', e);
  }
};

const reloadCheckout = async () => {
  loading.value = true;
  error.value = null;
  try {
    await initializeCheckout();
  } finally {
    loading.value = false;
  }
};

const initializeCheckout = async () => {
  try {
    // Ensure we have a cart before proceeding
    if (!cart.value) {
      error.value = 'No active cart found. Please return to checkout.';
      return;
    }

    const response = await fetch(
      `${process.env.GQL_HOST.replace('graphql', '')}?wc-api=BTCPay_Checkout&order_id=${orderId}&order_key=${orderKey}`
    );
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }

    checkoutUrl.value = data.checkoutUrl;
    checkoutMode.value = data.checkoutMode;
    invoiceId.value = data.invoiceId;

    if (checkoutMode.value === 'modal') {
      const script = document.createElement('script');
      script.src = data.modalScriptUrl;
      document.head.appendChild(script);
      script.onload = () => {
          if (window.btcpay) {
              window.btcpay.modal(invoiceId.value);
          }
      }
    }

    checkPaymentStatus();

  } catch (e) {
    error.value = 'Failed to load payment details. Please try again or contact support.';
    console.error('BTCPay error:', e);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (!orderId || !orderKey) {
    error.value = 'Invalid order details. Please contact support.';
    loading.value = false;
    return;
  }
  
  // Check if we have an active cart
  if (!cart.value) {
    error.value = 'No active cart found. Please return to checkout.';
    loading.value = false;
    return;
  }

  initializeCheckout();
});

onUnmounted(() => {
  if (paymentStatusTimeout) {
    clearTimeout(paymentStatusTimeout);
  }
});
</script>

<style scoped>
.btcpay-checkout-container {
  @apply transition-all duration-300 ease-in-out;
}

.btcpay-checkout-container:hover {
  @apply transform scale-[1.01];
}
</style>
