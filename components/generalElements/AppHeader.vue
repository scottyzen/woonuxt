<template>
  <header class="sticky top-0 z-40 bg-white shadow-sm shadow-light-500">
    <div class="container flex items-center justify-between py-4">
      <div class="flex items-center">
        <MenuTrigger class="md:hidden" />
        <Logo class="md:w-[160px]" />
      </div>
      <MainMenu class="items-center hidden gap-6 text-sm text-gray-500 md:flex lg:px-4" />
      <div class="flex gap-4 justify-end items-center md:w-[160px] flex-1 ml-auto">
        <ProductSearch class="md:w-[160px] hidden md:inline-flex" />
        <NuxtLink to="/wishlist" title="Wishlist">
          <Icon name="ion:heart-outline" size="20" />
        </NuxtLink>
        <SignInLink />
        <CartTrigger />
      </div>
    </div>
  </header>
</template>
