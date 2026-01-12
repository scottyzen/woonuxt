<script setup lang="ts">
const { cart, isUpdatingCoupon, applyCoupon, removeCoupon } = useCart();
const couponCode = ref<string>('');
const errorMessage = ref<string>('');

async function submitCoupon(): Promise<void> {
  const response = await applyCoupon(couponCode.value);
  if (!response.success && response.error) {
    errorMessage.value = response.error;
  } else {
    couponCode.value = '';
    errorMessage.value = '';
  }
}
</script>

<template>
  <div>
    <form class="flex gap-1" @submit.prevent="submitCoupon">
      <input
        id="couponCode"
        v-model="couponCode"
        type="text"
        :placeholder="$t('shop.couponCode')"
        class="w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-xs outline-hidden dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        required />
      <button
        class="flex items-center justify-center px-4 py-2 text-white bg-gray-800 border rounded-md shadow-xs outline-hidden min-w-20 disabled:cursor-not-allowed disabled:bg-gray-400"
        :disabled="isUpdatingCoupon || couponCode === ''">
        <LoadingIcon v-if="isUpdatingCoupon" color="#fff" size="16" />
        <span v-else>{{ $t('general.apply') }}</span>
      </button>
    </form>
    <Transition name="scale-y" mode="out-in">
      <div v-if="errorMessage" class="mt-2 text-xs text-red-600" v-html="errorMessage"></div>
    </Transition>
    <Transition name="scale-y" mode="out-in">
      <div v-if="cart && cart.appliedCoupons" class="text-xs font-semibold uppercase flex flex-wrap gap-2">
        <div v-for="(coupon, index) in cart.appliedCoupons" :key="coupon?.code || index" class="flex flex-wrap mt-2 flex-2">
          <div v-if="coupon?.code" class="bg-primary/5 border-primary/10 border rounded-md flex text-primary leading-none p-1.5 gap-1 items-center">
            <span v-html="coupon.code" />
            <Icon name="ion:close" class="rounded-full cursor-pointer hover:bg-primary hover:text-white" @click="removeCoupon(coupon.code)" />
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
