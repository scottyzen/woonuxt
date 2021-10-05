<template>
	<header id="main-nav" class="sticky top-0 z-50 bg-white shadow-sm">
		<div class="container flex items-center justify-between py-4">
			<nuxt-link to="/">
				<h1 class="flex items-center text-lg font-bold">
					<nuxt-img class="mr-2" width="32" height="32" src="icon.svg"></nuxt-img> WooNuxt
				</h1>
			</nuxt-link>
			<nav class="flex items-center text-sm uppercase">
				<nuxt-link class="ml-4" to="/products">All Products</nuxt-link>
				<CartTrigger @icon-click="toggleCart" />
				<MenuTrigger class="md:hidden" @icon-click="console.log('menu')" />
			</nav>
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
