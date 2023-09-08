<template>
  <div class="mx-auto relative">
    <img
      width="1400"
      height="800"
      class="object-cover h-[360px] w-full md:h-[420px] lg:h-[560px] xl:h-[640px]"
      src="/images/hero-4.jpg"
      alt="Hero image"
      loading="eager"
      format="webp"
      fit="outside"
      sizes="sm:100vw lg:1400px" />

    <div class="container bg-gradient-to-l flex flex-col from-gray-100 inset-0 text-gray-800 absolute items-start justify-center md:bg-none md:p-12 lg:p-24">
      <h1 class="font-bold text-3xl md:mb-4 md:text-4xl lg:text-6xl">Just landed.</h1>
      <h2 class="font-bold text-lg md:mb-4 lg:text-3xl">The Autumn Collection</h2>
      <div class="font-light max-w-sm text-sm mb-8 lg:max-w-md">
        View the Autumn Collection and discover the latest trends in fashion and accessories. We have everything you need to look your best this season.
      </div>
      <NuxtLink class="rounded-xl font-bold bg-gray-800 text-white py-4 px-8 hover:bg-gray-800" to="/products">Shop now</NuxtLink>
    </div>
  </div>
</template>
