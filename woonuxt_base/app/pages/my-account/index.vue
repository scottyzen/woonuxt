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
        <aside class="w-full lg:w-72 lg:sticky lg:top-20 shrink-0">
          <!-- User Profile Card -->
          <div class="bg-white rounded-lg shadow-sm p-5 mb-6">
            <div class="flex gap-6 items-center">
              <img v-if="avatar" :src="avatar" class="rounded-full aspect-square ring-4 ring-primary/10" alt="user-image" width="64" height="64" />
              <div
                v-else
                class="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-2xl font-bold">
                {{ viewer?.firstName?.charAt(0) }}{{ viewer?.lastName?.charAt(0) }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-lg font-semibold text-gray-900 truncate">{{ viewer?.firstName }} {{ viewer?.lastName }}</div>
                <span v-if="viewer?.email" class="text-sm text-gray-500 block truncate" :title="viewer?.email">{{ viewer?.email }}</span>
              </div>
            </div>
          </div>

          <!-- Navigation Card -->
          <nav class="bg-white rounded-lg shadow-sm p-3 mb-6">
            <NuxtLink to="/my-account?tab=personal-info" class="nav-link" :class="{ active: activeTab == 'personal-info' }">
              <Icon name="ion:person-outline" size="20" />
              <span>Personal Information</span>
            </NuxtLink>
            <NuxtLink to="/my-account?tab=addresses" class="nav-link" :class="{ active: activeTab == 'addresses' }">
              <Icon name="ion:card-outline" size="20" />
              <span>Billing & Payments</span>
            </NuxtLink>
            <NuxtLink to="/my-account?tab=password" class="nav-link" :class="{ active: activeTab == 'password' }">
              <Icon name="ion:lock-closed-outline" size="20" />
              <span>Password</span>
            </NuxtLink>
            <div class="h-px bg-gray-200 my-2"></div>
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
          </nav>

          <!-- Logout Button -->
          <button
            class="w-full flex items-center justify-center gap-3 p-3 rounded-lg text-sm font-semibold text-red-700 bg-red-100 hover:bg-red-200 transition-colors duration-200"
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
          <OrderList v-else-if="activeTab === 'orders'" />
          <DownloadList v-else-if="activeTab === 'downloads'" />
          <WishList v-else-if="activeTab === 'wishlist'" />
        </main>
      </div>
    </template>
  </div>
</template>

<style lang="postcss" scoped>
.nav-link {
  @apply flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 transition-all duration-200 mb-1;

  &:hover {
    @apply bg-gray-50 text-gray-900;
  }

  &.active {
    @apply bg-gradient-to-r from-primary/10 to-primary/5 text-primary font-semibold shadow-sm;

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
