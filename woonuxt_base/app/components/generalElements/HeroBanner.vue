<template>
  <div class="relative mx-auto">
    <div class="container relative h-[400px] md:h-[500px]">
      <!-- Background with gradient overlay -->
      <div class="absolute inset-0">
        <div class="absolute inset-0 bg-gradient-to-r from-[#1a1a1a] to-[#2d2d2d]"></div>
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent_70%)]"></div>
        <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjMjIyIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDVMNSAwWk02IDRMNCA2Wk0tMSAxTDEgLTFaIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=')] opacity-[0.07]"></div>
      </div>

      <!-- Animated modafinil pill particles -->
      <div class="absolute inset-0 opacity-30">
        <!-- Pills radiating from center -->
        <div class="absolute w-10 h-4 bg-white/90 rounded-full animate-float-1 shadow-lg" style="top: 45%; left: 35%">
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-6 h-[1px] bg-gray-300"></div>
          </div>
        </div>
        <div class="absolute w-10 h-4 bg-white/90 rounded-full animate-float-2 shadow-lg" style="top: 55%; left: 65%">
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-6 h-[1px] bg-gray-300"></div>
          </div>
        </div>
        <div class="absolute w-10 h-4 bg-white/90 rounded-full animate-float-3 shadow-lg" style="top: 35%; left: 45%">
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-6 h-[1px] bg-gray-300"></div>
          </div>
        </div>

        <!-- Smaller pills -->
        <div class="absolute w-8 h-3 bg-white/90 rounded-full animate-float-2 shadow-lg" style="top: 40%; left: 30%">
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-4 h-[1px] bg-gray-300"></div>
          </div>
        </div>
        <div class="absolute w-8 h-3 bg-white/90 rounded-full animate-float-3 shadow-lg" style="top: 60%; left: 70%">
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-4 h-[1px] bg-gray-300"></div>
          </div>
        </div>
        <div class="absolute w-8 h-3 bg-white/90 rounded-full animate-float-1 shadow-lg" style="top: 30%; left: 40%">
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-4 h-[1px] bg-gray-300"></div>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="relative z-10 h-full grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
        <!-- Left Section -->
        <div class="flex flex-col justify-center">
          <h2 class="text-xl text-blue-200 mb-2 font-light tracking-wider">Welcome to</h2>
          <h1 class="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">ModaPrime USA</h1>
          <p class="text-gray-200 mb-8 max-w-md leading-relaxed">
            Premium modafinil delivered across the USA. Fast shipping, reliable service, and competitive prices.
          </p>
          <NuxtLink 
            class="group relative inline-flex items-center justify-center px-8 py-3 font-semibold text-white transition-all duration-300 ease-in-out w-fit overflow-hidden rounded-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 shadow-lg"
            to="/products"
          >
            <span class="relative">Shop now</span>
            <svg class="w-5 h-5 ml-2 -mr-1 transition-transform duration-300 ease-out transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </NuxtLink>
        </div>

        <!-- Right Section with Announcements -->
        <div class="flex flex-col items-center justify-center md:items-end">
          <!-- Site-wide Announcement Banner -->
          <div class="bg-white/10 backdrop-blur-md rounded-lg p-8 max-w-md border border-blue-200/20 shadow-xl">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
                <p class="text-blue-300 font-medium">Special offer: example for e: Free shipping on orders over $150</p>
              </div>
              <button class="text-gray-400 hover:text-gray-200 transition-colors">
                <span class="sr-only">Close</span>
                <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="postcss" scoped>
.animate-float-1 {
  animation: float 6s ease-in-out infinite;
}

.animate-float-2 {
  animation: float 8s ease-in-out infinite;
}

.animate-float-3 {
  animation: float 10s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

[class*="text-[100vh]"] {
  font-family: 'Noto Color Emoji', sans-serif;
}
</style> 
