<template>
  <div class="relative w-full bg-white h-[100vh] overflow-hidden">
    <div class="container relative h-full mx-auto">
      <!-- Background Symbol Pattern -->
      <div class="fixed inset-0 opacity-10" style="background-image: url('/images/bgsymbol.png'); background-repeat: repeat; background-size: 400px;">
      </div>

      <!-- Main Content -->
      <div class="relative z-10 h-full flex flex-col justify-center items-start px-4">
        <!-- Hero Text Section -->
        <div class="flex flex-col items-start w-full">
          <h1 
            class="text-[15vw] sm:text-[18vw] md:text-[20vw] font-black tracking-tighter leading-[0.85] motion-safe:animate-float notable-regular mix-blend-color-burn"
            style="font-family: 'Notable', sans-serif; text-transform: uppercase; letter-spacing: -0.08em; word-wrap: break-word; color: rgba(23, 36, 69, 0.63);"
          >
            <span class="block transform hover:scale-105 transition-transform duration-300">Moda</span>
            <span class="block transform hover:scale-105 transition-transform duration-300">Prime</span>
            <span class="block transform hover:scale-105 transition-transform duration-300">USA</span>
          </h1>
          <p 
            class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-700 mt-4 leading-relaxed max-w-3xl motion-safe:animate-pulse pl-2"
            style="animation-delay: 200ms;"
          >
            Modafinil
          </p>
          <NuxtLink 
            class="mt-8 inline-flex items-center justify-center px-8 sm:px-10 py-4 text-xl sm:text-2xl font-semibold text-white rounded-full bg-blue-600 shadow-lg"
            to="/products"
            style="animation-delay: 400ms;"
          >
            <span>Shop Now</span>
            <svg class="w-8 h-8 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>
