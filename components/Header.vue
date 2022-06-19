<template>
	<header class="bg-white shadow-sm top-0 z-40 sticky">
		<div class="container flex py-4 items-center justify-between">
			<Logo />
			<MenuItems id="main-nav" class="text-sm text-gray-500 gap-6 items-center hidden md:flex lg:pl-12" />
			<div class="flex justify-end items-center md:min-w-[120px]">
				<NuxtLink to="/wishlist" class="ml-4">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="20" height="20">
						<path d="M352.92 80C288 80 256 144 256 144s-32-64-96.92-64c-52.76 0-94.54 44.14-95.08 96.81-1.1 109.33 86.73 187.08 183 252.42a16 16 0 0018 0c96.26-65.34 184.09-143.09 183-252.42-.54-52.67-42.32-96.81-95.08-96.81z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" />
					</svg>
				</NuxtLink>
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
