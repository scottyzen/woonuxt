<script setup lang="ts">
const { viewer, avatar, logoutUser, isPending, wishlistLink } = useAuth();
const linkTitle = computed<string>(() => viewer.value?.username || 'Sign In');
</script>

<template>
  <NuxtLink to="/my-account" :title="linkTitle" class="hidden sm:inline-flex aspect-square items-center relative group">
    <Transition name="pop-in" mode="out-in">
      <span v-if="avatar" class="relative avatar">
        <img
          :src="avatar"
          class="rounded-full transform scale-125 shadow-md overflow-hidden border-2 border-white hover:border-blue-200 transition-all duration-300 my-auto"
          width="24"
          height="24"
          :alt="linkTitle" />
        <div class="account-dropdown">
          <NuxtLink :to="wishlistLink" class="hover:bg-blue-50 transition-colors duration-200">
            <Icon name="ion:heart-outline" size="16" class="text-blue-600" />
            <span>Wishlist</span>
          </NuxtLink>
          <NuxtLink to="/my-account" class="hover:bg-blue-50 transition-colors duration-200">
            <Icon name="ion:person-outline" size="16" class="text-blue-600" />
            <span>My Account</span>
          </NuxtLink>
          <button class="text-red-600 hover:bg-red-50 transition-colors duration-200" @click.prevent="logoutUser">
            <LoadingIcon v-if="isPending" size="16" />
            <Icon v-else name="ion:log-out-outline" size="16" />
            <span>Logout</span>
          </button>
        </div>
      </span>
      <div v-else class="p-1.5 rounded-full hover:bg-blue-50 transition-all duration-300">
        <Icon name="ion:person-outline" size="22" class="text-gray-700 group-hover:text-blue-600 transition-colors duration-300 transform group-hover:scale-110" />
      </div>
    </Transition>
  </NuxtLink>
</template>

<style scoped lang="postcss">
.pop-in-enter-active,
.pop-in-leave-active {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.pop-in-enter-from,
.pop-in-leave-to {
  transform: scale(0);
  opacity: 0;
}

.avatar {
  .account-dropdown {
    @apply absolute gap-2 top-8 -right-2 z-50 p-2 bg-white border border-gray-200 rounded-lg shadow-lg text-sm text-gray-700 hidden;
    transform: translateY(10px);
    opacity: 0;
    transition: all 0.3s ease;

    a,
    button {
      @apply flex gap-2 items-center p-2 rounded whitespace-nowrap min-w-[200px];
    }
  }

  &:hover .account-dropdown {
    @apply grid;
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
