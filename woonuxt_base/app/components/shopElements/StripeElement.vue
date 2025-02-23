<script setup lang="ts">
const { cart } = useCart();
const { btcpay } = defineProps(['btcpay']);

const rawCartTotal = computed(() => cart.value && parseFloat(cart.value.rawTotal as string));
const emit = defineEmits(['updateElement']);

const createBTCPayInvoice = async () => {
  try {
    const invoice = await btcpay.createInvoice({
      price: rawCartTotal.value,
      currency: 'EUR'
    });
    emit('updateElement', invoice);
  } catch (err) {
    console.error('Error creating BTCPay invoice:', err);
  }
};

onMounted(() => {
  createBTCPayInvoice();
});
</script>

<template>
  <div id="btcpay-element">
    <!-- BTCPay invoice will be displayed here -->
  </div>
</template>
