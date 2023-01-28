<template>
  <LoginAndRegisterForms v-if="!user" />
  <div v-else class="container">
    <h1 class="font-semibold my-8 text-xl">My Account</h1>

    <div class="flex flex-col mb-24 w-full gap-8 items-start lg:flex-row" v-if="user">
      <nav class="min-w-xs my-8 w-full grid top-24 text-gray-600 gap-1 lg:w-auto lg:sticky">
        <NuxtLink to="/account?tab=my-details" class="rounded-xl flex p-3 px-4 gap-4 items-center hover:bg-purple-50 hover:text-purple-800" :class="{ active: activeTab == 'my-details' }">
          <Icons icon="info" :size="22" />My Details
        </NuxtLink>
        <NuxtLink to="/account?tab=orders" class="rounded-xl flex p-3 px-4 gap-4 items-center hover:bg-purple-50 hover:text-purple-800" :class="{ active: activeTab == 'orders' }">
          <Icons icon="bag" :size="22" />Orders
        </NuxtLink>
        <NuxtLink to="/account?tab=downloads" class="rounded-xl flex p-3 px-4 gap-4 items-center hover:bg-purple-50 hover:text-purple-800" :class="{ active: activeTab == 'downloads' }">
          <Icons icon="download" :size="22" />Downloads
        </NuxtLink>
        <NuxtLink to="/logout/" class="rounded-xl flex p-3 px-4 gap-4 items-center hover:bg-purple-50 hover:text-purple-800">
          <Icons icon="logout" :size="22" />Logout
        </NuxtLink>
      </nav>

      <main class="rounded-xl flex-1 w-full md:bg-white md:shadow md:p-12">
        <AccountMyDetails :user="user" v-if="activeTab === 'my-details'" />
        <div v-else-if="activeTab === 'orders'">
          <!-- <h2 class="font-semibold text-lg">Orders</h2> -->
          <OrderList />
        </div>
      </main>
    </div>
    <!-- <pre>{{ user }}</pre> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: null,
    };
  },
  head() {
    return { title: "Account" };
  },
  computed: {
    currentUserValue() {
      return this.$store.state.user;
    },
    activeTab() {
      return this.$route.query.tab || "my-details";
    },
  },
  watch: {
    currentUserValue: {
      handler(value) {
        if (value) {
          this.user = JSON.parse(JSON.stringify(value));
        }
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>
