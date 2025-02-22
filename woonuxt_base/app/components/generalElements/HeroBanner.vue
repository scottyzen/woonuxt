<template>
  <div class="relative mx-auto w-full bg-gradient-to-r from-[#1a1a1a] to-[#2d2d2d]">
    <div class="container relative min-h-[500px] md:min-h-[600px] lg:min-h-[700px] mx-auto">
      <!-- Background effects -->
      <div class="absolute inset-0">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent_70%)]"></div>
        <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjMjIyIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDVMNSAwWk02IDRMNCA2Wk0tMSAxTDEgLTFaIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=')] opacity-[0.07]"></div>
      </div>

      <!-- Animated Caduceus Symbols -->
      <div class="absolute inset-0 opacity-30">
        <!-- Large Caduceus -->
        <div class="absolute w-24 h-24 bg-white/90 rounded-full animate-float-1 shadow-lg flex items-center justify-center" style="top: 15%; left: 25%">
          <svg class="w-16 h-16 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2L12,2c-0.6,0-1,0.4-1,1v1H9.5C8.1,4,7,5.1,7,6.5v11.1c0,0.5,0.2,1,0.5,1.4l3.4,3.4c0.6,0.6,1.5,0.6,2.1,0l3.4-3.4 c0.4-0.4,0.5-0.9,0.5-1.4V6.5C17,5.1,15.9,4,14.5,4H13V3C13,2.4,12.6,2,12,2z M12,16c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2 S13.1,16,12,16z"/>
            <path d="M10.5,6.5c0-0.8-0.7-1.5-1.5-1.5S7.5,5.7,7.5,6.5S8.2,8,9,8S10.5,7.3,10.5,6.5z"/>
            <path d="M15,5c-0.8,0-1.5,0.7-1.5,1.5S14.2,8,15,8s1.5-0.7,1.5-1.5S15.8,5,15,5z"/>
          </svg>
        </div>

        <div class="absolute w-28 h-28 bg-white/90 rounded-full animate-float-2 shadow-lg flex items-center justify-center" style="top: 65%; left: 70%">
          <svg class="w-20 h-20 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2L12,2c-0.6,0-1,0.4-1,1v1H9.5C8.1,4,7,5.1,7,6.5v11.1c0,0.5,0.2,1,0.5,1.4l3.4,3.4c0.6,0.6,1.5,0.6,2.1,0l3.4-3.4 c0.4-0.4,0.5-0.9,0.5-1.4V6.5C17,5.1,15.9,4,14.5,4H13V3C13,2.4,12.6,2,12,2z M12,16c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2 S13.1,16,12,16z"/>
            <path d="M10.5,6.5c0-0.8-0.7-1.5-1.5-1.5S7.5,5.7,7.5,6.5S8.2,8,9,8S10.5,7.3,10.5,6.5z"/>
            <path d="M15,5c-0.8,0-1.5,0.7-1.5,1.5S14.2,8,15,8s1.5-0.7,1.5-1.5S15.8,5,15,5z"/>
          </svg>
        </div>

        <!-- Medium Caduceus -->
        <div class="absolute w-20 h-20 bg-white/90 rounded-full animate-float-3 shadow-lg flex items-center justify-center" style="top: 35%; left: 80%">
          <svg class="w-14 h-14 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2L12,2c-0.6,0-1,0.4-1,1v1H9.5C8.1,4,7,5.1,7,6.5v11.1c0,0.5,0.2,1,0.5,1.4l3.4,3.4c0.6,0.6,1.5,0.6,2.1,0l3.4-3.4 c0.4-0.4,0.5-0.9,0.5-1.4V6.5C17,5.1,15.9,4,14.5,4H13V3C13,2.4,12.6,2,12,2z M12,16c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2 S13.1,16,12,16z"/>
            <path d="M10.5,6.5c0-0.8-0.7-1.5-1.5-1.5S7.5,5.7,7.5,6.5S8.2,8,9,8S10.5,7.3,10.5,6.5z"/>
            <path d="M15,5c-0.8,0-1.5,0.7-1.5,1.5S14.2,8,15,8s1.5-0.7,1.5-1.5S15.8,5,15,5z"/>
          </svg>
        </div>

        <div class="absolute w-20 h-20 bg-white/90 rounded-full animate-float-1 shadow-lg flex items-center justify-center" style="top: 55%; left: 35%">
          <svg class="w-14 h-14 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2L12,2c-0.6,0-1,0.4-1,1v1H9.5C8.1,4,7,5.1,7,6.5v11.1c0,0.5,0.2,1,0.5,1.4l3.4,3.4c0.6,0.6,1.5,0.6,2.1,0l3.4-3.4 c0.4-0.4,0.5-0.9,0.5-1.4V6.5C17,5.1,15.9,4,14.5,4H13V3C13,2.4,12.6,2,12,2z M12,16c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2 S13.1,16,12,16z"/>
            <path d="M10.5,6.5c0-0.8-0.7-1.5-1.5-1.5S7.5,5.7,7.5,6.5S8.2,8,9,8S10.5,7.3,10.5,6.5z"/>
            <path d="M15,5c-0.8,0-1.5,0.7-1.5,1.5S14.2,8,15,8s1.5-0.7,1.5-1.5S15.8,5,15,5z"/>
          </svg>
        </div>

        <!-- Small Caduceus -->
        <div class="absolute w-16 h-16 bg-white/90 rounded-full animate-float-2 shadow-lg flex items-center justify-center" style="top: 75%; left: 45%">
          <svg class="w-10 h-10 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2L12,2c-0.6,0-1,0.4-1,1v1H9.5C8.1,4,7,5.1,7,6.5v11.1c0,0.5,0.2,1,0.5,1.4l3.4,3.4c0.6,0.6,1.5,0.6,2.1,0l3.4-3.4 c0.4-0.4,0.5-0.9,0.5-1.4V6.5C17,5.1,15.9,4,14.5,4H13V3C13,2.4,12.6,2,12,2z M12,16c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2 S13.1,16,12,16z"/>
            <path d="M10.5,6.5c0-0.8-0.7-1.5-1.5-1.5S7.5,5.7,7.5,6.5S8.2,8,9,8S10.5,7.3,10.5,6.5z"/>
            <path d="M15,5c-0.8,0-1.5,0.7-1.5,1.5S14.2,8,15,8s1.5-0.7,1.5-1.5S15.8,5,15,5z"/>
          </svg>
        </div>
      </div>

      <!-- Main Content -->
      <div class="relative z-10 h-full flex flex-col lg:flex-row items-center justify-between px-6 py-12 lg:py-20 gap-12">
        <!-- Left Content Section -->
        <div class="flex flex-col max-w-xl w-full lg:w-1/2">
          <h2 class="text-2xl text-blue-200 mb-3 font-light tracking-wider animate-fade-in">Welcome to</h2>
          <h1 class="text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-8 tracking-tight">ModaPrime USA</h1>
          <p class="text-xl text-gray-200 mb-10 leading-relaxed">
            Premium modafinil delivered across the USA. Fast shipping, reliable service, and competitive prices.
          </p>
          <NuxtLink 
            class="group relative inline-flex items-center justify-center px-10 py-4 text-lg font-semibold text-white transition-all duration-300 ease-in-out w-fit overflow-hidden rounded-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 shadow-lg hover:shadow-blue-500/30"
            to="/products"
          >
            <span class="relative">Shop now</span>
            <svg class="w-6 h-6 ml-2 -mr-1 transition-transform duration-300 ease-out transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </NuxtLink>
        </div>

        <!-- Right Announcement Section -->
        <div class="w-full lg:w-1/2 flex justify-center lg:justify-end">
          <div class="bg-white/10 backdrop-blur-md rounded-3xl p-10 lg:p-12 max-w-2xl w-full border-2 border-blue-300/30 shadow-2xl transform hover:scale-[1.02] transition-transform duration-300">
            <div class="flex flex-col items-start gap-8">
              <div class="flex items-start gap-6 w-full">
                <div class="bg-blue-500/20 rounded-2xl p-4">
                  <svg class="w-12 h-12 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                </div>
                <div class="flex-1">
                  <h3 class="text-3xl font-bold text-blue-200 mb-4">Limited Time Offer!</h3>
                  <p class="text-2xl text-blue-100 mb-6">Free shipping on all orders over $150</p>
                  <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <p class="text-lg text-blue-200/80">Use code: <span class="font-mono font-bold text-blue-300">FREESHIP150</span></p>
                    <button class="px-6 py-2 bg-blue-500/20 rounded-full text-blue-200 hover:bg-blue-500/30 transition-colors duration-300">
                      Copy Code
                    </button>
                  </div>
                </div>
                <button class="text-gray-400 hover:text-gray-200 transition-colors">
                  <span class="sr-only">Close</span>
                  <svg class="w-8 h-8" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
              
              <div class="w-full h-px bg-gradient-to-r from-transparent via-blue-200/20 to-transparent"></div>
              
              <div class="flex flex-col sm:flex-row items-center justify-between gap-6 w-full">
                <div class="flex items-center gap-4">
                  <div class="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <p class="text-green-400">Offer ends soon!</p>
                </div>
                <NuxtLink 
                  to="/products"
                  class="w-full sm:w-auto px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full text-center transition-colors duration-300"
                >
                  Shop Now & Save
                </NuxtLink>
              </div>
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
