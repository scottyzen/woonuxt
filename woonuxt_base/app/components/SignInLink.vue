<script setup lang="ts">
const { viewer, avatar, logoutUser, isPending, wishlistLink, navigateToLogin } = useAuth();
const route = useRoute();

const linkTitle = computed<string>(() => viewer.value?.username || 'Sign In');
</script>

<template>
  <NuxtLink to="/my-account" :title="linkTitle" @click="navigateToLogin(route.fullPath)" class="hidden sm:inline-flex aspect-square items-center">
    <Transition name="pop-in" mode="out-in">
      <span v-if="avatar" class="relative avatar">
        <img
          :src="avatar"
          class="rounded-full transform scale-125 shadow-md overflow-hidden border border-white my-auto"
          width="22"
          height="22"
          :alt="linkTitle" />
        <div class="account-dropdown font-semibold">
          <Button to="/my-account" size="sm" variant="ghost" class="w-full justify-start" icon="ion:person"> My Account </Button>
          <Button :to="wishlistLink" size="sm" variant="ghost" class="w-full justify-start" icon="ion:heart"> Wishlist </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            class="w-full justify-start text-red-600 hover:bg-red-50"
            icon="ion:log-out"
            @click="logoutUser"
            :loading="isPending">
            Logout
          </Button>
        </div>
      </span>
      <Icon v-else name="ion:person-outline" size="22" class="border border-transparent" />
    </Transition>
  </NuxtLink>
</template>

<style scoped>
@reference "#tailwind";

.pop-in-enter-active,
.pop-in-leave-active {
  transition: transform 0.3s;
}

.pop-in-enter-from,
.pop-in-leave-to {
  transform: scale(0);
}

.avatar {
  .account-dropdown {
    @apply absolute gap-1 top-6 -right-2 z-50 p-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg dark:shadow-gray-900/50 text-sm text-gray-700 dark:text-gray-300 hidden;

    a,
    button {
      @apply flex gap-2 items-center p-2 rounded-sm whitespace-nowrap min-w-50;
    }

    a:hover {
      @apply bg-gray-100 dark:bg-gray-700;
    }

    button {
      @apply text-red-600 dark:text-red-400;
    }

    button:hover {
      @apply bg-red-50 dark:bg-red-900/20;
    }
  }

  &:hover .account-dropdown {
    @apply grid;
  }
}
</style>
