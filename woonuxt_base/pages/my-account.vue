<script lang="ts" setup>
const { logoutUser, viewer, customer, isPending } = useAuth();
const { cart } = useCart();
const route = useRoute();

const activeTab = computed(() => route.query.tab || 'my-details');
const showLoader = computed(() => !viewer && !customer);
</script>

<template>
  <div class="container min-h-[600px]">
    <div v-if="showLoader || !cart" class="flex flex-col min-h-[500px]">
      <LoadingIcon class="m-auto" />
    </div>
    <template v-else>
      <LazyLoginAndRegister v-if="!viewer" />
      <div v-else class="flex flex-col items-start w-full lg:gap-8 mb-24 lg:flex-row">
        <nav class="flex lg:grid flex-wrap w-full gap-1 my-8 text-gray-600 min-w-[240px] top-24 lg:w-auto lg:sticky">
          <NuxtLink
            to="/my-account?tab=my-details"
            class="flex items-center gap-4 p-3 px-4 rounded-lg hover:bg-white hover:text-primary"
            :class="{ active: activeTab == 'my-details' }">
            <Icon name="ion:information-circle-outline" size="22" />
            {{ $t('messages.general.myDetails') }}
          </NuxtLink>
          <NuxtLink to="/my-account?tab=orders" class="flex items-center gap-4 p-3 px-4 rounded-lg hover:bg-white hover:text-primary" :class="{ active: activeTab == 'orders' }">
            <Icon name="ion:bag-check-outline" size="22" />
            {{ $t('messages.shop.order', 2) }}
          </NuxtLink>
          <NuxtLink
            to="/my-account?tab=downloads"
            class="flex items-center gap-4 p-3 px-4 rounded-lg hover:bg-white hover:text-primary"
            :class="{ active: activeTab == 'downloads' }">
            <Icon name="ion:cloud-download-outline" size="22" />
            {{ $t('messages.general.downloads') }}
          </NuxtLink>
          <button class="flex items-center gap-4 p-3 px-4 rounded-lg hover:bg-white hover:text-primary" @click="logoutUser">
            <LoadingIcon v-if="isPending" size="22" />
            <Icon v-else name="ion:log-out-outline" size="22" />
            {{ $t('messages.account.logout') }}
          </button>
        </nav>

        <main class="flex-1 w-full lg:my-8 rounded-lg">
          <AccountMyDetails v-if="activeTab === 'my-details'" :user="viewer" />
          <OrderList v-else-if="activeTab === 'orders'" />
        </main>
      </div>
    </template>
  </div>
</template>

<style lang="postcss" scoped>
a.active {
  @apply text-primary;
}
</style>
