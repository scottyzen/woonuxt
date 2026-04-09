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
        class="w-full bg-gray-50 border border-gray-300 rounded-md shadow-inner outline-hidden px-4 py-2 text-base text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        required />
      <Button :loading="isUpdatingCoupon" :disabled="couponCode === '' || isUpdatingCoupon" type="submit" variant="primary" class="min-w-20">
        {{ $t('general.apply') }}
      </Button>
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
