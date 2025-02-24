<template>
  <div class="container mx-auto p-4">
    <div class="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
      <h1 class="text-2xl font-bold mb-4">Bitcoin Payment</h1>
      
      <!-- Show clear loading state -->
      <div v-if="loading" class="text-center p-4">
        <LoadingIcon />
        <p class="mt-2">Initializing payment...</p>
      </div>

      <!-- Show errors prominently -->
      <div v-else-if="error" class="text-red-600 text-center p-4 bg-red-50 rounded">
        {{ error }}
        <button 
          @click="reloadCheckout" 
          class="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Try Again
        </button>
      </div>

      <!-- Show BTCPay invoice -->
      <div v-else class="btcpay-checkout-container">
        <div v-if="checkoutUrl" class="border rounded-lg overflow-hidden">
          <iframe 
            :src="checkoutUrl"
            class="w-full min-h-[600px]"
            frameborder="0"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const router = useRouter();
const { emptyCart, refreshCart } = useCart();

const orderId = computed(() => route.query.order_id);
const orderKey = computed(() => route.query.key);

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

// Prevent direct access without order details
onBeforeMount(() => {
  if (!orderId.value || !orderKey.value) {
    console.error('Missing order details');
    router.push('/checkout');
    return;
  }
});

const checkPaymentStatus = async () => {
  try {
    const response = await fetch(
      `${process.env.GQL_HOST.replace('graphql', '')}?wc-api=BTCPay_Check_Payment&order_id=${orderId.value}&order_key=${orderKey.value}`,
      {
        headers: {
          'Accept': 'application/json',
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Payment status:', data);
    
    paymentStatus.value = data.status;

    if (data.status === 'completed') {
      // Only empty cart and redirect after confirmed payment
      await emptyCart();
      await refreshCart();
      setTimeout(() => {
        router.push(`/checkout/order-received/${orderId.value}/?key=${orderKey.value}&payment=btcpay`);
      }, 2000);
    } else if (data.status === 'expired') {
      error.value = 'Payment time expired. Please try again.';
    } else {
      paymentStatusTimeout = setTimeout(checkPaymentStatus, 5000);
    }
  } catch (e) {
    console.error('Error checking payment status:', e);
    error.value = 'Error checking payment status. Please refresh the page.';
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
    const response = await fetch(
      `${process.env.GQL_HOST.replace('graphql', '')}?wc-api=BTCPay_Checkout&order_id=${orderId.value}&order_key=${orderKey.value}`
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
  if (!orderId.value || !orderKey.value) {
    error.value = 'Invalid order details. Please contact support.';
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
