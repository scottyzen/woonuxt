<template>
  <div class="relative mx-auto">
    <NuxtImg
      width="1400"
      height="800"
      class="object-cover w-full h-[420px] lg:h-[560px] xl:h-[640px]"
      src="/images/christmas-hero.png"
      alt="Hero image"
      loading="eager"
      sizes="sm:100vw md:1400px"
      fetchpriority="high"
      preload
      placeholder
      placeholder-class="blur-xl" />
    <div class="container absolute inset-0 flex flex-col items-center mb-12 text-center justify-center text-gray-800">
      <h1 class="text-3xl font-bold md:mb-4 md:text-4xl lg:text-6xl">The Christmas Collection</h1>
      <h2 class="text-lg font-bold md:mb-4 lg:text-3xl">Celebrate the season in style</h2>
      <div class="max-w-sm mb-8 text-md font-light lg:max-w-md text-balance">
        <p>Discover thoughtful gifts, cozy textures, and festive favourites for the holidays.</p>
      </div>
      <NuxtLink class="px-6 py-3 font-bold text-white bg-red-700 rounded-xl hover:bg-red-800" to="/products">Shop now</NuxtLink>
    </div>
  </div>
</template>
