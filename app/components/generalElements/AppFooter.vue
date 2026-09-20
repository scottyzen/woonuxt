<script setup lang="ts">
const { wooNuxtVersionInfo } = useHelpers();
</script>

<template>
  <footer class="mt-20 bg-[#0d5134] text-white">
    <section class="border-b border-white/15 bg-[#f7f8f3] py-10 text-[#153f2b]"><div class="container grid gap-7 md:grid-cols-3"><div class="flex items-center gap-4"><Icon name="ion:cube-outline" class="rounded-full bg-[#f6c51e] p-2" size="38" /><span><b class="block">Free shipping</b><small class="text-xs text-gray-500">On all orders over €50</small></span></div><div class="flex items-center gap-4"><Icon name="ion:card-outline" class="rounded-full bg-[#f6c51e] p-2" size="38" /><span><b class="block">Flexible payment</b><small class="text-xs text-gray-500">Multiple secure payment options</small></span></div><div class="flex items-center gap-4"><Icon name="ion:headset-outline" class="rounded-full bg-[#f6c51e] p-2" size="38" /><span><b class="block">Plant care support</b><small class="text-xs text-gray-500">We are here every day</small></span></div></div></section>
    <div class="container grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]"><div><Logo class="text-white" /><p class="mt-5 max-w-xs text-sm leading-6 text-white/65">Plants, pots and simple care guidance for spaces that feel more alive.</p><SocialIcons class="mt-6" /></div><div><h3 class="mb-4 font-sans text-sm font-bold">Explore</h3><NuxtLink to="/products" class="footer-link">All plants</NuxtLink><NuxtLink to="/categories" class="footer-link">Plant types</NuxtLink><NuxtLink to="/products?filter=sale[true]" class="footer-link">Special offers</NuxtLink></div><div><h3 class="mb-4 font-sans text-sm font-bold">Customer care</h3><NuxtLink to="/my-account" class="footer-link">My account</NuxtLink><NuxtLink to="/wishlist" class="footer-link">Wishlist</NuxtLink><NuxtLink to="/contact" class="footer-link">Contact us</NuxtLink></div><div><h3 class="mb-4 font-sans text-sm font-bold">Stay in the loop</h3><p class="mb-4 text-sm text-white/65">Fresh plant finds and care tips, occasionally.</p><div class="flex rounded-full bg-white p-1"><input class="min-w-0 flex-1 bg-transparent px-3 text-xs text-[#153f2b] outline-none" placeholder="Email address" /><button class="rounded-full bg-[#f6c51e] px-4 py-2 text-xs font-bold text-[#153f2b]">Join</button></div></div></div>
    <div class="container flex flex-wrap justify-between gap-3 border-t border-white/15 py-5 text-xs text-white/55"><span>© {{ new Date().getFullYear() }} Plantivo. Made with care.</span><a href="https://woonuxt.com" :title="`Built with WooNuxt v${wooNuxtVersionInfo}`">Built with WooNuxt v{{ wooNuxtVersionInfo }}</a></div>
  </footer>
</template>

<style scoped>
.footer-link { display: block; margin: .55rem 0; color: rgb(255 255 255 / .65); font-size: .875rem; }
.footer-link:hover { color: #f6c51e; }
</style>
