<template>
  <div class="relative mx-auto">
    <NuxtImg
      width="1400"
      height="800"
      class="object-cover w-full h-[420px] lg:h-[560px] xl:h-[640px]"
      src="/images/hero-4.jpg"
      alt="Hero image"
      loading="eager"
      format="webp"
      fit="outside"
      sizes="sm:100vw lg:1400px"
      fetchpriority="high"
      preload />
    <div class="container absolute inset-0 flex flex-col items-start justify-center text-gray-800 bg-gradient-to-l from-gray-100 md:bg-none md:p-12 lg:p-24">
      <h1 class="text-3xl font-bold md:mb-4 md:text-4xl lg:text-6xl">Just landed.</h1>
      <h2 class="text-lg font-bold md:mb-4 lg:text-3xl">The Autumn Collection</h2>
      <div class="max-w-sm mb-8 text-sm font-light lg:max-w-md">
        View the Autumn Collection and discover the latest trends in fashion and accessories. We have everything you need to look your best this season.
      </div>
      <NuxtLink class="px-8 py-4 font-bold text-white bg-gray-800 rounded-xl hover:bg-gray-800" to="/products">Shop now</NuxtLink>
    </div>
  </div>
</template>
