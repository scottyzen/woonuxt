<script lang="ts" setup>
const { logoutUser, viewer, customer, avatar, isPending } = useAuth();
const { cart } = useCart();
const route = useRoute();

const activeTab = computed(() => route.query.tab || 'my-details');
const showLoader = computed(() => !cart.value);

useSeoMeta({
  title: `My Account`,
});
</script>

<template>
  <div class="container min-h-[600px]">
    <div v-if="showLoader" class="flex flex-col min-h-[500px]">
      <LoadingIcon class="m-auto" />
    </div>
    <template v-else>
      <LazyLoginAndRegister v-if="!viewer" />
      <div v-else class="flex flex-col items-start justify-between w-full lg:gap-12 mb-24 lg:flex-row">
        <div class="mt-2 lg:sticky top-16 w-full lg:max-w-[260px]">
          <section class="my-8 flex gap-4 items-start justify-center w-full">
            <img v-if="avatar" :src="avatar" class="rounded-full aspect-square border border-white" alt="user-image" width="48" height="48" />
            <div class="flex-1 text-balance leading-tight w-full text-ellipsis overflow-hidden">
              <div class="text-lg font-semibold">Welcome, {{ viewer?.firstName }}</div>
              <span v-if="viewer?.email" class="text-gray-400 font-light" :title="viewer?.email">{{ viewer?.email }}</span>
            </div>
            <button class="flex text-gray-700 items-center flex-col p-2 px-4 rounded-lg hover:bg-white hover:text-red-700 lg:hidden" @click="logoutUser">
              <LoadingIcon v-if="isPending" size="22" />
              <Icon v-else name="ion:log-out-outline" size="22" />
              <small>{{ $t('messages.account.logout') }}</small>
            </button>
          </section>
          <hr class="my-8" />
          <nav class="flex text-gray-700 lg:grid flex-wrap w-full gap-1.5 my-8 min-w-[240px] lg:w-auto items-start">
            <NuxtLink to="/my-account?tab=my-details" class="flex items-center gap-4 p-2 px-4" :class="{ active: activeTab == 'my-details' }">
              <Icon name="ion:information-circle-outline" size="22" />
              {{ $t('messages.general.myDetails') }}
            </NuxtLink>
            <NuxtLink to="/my-account?tab=orders" class="flex items-center gap-4 p-2 px-4" :class="{ active: activeTab == 'orders' }">
              <Icon name="ion:bag-check-outline" size="22" />
              {{ $t('messages.shop.order', 2) }}
            </NuxtLink>
            <NuxtLink to="/my-account?tab=downloads" class="flex items-center gap-4 p-2 px-4" :class="{ active: activeTab == 'downloads' }">
              <Icon name="ion:cloud-download-outline" size="22" />
              {{ $t('messages.general.downloads') }}
            </NuxtLink>
            <NuxtLink to="/my-account?tab=wishlist" class="flex items-center gap-4 p-2 px-4" :class="{ active: activeTab == 'wishlist' }">
              <Icon name="ion:heart-outline" size="22" />
              Wishlist
            </NuxtLink>
          </nav>
          <template class="hidden lg:block">
            <hr class="my-8" />
            <button class="flex text-gray-700 items-center gap-4 p-2 px-4 w-full rounded-lg hover:bg-white hover:text-red-700" @click="logoutUser">
              <LoadingIcon v-if="isPending" size="22" />
              <Icon v-else name="ion:log-out-outline" size="22" />
              {{ $t('messages.account.logout') }}
            </button>
          </template>
        </div>

        <main class="flex-1 w-full lg:my-8 rounded-lg max-w-screen-lg lg:sticky top-24">
          <AccountMyDetails v-if="activeTab === 'my-details'" :user="viewer" />
          <OrderList v-else-if="activeTab === 'orders'" />
          <DownloadList v-else-if="activeTab === 'downloads'" />
          <WishList v-else-if="activeTab === 'wishlist'" />
        </main>
      </div>
    </template>
  </div>
</template>

<style lang="postcss" scoped>
nav a {
  @apply rounded-md;

  &.active,
  &:focus,
  &:hover {
    @apply bg-white shadow;
  }

  & svg {
    @media (max-width: 640px) {
      display: none !important;
    }
  }
}
</style>
