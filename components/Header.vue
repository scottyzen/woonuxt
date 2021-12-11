<template>
	<header class="bg-white shadow-sm top-0 z-40 sticky">
		<div class="container flex py-4 items-center justify-between">
			<Logo />
			<nav id="main-nav" class="text-sm text-gray-500 gap-6 items-center hidden md:flex lg:pl-12">
				<nuxt-link to="/">Home</nuxt-link>
				<nuxt-link to="/products">Shop</nuxt-link>
				<nuxt-link to="/about">About us</nuxt-link>
				<nuxt-link to="/news">News</nuxt-link>
				<nuxt-link to="/contact">Contact</nuxt-link>
			</nav>
			<div class="flex justify-end items-center md:min-w-[120px]">
				<SignInLink />
				<CartTrigger v-if="$store.state.cart" @icon-click="toggleCart" />
				<!-- <MenuTrigger class="md:hidden" @icon-click="console.log('menu')" /> -->
			</div>
		</div>
	</header>
</template>

<script>
import SignInLink from './SignInLink.vue';
export default {
	methods: {
		toggleCart() {
			this.$store.commit('toggleCart', !this.$store.state.showCart);
		},
	},
	watch: {
		$route() {
			this.$store.commit('toggleCart', false);
		},
	},
	components: { SignInLink },
};
</script>

<style lang="postcss">
#main-nav .nuxt-link-exact-active {
	@apply text-gray-900;
}
</style>
