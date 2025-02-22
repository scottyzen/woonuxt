<template>
  <div class="relative mx-auto">
    <div class="container relative h-[400px] md:h-[500px]">
      <!-- Background with gradient overlay -->
      <div class="absolute inset-0">
        <div class="absolute inset-0 bg-gradient-to-r from-[#1a1a1a] to-[#2d2d2d]"></div>
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent_70%)]"></div>
        <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjMjIyIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDVMNSAwWk02IDRMNCA2Wk0tMSAxTDEgLTFaIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=')] opacity-[0.07]"></div>
      </div>

      <!-- Animated particles background -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute w-2 h-2 bg-white rounded-full animate-float-1" style="top: 10%; left: 20%"></div>
        <div class="absolute w-2 h-2 bg-white rounded-full animate-float-2" style="top: 30%; left: 60%"></div>
        <div class="absolute w-2 h-2 bg-white rounded-full animate-float-3" style="top: 70%; left: 80%"></div>
        <div class="absolute w-1 h-1 bg-white rounded-full animate-float-2" style="top: 45%; left: 35%"></div>
        <div class="absolute w-1 h-1 bg-white rounded-full animate-float-3" style="top: 65%; left: 15%"></div>
      </div>

      <!-- Main Content Grid -->
      <div class="relative z-10 h-full grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
        <!-- Left Section -->
        <div class="flex flex-col justify-center">
          <h2 class="text-xl text-white/80 mb-2 font-light tracking-wider">Welcome to</h2>
          <h1 class="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">ModaPrime USA</h1>
          <p class="text-white/70 mb-8 max-w-md leading-relaxed">
            Premium modafinil delivered across the USA. Fast shipping, reliable service, and competitive prices.
          </p>
          <NuxtLink 
            class="group relative inline-flex items-center justify-center px-8 py-3 font-semibold text-white transition-all duration-300 ease-in-out w-fit overflow-hidden rounded-full bg-gradient-to-r from-primary-light to-primary hover:from-primary hover:to-primary-dark"
            to="/products"
          >
            <span class="relative">Shop now</span>
            <svg class="w-5 h-5 ml-2 -mr-1 transition-transform duration-300 ease-out transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </NuxtLink>
        </div>

        <!-- Right Section with Definition -->
        <div class="flex flex-col items-center justify-center md:items-end">



            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Trust Indicators Section -->
    <div class="container relative z-20 -mt-20 bg-white/95 rounded-xl shadow-xl p-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="flex items-center justify-center text-center">
          <div>
            <div class="text-3xl mb-3">🚚</div>
            <h3 class="font-semibold text-gray-800 mb-2">Fast & Discreet Shipping</h3>
            <p class="text-gray-600 text-sm">Quick delivery across the USA with discrete packaging</p>
          </div>
        </div>
        <div class="flex items-center justify-center text-center">
          <div>
            <div class="text-3xl mb-3">🔒</div>
            <h3 class="font-semibold text-gray-800 mb-2">Secure Transactions</h3>
            <p class="text-gray-600 text-sm">Safe payment processing with multiple options</p>
          </div>
        </div>
        <div class="flex items-center justify-center text-center">
          <div>
            <div class="text-3xl mb-3">💯</div>
            <h3 class="font-semibold text-gray-800 mb-2">Quality Guaranteed</h3>
            <p class="text-gray-600 text-sm">Premium products from trusted manufacturers</p>
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
