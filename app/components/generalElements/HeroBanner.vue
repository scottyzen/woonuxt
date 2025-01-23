<template>
  <div class="relative mx-auto">
    <NuxtImg
      width="2000"
      height="1143"
      class="object-cover w-full h-[420px] lg:h-[560px] xl:h-[640px]"
      src="/images/inline-skates-canada.jpg"
      alt="ProSkaters Place Inline Skates Canada Retailer"
      loading="eager"
      sizes="sm:100vw md:2000px"
      fetchpriority="high"
      preload
      placeholder
      placeholder-class="blur-xl"
    />
    <div
      class="container absolute inset-0 flex flex-col items-start justify-center bg-gradient-to-l from-gray-200 md:bg-none"
    >
      <h1 class="text-3xl font-bold md:mb-4 md:text-4xl lg:text-6xl">
        ProSkatersPlace.ca
      </h1>
      <h2 class="text-lg font-bold md:mb-4 lg:text-3xl">
        Canada's Premier Destination for Inline Skates, Roller Skates, and More!
      </h2>
      <div class="max-w-sm mb-8 text-md font-light lg:max-w-md text-balance">
        <p>
          Experience the thrill of gliding on wheels or carving through snow
          with ProSkaters Place, Canada's top online retailer for all your
          skating and skiing needs. We offer an unparalleled selection of
          high-quality inline skates, rollerblades, roller skates, quad skates,
          scooters, skateboards, and both alpine and cross-country ski
          equipment.
        </p>
      </div>
      <NuxtLink
        class="px-6 py-3 font-bold text-white bg-gray-800 rounded-xl hover:bg-gray-800"
        to="/products"
        >Shop now</NuxtLink
      >
    </div>
  </div>
</template>
