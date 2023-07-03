<script lang="ts" setup>
const { logoutUser, viewer } = useAuth();
const route = useRoute();

const activeTab = computed(() => {
  return route.query.tab || 'my-details';
});
</script>

<template>
  <div class="container">
    <LoginAndRegister v-if="!viewer" />
    <div v-if="viewer" class="flex flex-col items-start w-full gap-8 mb-24 lg:flex-row">
      <nav class="grid w-full gap-1 my-8 text-gray-600 min-w-[240px] top-24 lg:w-auto lg:sticky">
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
          <Icon name="ion:log-out-outline" size="22" />
          {{ $t('messages.account.logout') }}
        </button>
      </nav>

      <main class="flex-1 w-full my-8 rounded-lg">
        <AccountMyDetails v-if="activeTab === 'my-details'" :user="viewer" />
        <div v-else-if="activeTab === 'orders'">
          <OrderList />
        </div>
      </main>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
a.active {
  @apply text-primary;
}
</style>
