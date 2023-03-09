<template>
  <div class="container">
    <LoginAndRegister v-if="!viewer" />
    <div v-if="viewer" class="flex flex-col mb-24 w-full gap-8 items-start lg:flex-row">
      <nav class="min-w-xs my-8 w-full grid top-24 text-gray-600 gap-1 lg:w-auto lg:sticky">
        <NuxtLink
          to="/my-account?tab=my-details"
          class="rounded-xl flex p-3 px-4 gap-4 items-center hover:bg-purple-50 hover:text-purple-800"
          :class="{ active: activeTab == 'my-details' }">
          <Icon name="ion:information-circle-outline" size="22" />
          {{ $t('messages.general.myDetails') }}
        </NuxtLink>
        <NuxtLink
          to="/my-account?tab=orders"
          class="rounded-xl flex p-3 px-4 gap-4 items-center hover:bg-purple-50 hover:text-purple-800"
          :class="{ active: activeTab == 'orders' }">
          <Icon name="ion:bag-check-outline" size="22" />
          {{ $t('messages.shop.order', 2) }}
        </NuxtLink>
        <NuxtLink
          to="/my-account?tab=downloads"
          class="rounded-xl flex p-3 px-4 gap-4 items-center hover:bg-purple-50 hover:text-purple-800"
          :class="{ active: activeTab == 'downloads' }">
          <Icon name="ion:cloud-download-outline" size="22" />
          {{ $t('messages.general.downloads') }}
        </NuxtLink>
        <button class="rounded-xl flex p-3 px-4 gap-4 items-center hover:bg-purple-50 hover:text-purple-800" @click="logoutUser">
          <Icon name="ion:log-out-outline" size="22" />
          {{ $t('messages.account.logout') }}
        </button>
      </nav>

      <main class="rounded-lg flex-1 my-8 w-full">
        <AccountMyDetails v-if="activeTab === 'my-details'" :user="viewer" />
        <div v-else-if="activeTab === 'orders'">
          <!-- <h2 class="font-semibold text-lg">Orders</h2> -->
          <OrderList />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
const { loginUser, logoutUser, viewer, isPending } = useAuth();
const route = useRoute();

const activeTab = computed(() => {
  return route.query.tab || 'my-details';
});
</script>

<style lang="postcss" scoped>
a.active {
  @apply bg-purple-50 text-gray-800;
}
</style>
