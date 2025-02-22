<template>
  <div class="relative mx-auto">
    <div class="container relative h-[400px] md:h-[500px]">
      <!-- Background with gradient overlay -->
      <div class="absolute inset-0 bg-gradient-to-r from-[#1a1a1a] to-[#2d2d2d]"></div>
      
      <!-- Animated particles background -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute w-2 h-2 bg-white rounded-full animate-float-1" style="top: 10%; left: 20%"></div>
        <div class="absolute w-2 h-2 bg-white rounded-full animate-float-2" style="top: 30%; left: 60%"></div>
        <div class="absolute w-2 h-2 bg-white rounded-full animate-float-3" style="top: 70%; left: 80%"></div>
      </div>

      <!-- Main Content Grid -->
      <div class="relative z-10 h-full grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
        <!-- Left Section -->
        <div class="flex flex-col justify-center">
          <h2 class="text-xl text-white/80 mb-2 font-light tracking-wider">Welcome to</h2>
          <h1 class="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">ModaPrime USA</h1>
          <p class="text-white/70 mb-8 max-w-md leading-relaxed">
            Discover premium cognitive enhancement solutions designed to elevate your mental performance and unlock your full potential.
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
          <div class="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-white font-light max-w-md border border-white/10 shadow-2xl transform hover:scale-[1.02] transition-all duration-300 hover:border-white/20">
            <div class="text-2xl font-medium tracking-wide mb-4 text-white/90">mo·da·prime</div>
            <div class="leading-relaxed space-y-3">
              <div class="text-white/60 italic mb-2">noun</div>
              <div class="flex items-start gap-2">
                <span class="text-primary-light">1.</span>
                <span>A premier source of cognitive enhancement</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="text-primary-light">2.</span>
                <span>The pursuit of peak mental performance</span>
              </div>
              <div class="flex items-start gap-2">
                <span class="text-primary-light">3.</span>
                <span>Where science meets wellness</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Featured Categories Section -->
    <div class="container grid grid-cols-2 md:grid-cols-4 gap-6 -mt-20 relative z-20">
      <NuxtLink 
        v-for="(category, index) in categories" 
        :key="index"
        :to="category.link" 
        class="group bg-white/95 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
      >
        <div class="flex flex-col items-center text-center">
          <div class="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">{{ category.icon }}</div>
          <h3 class="font-semibold mb-2 text-gray-800">{{ category.title }}</h3>
          <p class="text-sm text-gray-600 leading-relaxed">{{ category.description }}</p>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const categories = [
  {
    icon: '🧠',
    title: 'Nootropics',
    description: 'Enhance cognitive function',
    link: '/category/nootropics'
  },
  {
    icon: '⚡',
    title: 'Weight Loss',
    description: 'Support your goals',
    link: '/category/weight-loss'
  },
  {
    icon: '🌙',
    title: 'Sleep Aids',
    description: 'Rest and recovery',
    link: '/category/sleep-aids'
  },
  {
    icon: '🌿',
    title: 'Lifestyle',
    description: 'General wellness',
    link: '/category/lifestyle'
  }
]
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
