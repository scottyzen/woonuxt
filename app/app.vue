<script setup lang="ts">
import AppHeader from './components/generalElements/AppHeader.vue';
import AppFooter from './components/generalElements/AppFooter.vue';

const route = useRoute();
const { isShowingCart, toggleCart } = useCart();
const { isShowingMobileMenu, toggleMobileMenu, addBodyClass, removeBodyClass } = useHelpers();
const { siteName } = useAppConfig();
const config = useRuntimeConfig();

const primaryColor = computed(() => config.public.PRIMARY_COLOR || '#3d7b3d');
const safePrimaryColor = computed(() => (/^#[0-9a-f]{6}$/i.test(String(primaryColor.value).trim()) ? primaryColor.value : '#3d7b3d'));
const closeCartAndMenu = () => {
  toggleCart(false);
  toggleMobileMenu(false);
};

watch([isShowingCart, isShowingMobileMenu], () => {
  isShowingCart.value || isShowingMobileMenu.value ? addBodyClass('overflow-hidden') : removeBodyClass('overflow-hidden');
});
watch(() => route.path, closeCartAndMenu);
useHead({
  titleTemplate: `%s - ${siteName}`,
  style: [{ innerHTML: `:root { --color-primary: ${safePrimaryColor.value}; }` }],
  link: [{ rel: 'icon', type: 'image/svg+xml', href: '/images/icon.svg' }],
});
</script>

<template>
  <NuxtPwaManifest />
  <NuxtLoadingIndicator />
  <div class="flex min-h-screen" style="flex-direction: column">
    <AppHeader />
    <Transition name="slide-from-right"><LazyCart v-if="isShowingCart" /></Transition>
    <Transition name="slide-from-left"><LazyMobileMenu v-if="isShowingMobileMenu" /></Transition>
    <NuxtPage />
    <Transition name="fade"
      ><div v-if="isShowingCart || isShowingMobileMenu" class="fixed inset-0 z-40 bg-black opacity-25" @click="closeCartAndMenu"></div
    ></Transition>
    <AppFooter />
  </div>
</template>
