<script lang="ts" setup>
const { data } = await useAsyncGql('getProductCategories', { first: 6 });
const productCategories = data.value?.productCategories?.nodes || [];

useHead({
  title: `Home | WooNuxt`,
  meta: [{ name: 'description', content: 'The best ecommerce store in the world' }],
  link: [{ rel: 'canonical', href: 'https://v3.woonuxt.com/' }],
});
</script>

<template>
  <main>
    <HeroBanner />

    <div class="container flex flex-wrap items-center justify-center my-16 text-center gap-x-8 gap-y-4 brand lg:justify-between">
      <img  src="../../static/images/logoipsum-211.svg" alt="Brand 1" width="132" height="35" />
      <img  src="../../static/images/logoipsum-221.svg" alt="Brand 2" width="119" height="30" />
      <img  src="../../static/images/logoipsum-225.svg" alt="Brand 3" width="49" height="48" />
      <img  src="../../static/images/logoipsum-280.svg" alt="Brand 4" width="78" height="30" />
      <img  src="../../static/images/logoipsum-284.svg" alt="Brand 5" width="70" height="44" />
      <img  src="../../static/images/logoipsum-215.svg" alt="Brand 6" width="132" height="40" />
    </div>

    <section class="container my-16">
      <div class="flex items-end justify-between">
        <h2 class="text-lg font-semibold md:text-2xl">{{ $t('messages.shop.shopByCategory') }}</h2>
        <NuxtLink class="text-primary" to="/categories">{{ $t('messages.general.viewAll') }}</NuxtLink>
      </div>
      <div class="grid justify-center grid-cols-2 gap-4 mt-8 md:grid-cols-3 lg:grid-cols-6">
        <CategoryCard v-for="(category, i) in productCategories" :key="i" class="w-full" :node="category" />
      </div>
      <div class="container relative flex pt-20 items-center">
        <span class="flex-shrink mx-4 text-2xl text-gray-950">New products</span>
        <div class="flex-grow border-t border-gray-400"></div>
      </div>
      <div class="container ">
        <div class="grid grid-cols-4 overflow-y-auto justify-center gap-4  p-2 w-full ">
          <card class=" rounded-xl shadow-lg p-2 w-80 ">
            <cardImage class=" ">
              <img class=" w-full  rounded-lg  " src="../static/images/hero-2.jpeg" alt="">
            </cardImage>
            <cardTitle class="flex p-2 m-2">
              <h1 class=" text-2xl"> Product n1</h1>
              <div class="  border-1 bg-pink-500 text-white m-2 px-4 py-1 rounded-full">New</div>
            </cardTitle>
            <cardInfo class="flex p-2 m-2">
              <p>
                Product n1 Product n1 Product n1 Product n1 Product n1 Product n1 Product n1 Product n1
              </p>
            </cardInfo>
            <div class="flex justify-end ">
              <Button class="  border-1 bg-blue-500 text-white m-2 px-4 py-1 rounded-lg">More</Button>
            </div>
          </card>
        </div>
      </div>
      <div class="container relative flex p-5 items-center">
        <div class="flex-grow border-t border-gray-400"></div>
        <span class="flex-shrink mx-4 text-2xl"><button
            class=" border-1 px-3 border-gray-640000 outline-gray-400 text-gray-400 outline-1 outline text-center items-center align-middle rounded-full p-1">
            + More new products</button></span>
      </div>
    </section>

    <section class="container grid gap-4 my-24 md:grid-cols-2 lg:grid-cols-4">
      <div class="flex items-center gap-8 p-8 bg-white rounded-lg">
        <img  src="../../static/icons/box.svg" width="60" height="60" alt="Free Shipping" loading="lazy" />
        <div>
          <h3 class="text-xl font-semibold">Free Shipping</h3>
          <p class="text-sm">Free shipping on order over €50</p>
        </div>
      </div>
      <div class="flex items-center gap-8 p-8 bg-white rounded-lg">
        <img  src="../../static/icons/moneyback.svg" width="60" height="60" alt="Money Back" loading="lazy" />
        <div>
          <h3 class="text-xl font-semibold">Peace of Mind</h3>
          <p class="text-sm">30 days money back guarantee</p>
        </div>
      </div>
      <div class="flex items-center gap-8 p-8 bg-white rounded-lg">
        <img  src="../../static/icons/secure.svg" width="60" height="60" alt="Secure Payment" loading="lazy" />
        <div>
          <h3 class="text-xl font-semibold">100% Payment Secure</h3>
          <p class="text-sm">Your payment are safe with us.</p>
        </div>
      </div>
      <div class="flex items-center gap-8 p-8 bg-white rounded-lg">
        <img  src="../../static/icons/support.svg" width="60" height="60" alt="Support 24/7" loading="lazy" />
        <div>
          <h3 class="text-xl font-semibold">Support 24/7</h3>
          <p class="text-sm">24/7 Online support</p>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.brand img {
  max-height: min(8vw, 120px);
  object-fit: contain;
  object-position: center;
}
</style>
