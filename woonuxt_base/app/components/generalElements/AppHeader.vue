<script setup lang="ts">

const { isShowingSearch } = useSearching()
const isMenuOpen = ref(false)
</script>

<template>
  <header class="sticky top-0 z-40 bg-white shadow-sm shadow-light-500">
    <div class="container flex items-center justify-between py-4">
      <div class="flex items-center">
        <!-- Mobile menu trigger -->
        <button
          class="lg:hidden p-2 rounded hover:bg-gray-100 mr-2"
          @click="isMenuOpen = true"
          aria-label="Open menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
        <Logo class="md:w-[160px]" />
      </div>

      <MainMenu class="items-center hidden gap-6 text-sm text-gray-500 lg:flex lg:px-4" />

      <div class="flex justify-end items-center md:w-[160px] flex-1 ml-auto gap-4 md:gap-6">
        <ProductSearch class="hidden sm:inline-flex max-w-[320px] w-[60%]" />
        <SearchTrigger />
        <div class="flex gap-4 items-center">
          <SignInLink />
          <CartTrigger />
        </div>
      </div>
    </div>

    <Transition name="scale-y" mode="out-in">
      <div class="container mb-3 -mt-1 sm:hidden" v-if="isShowingSearch">
        <ProductSearch class="flex w-full" />
      </div>
    </Transition>

    <MobileMenu v-model:open="isMenuOpen" />
  </header>
</template>
