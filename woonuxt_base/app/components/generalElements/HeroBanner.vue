<template>
  <div class="relative mx-auto">
    <NuxtImg
      width="1400"
      height="600"
      class="object-cover w-full h-[300px] md:h-[360px] lg:h-[420px]"
      src="/images/hero-4.jpg"
      alt="Hero image"
      loading="eager"
      sizes="sm:100vw md:1400px"
      fetchpriority="high"
      preload
      placeholder
      placeholder-class="blur-xl"
    />
    <div class="container absolute inset-0 flex flex-col items-start justify-center bg-gradient-to-l from-white/70 via-white/40 to-transparent md:bg-none px-4">
      <h1 class="text-2xl font-bold md:text-3xl lg:text-4xl text-gray-900">
        Welkom bij Kledingzoeken.nl
      </h1>
      <h2 class="text-md md:text-lg lg:text-2xl text-gray-700 mb-4">
        Jouw slimme startpunt voor kleding & mode.
      </h2>
      <div class="max-w-xl text-sm md:text-base font-light text-gray-700 mb-6">
        <p>
          Wij verzamelen duizenden kledingstukken van verschillende webwinkels in één overzicht.
          Vergelijk prijzen, ontdek nieuwe trends, en vind de beste deal — allemaal via één platform.
        </p>
      </div>
      <NuxtLink
        to="/products"
        class="px-5 py-2.5 font-semibold text-white bg-primary rounded-xl hover:bg-primary-dark transition"
      >
        Bekijk alle producten
      </NuxtLink>
    </div>
  </div>
</template>
