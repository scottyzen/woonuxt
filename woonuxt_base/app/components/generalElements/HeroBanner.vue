<template>
  <div class="relative w-full bg-white h-[100vh] overflow-hidden">
    <div class="container relative h-full mx-auto">
      <!-- Background Caduceus Pattern -->
      <div class="fixed inset-0 grid grid-cols-3 gap-10 opacity-20">
        <div class="flex items-center justify-center transform translate-y-1/4 motion-safe:animate-parallax">
          <div class="text-[60vh] text-black opacity-27 select-none mix-blend-color-burn">⚕️</div>
        </div>
        <div class="flex items-center justify-center transform -translate-y-1/4 motion-safe:animate-parallax">
          <div class="text-[60vh] text-black opacity-27 select-none mix-blend-color-burn">⚕️</div>
        </div>
        <div class="flex items-center justify-center transform translate-y-1/4 motion-safe:animate-parallax">
          <div class="text-[60vh] text-black opacity-27 select-none mix-blend-color-burn">⚕️</div>
        </div>
        <div class="flex items-center justify-center transform -translate-y-1/4 motion-safe:animate-parallax">
          <div class="text-[60vh] text-black opacity-27 select-none mix-blend-color-burn">⚕️</div>
        </div>
        <div class="flex items-center justify-center transform -translate-y-1/4 motion-safe:animate-parallax">
          <div class="text-[60vh] text-black opacity-27 select-none mix-blend-color-burn">⚕️</div>
        </div>
        <div class="flex items-center justify-center transform translate-y-1/4 motion-safe:animate-parallax">
          <div class="text-[60vh] text-black opacity-27 select-none mix-blend-color-burn">⚕️</div>
        </div>
        <div class="flex items-center justify-center transform -translate-y-1/4 motion-safe:animate-parallax">
          <div class="text-[60vh] text-black opacity-27 select-none mix-blend-color-burn">⚕️</div>
        </div>
        <div class="flex items-center justify-center transform translate-y-1/4 motion-safe:animate-parallax">
          <div class="text-[60vh] text-black opacity-27 select-none mix-blend-color-burn">⚕️</div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="relative z-10 h-full flex flex-col justify-start px-4 pt-4 lg:pt-8 gap-8">
        <!-- Hero Text Section -->
        <div class="flex flex-col items-start max-w-5xl">
          <h1 
            class="text-[20vh] font-black tracking-tighter leading-[0.85] motion-safe:animate-slide-up notable-regular mix-blend-color-burn -mt-4 mb-4"
            style="font-family: 'Notable', sans-serif; text-transform: uppercase; letter-spacing: -0.08em; word-wrap: break-word; color: rgba(23, 36, 69, 0.63);"
          >
            Moda<br/>Prime<br/>USA
          </h1>
          <p 
            class="text-2xl md:text-3xl text-gray-700 mb-8 leading-relaxed max-w-3xl motion-safe:animate-slide-up pl-2"
            style="animation-delay: 200ms;"
          >
            Modafinil
          </p>
          <NuxtLink 
            class="group relative inline-flex items-center justify-center px-10 py-4 text-xl font-semibold text-white transition-all duration-300 ease-in-out overflow-hidden rounded-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 shadow-lg hover:shadow-blue-500/30 motion-safe:animate-slide-up"
            to="/products"
            style="animation-delay: 400ms;"
          >
            <span class="relative">Shop</span>
            <svg class="w-8 h-8 ml-3 -mr-2 transition-transform duration-300 ease-out transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No script setup needed since this component only uses template markup
</script>
