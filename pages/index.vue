<script setup>
const { data } = await useAsyncGql('getProductCategories', { first: 6 });
const productCategories = data.value.productCategories?.nodes || [];

useHead({
  title: `Home | WooNuxt`,
  meta: [
    {
      name: 'description',
      content: 'The best ecommerce store in the world',
    },
  ],
});
</script>

<template>
  <main>
    <HeroBanner />

    <div class="container flex flex-wrap my-16 text-center gap-8 justify-center brand items-center lg:justify-between">
      <img src="/images/logoipsum-211.svg" alt="Brand 1" width="132" height="35" />
      <img src="/images/logoipsum-221.svg" alt="Brand 2" width="119" height="30" />
      <img src="/images/logoipsum-225.svg" alt="Brand 3" width="49" height="48" />
      <img src="/images/logoipsum-280.svg" alt="Brand 4" width="78" height="30" />
      <img src="/images/logoipsum-284.svg" alt="Brand 5" width="70" height="44" />
      <img src="/images/logoipsum-215.svg" alt="Brand 6" width="132" height="40" />
    </div>

    <section class="container my-16">
      <div class="flex items-end justify-between">
        <h2 class="font-semibold text-lg md:text-2xl">{{ $t('messages.shop.shopByCategory') }}</h2>
        <NuxtLink class="text-primary" to="/categories">{{ $t('messages.general.viewAll') }}</NuxtLink>
      </div>
      <div class="mt-8 grid gap-4 grid-cols-2 justify-center md:grid-cols-3 lg:grid-cols-6">
        <CategoryCard v-for="(category, i) in productCategories" :key="i" class="w-full" :node="category" />
      </div>
    </section>

    <section class="container my-24 grid gap-4 lg:grid-cols-4">
      <div class="bg-white rounded-lg flex p-8 gap-8 items-center">
        <img src="/icons/box.svg" width="60" height="60" />
        <div>
          <h4 class="font-semibold text-xl">Free Shipping</h4>
          <p class="text-sm">Free shipping on order over €50</p>
        </div>
      </div>
      <div class="bg-white rounded-lg flex p-8 gap-8 items-center">
        <img src="/icons/moneyback.svg" width="60" height="60" />
        <div>
          <h4 class="font-semibold text-xl">Peace of Mind</h4>
          <p class="text-sm">30 days money back guarantee</p>
        </div>
      </div>
      <div class="bg-white rounded-lg flex p-8 gap-8 items-center">
        <img src="/icons/secure.svg" width="60" height="60" />
        <div>
          <h4 class="font-semibold text-xl">100% Payment Secure</h4>
          <p class="text-sm">Your payment are safe with us.</p>
        </div>
      </div>
      <div class="bg-white rounded-lg flex p-8 gap-8 items-center">
        <img src="/icons/support.svg" width="60" height="60" />
        <div>
          <h4 class="font-semibold text-xl">Support 24/7</h4>
          <p class="text-sm">24/7 Online support</p>
        </div>
      </div>
    </section>
  </main>
</template>
