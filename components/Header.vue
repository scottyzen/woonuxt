<template>
	<header class="bg-white shadow-sm top-0 z-40 sticky">
		<div class="container flex py-4 items-center justify-between">
			<Logo />
			<MenuItems id="main-nav" class="text-sm text-gray-500 gap-6 items-center hidden md:flex lg:pl-12" />
			<div class="flex justify-end items-center md:min-w-[120px]">
				<SignInLink />
				<CartTrigger @icon-click="toggleCart" />
				<MenuTrigger class="md:hidden" @icon-click="toggleMenu" />
			</div>
		</div>
	</header>
</template>

<script>
export default {
	methods: {
		toggleCart() {
			this.$store.commit('toggleCart', !this.$store.state.showCart);
		},
		toggleMenu() {
			this.$store.commit('toggleMenu', !this.$store.state.showMenu);
		},
	},
	watch: {
		$route() {
			this.$store.commit('toggleCart', false);
			this.$store.commit('toggleMenu', false);
		},
	},
};
</script>

<style lang="postcss">
#main-nav .nuxt-link-exact-active {
	@apply text-gray-900;
}
#main-nav a {
	@apply hover:text-gray-900;
}
</style>
