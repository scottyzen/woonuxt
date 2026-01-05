<script lang="ts" setup>
const { logoutUser, viewer, avatar, isPending, handlePostLoginRedirect } = useAuth();
const { cart } = useCart();
const route = useRoute();

const activeTab = computed(() => route.query.tab || 'personal-info');
const showLoader = computed(() => !cart.value && !viewer.value);

// Check if user should be redirected and prevent dashboard from showing
const isRedirecting = ref(false);

// Handle redirect only after successful login (when returnUrl is set)
// This prevents redirecting users who are already logged in and navigating to my-account directly
watch(viewer, (newViewer, oldViewer) => {
  // Only redirect if user just logged in (viewer changed from null to a user)
  // and there's a stored return URL
  if (newViewer && !oldViewer && !isRedirecting.value) {
    const redirectResult = handlePostLoginRedirect();
    if (redirectResult) {
      isRedirecting.value = true;
    }
  }
});

useSeoMeta({
  title: `My Account`,
});
</script>

<template>
  <div class="container min-h-[600px] py-8">
    <div v-if="showLoader || isRedirecting" class="flex flex-col min-h-[500px]">
      <LoadingIcon class="m-auto" />
    </div>
    <template v-else>
      <LazyLoginAndRegister v-if="!viewer" />
      <div v-else class="flex flex-col items-start justify-between w-full gap-8 mb-24 lg:flex-row">
        <!-- Enhanced Sidebar -->
        <aside class="w-full lg:w-72 lg:sticky lg:top-20 shrink-0 dark:text-gray-200">
          <!-- User Profile Card -->
          <div class="p-5 mb-6 bg-white border border-gray-100 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <div class="flex items-center gap-6">
              <img v-if="avatar" :src="avatar" class="rounded-full aspect-square ring-4 ring-primary/10" alt="user-image" width="64" height="64" />
              <div
                v-else
                class="flex items-center justify-center w-16 h-16 text-2xl font-bold text-white rounded-full bg-gradient-to-br from-primary to-primary-dark">
                {{ viewer?.firstName?.charAt(0) }}{{ viewer?.lastName?.charAt(0) }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-lg font-semibold text-gray-900 truncate dark:text-white">{{ viewer?.firstName }} {{ viewer?.lastName }}</div>
                <span v-if="viewer?.email" class="block text-sm text-gray-500 truncate dark:text-gray-400" :title="viewer?.email">{{ viewer?.email }}</span>
              </div>
            </div>
          </div>

          <!-- Navigation Card -->
          <nav class="p-3 mb-6 bg-white border border-gray-100 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <NuxtLink to="/my-account?tab=personal-info" class="nav-link" :class="{ active: activeTab == 'personal-info' }">
              <Icon name="ion:person-outline" size="20" />
              <span>Personal Information</span>
            </NuxtLink>
            <NuxtLink to="/my-account?tab=addresses" class="nav-link" :class="{ active: activeTab == 'addresses' }">
              <Icon name="ion:card-outline" size="20" />
              <span>Billing & Shipping</span>
            </NuxtLink>
            <NuxtLink to="/my-account?tab=password" class="nav-link" :class="{ active: activeTab == 'password' }">
              <Icon name="ion:lock-closed-outline" size="20" />
              <span>Password</span>
            </NuxtLink>
            <!--  TODO: Enable when backend support is added for activity logs -->
            <!-- <NuxtLink to="/my-account?tab=activity" class="nav-link" :class="{ active: activeTab == 'activity' }">
              <Icon name="ion:time-outline" size="20" />
              <span>Account Activity</span>
            </NuxtLink> -->
            <div class="h-px my-2 bg-gray-200 dark:bg-gray-700"></div>
            <NuxtLink to="/my-account?tab=orders" class="nav-link" :class="{ active: activeTab == 'orders' }">
              <Icon name="ion:bag-check-outline" size="20" />
              <span>{{ $t('shop.order', 2) }}</span>
            </NuxtLink>
            <NuxtLink to="/my-account?tab=downloads" class="nav-link" :class="{ active: activeTab == 'downloads' }">
              <Icon name="ion:cloud-download-outline" size="20" />
              <span>{{ $t('general.downloads') }}</span>
            </NuxtLink>
            <NuxtLink to="/my-account?tab=wishlist" class="nav-link" :class="{ active: activeTab == 'wishlist' }">
              <Icon name="ion:heart-outline" size="20" />
              <span>Wishlist</span>
            </NuxtLink>
            <div class="h-px my-2 bg-gray-200 dark:bg-gray-700"></div>
            <NuxtLink to="/my-account?tab=settings" class="nav-link" :class="{ active: activeTab == 'settings' }">
              <Icon name="ion:settings-outline" size="20" />
              <span>Settings</span>
            </NuxtLink>
          </nav>

          <!-- Logout Button -->
          <button
            class="flex items-center justify-center w-full gap-3 p-3 text-sm font-semibold text-red-700 transition-colors duration-200 bg-red-100 rounded-lg dark:text-red-400 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/30"
            @click="logoutUser">
            <LoadingIcon v-if="isPending" size="20" color="#B91C1C" />
            <Icon v-else name="ion:log-out" size="20" />
            <span>{{ $t('account.logout') }}</span>
          </button>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 w-full min-w-0">
          <PersonalInformation v-if="activeTab === 'personal-info'" />
          <BillingAndShipping v-else-if="activeTab === 'addresses'" />
          <ChangePassword v-else-if="activeTab === 'password'" />
          <AccountActivity v-else-if="activeTab === 'activity'" />
          <OrderList v-else-if="activeTab === 'orders'" />
          <DownloadList v-else-if="activeTab === 'downloads'" />
          <WishList v-else-if="activeTab === 'wishlist'" />
          <AccountSettings v-else-if="activeTab === 'settings'" />
        </main>
      </div>
    </template>
  </div>
</template>

<style lang="postcss" scoped>
.nav-link {
  @apply flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 transition-all duration-200 mb-1;

  &:hover {
    @apply bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white;
  }

  &.active {
    @apply bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 text-primary font-semibold shadow-sm;

    svg {
      @apply text-primary;
    }
  }

  svg {
    @apply transition-transform duration-200;
  }

  &:hover svg {
    @apply scale-110;
  }
}

@media (max-width: 1024px) {
  aside {
    position: relative !important;
    top: auto !important;
  }
}
</style>
