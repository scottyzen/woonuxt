<script setup>
const { cart, isUpdatingCoupon, applyCoupon, removeCoupon } = useCart();
const couponCode = ref('');
const errorMessage = ref('');

async function submitCoupon() {
  const { message } = await applyCoupon(couponCode.value);
  if (message) {
    errorMessage.value = message;
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
        :placeholder="$t('messages.shop.couponCode')"
        class="bg-white border rounded-md outline-none border-gray-300 shadow-sm w-full py-2 px-4"
        required />
      <button
        class="border rounded-md flex outline-none bg-gray-800 shadow-sm text-white min-w-20 py-2 px-4 justify-center items-center"
        :disabled="isUpdatingCoupon">
        <LoadingIcon v-if="isUpdatingCoupon" color="#fff" size="16" />
        <span v-else>{{ $t('messages.general.apply') }}</span>
      </button>
    </form>
    <Transition name="scale-y" mode="out-in">
      <div v-if="errorMessage" class="mt-2 text-xs text-red-600" v-html="errorMessage"></div>
    </Transition>
    <Transition name="scale-y" mode="out-in">
      <div v-if="cart && cart.appliedCoupons" class="font-semibold text-xs uppercase">
        <div v-for="coupon in cart.appliedCoupons" :key="coupon.code" class="flex flex-wrap flex-2 mt-2">
          <div
            class="bg-primary border-primary border rounded-md flex bg-opacity-5 border-opacity-10 text-primary leading-none p-1.5 gap-1 items-center">
            <span>{{ coupon.code }}</span>
            <Icon
              name="ion:close"
              class="rounded-full cursor-pointer hover:bg-primary hover:text-white"
              @click="removeCoupon(coupon.code)" />
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
