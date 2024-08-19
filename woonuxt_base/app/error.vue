<script setup lang="ts">
const route = useRoute();
const { error } = defineProps<{ error: any }>();
const { isShowingCart, toggleCart } = useCart();
const { isShowingMobileMenu, toggleMobileMenu, addBodyClass, removeBodyClass } = useHelpers();

const closeCartAndMenu = () => {
  toggleCart(false);
  toggleMobileMenu(false);
};

watch([isShowingCart, isShowingMobileMenu], () => {
  isShowingCart.value || isShowingMobileMenu.value ? addBodyClass('overflow-hidden') : removeBodyClass('overflow-hidden');
});

watch(
  () => route.path,
  () => closeCartAndMenu(),
);

useSeoMeta({
  title: error?.statusCode ? `Error ${error.statusCode}` : 'Error',
  description: error?.message || '',
});
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <AppHeader />

    <Transition name="slide-from-right">
      <LazyCart v-if="isShowingCart" />
    </Transition>

    <Transition name="slide-from-left">
      <MobileMenu v-if="isShowingMobileMenu" />
    </Transition>

    <div class="flex flex-col items-center justify-center flex-1 gap-4 min-h-[500px]">
      <h1 class="text-6xl font-bold">Error {{ error?.statusCode || '404' }}</h1>
      <p v-if="error?.message" class="text-lg">{{ error.message }}</p>
    </div>

    <Transition name="fade">
      <div v-if="isShowingCart || isShowingMobileMenu" class="bg-black opacity-25 inset-0 z-40 fixed" @click="closeCartAndMenu" />
    </Transition>

    <AppFooter />
  </div>
</template>
