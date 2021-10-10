<template>
	<header class="sticky top-0 z-40 bg-white shadow-sm">
		<div class="container flex items-center justify-between py-4">
			<nuxt-link to="/" class="md:w-[260px]">
				<h1 class="flex items-center text-lg font-bold">
					<nuxt-img class="mr-2" width="32" height="32" src="icon.svg" alt="Logo"></nuxt-img> WooNuxt
				</h1>
			</nuxt-link>
			<nav id="main-nav" class="items-center hidden text-sm text-gray-500 uppercase md:flex lg:flex-1 lg:pl-12">
				<nuxt-link class="mr-4" to="/products">Shop</nuxt-link>
				<nuxt-link class="mr-4" to="/about">About us</nuxt-link>
				<nuxt-link class="mr-4" to="/news">News</nuxt-link>
				<nuxt-link class="mr-4" to="/contact">Contact</nuxt-link>
			</nav>
			<div class="flex items-center">
				<a v-if="$store.state.user === null" href="https://woonuxt.com/soo/" class="flex mr-1 text-sm text-gray-500">
					<span class="mr-1 ">Sign in</span>
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 512 512">
						<path d="M192 176v-40a40 40 0 0140-40h160a40 40 0 0140 40v240a40 40 0 01-40 40H240c-22.09 0-48-17.91-48-40v-40" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" />
						<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M288 336l80-80-80-80M80 256h272" />
					</svg></a>
				<CartTrigger @icon-click="toggleCart" />
				<MenuTrigger class="md:hidden" @icon-click="console.log('menu')" />
			</div>
		</div>
	</header>
</template>

<script>
export default {
	methods: {
		toggleCart() {
			this.$store.commit('toggleCart', !this.$store.state.showCart)
		}
	}
}
</script>


<style lang="postcss">
#main-nav .nuxt-link-exact-active {
	@apply text-gray-900;
}
</style>