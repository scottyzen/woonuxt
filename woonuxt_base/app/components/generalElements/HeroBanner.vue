<template>
  <div class="relative mx-auto">
    <NuxtPicture
      width="1400"
      height="800"
      src="/images/hero-4.jpg"
      alt="Hero image"
      loading="eager"
      sizes="sm:100vw md:100vw lg:100vw xl:100vw 2xl:1400px"
      :preload="{ fetchPriority: 'high' }"
      :img-attrs="{ class: 'object-cover w-full h-[420px] lg:h-[560px] xl:h-[640px]' }" />
    <div class="container absolute inset-0 flex flex-col items-start justify-center bg-linear-to-l from-gray-200 sm:bg-none">
      <h1 class="text-3xl font-bold md:mb-4 md:text-4xl lg:text-6xl">Just landed.</h1>
      <h2 class="text-lg font-bold md:mb-4 lg:text-3xl">The New Year Collection</h2>
      <div class="max-w-sm mb-8 text-md font-light lg:max-w-md text-balance">
        <p>Our latest collection is here. Discover the latest trends and styles for the new year.</p>
      </div>
      <NuxtLink class="px-6 py-3 font-bold text-white bg-gray-800 rounded-xl hover:bg-gray-800" to="/products">Shop now</NuxtLink>
    </div>
  </div>
</template>
