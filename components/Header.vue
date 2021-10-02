<template>
	<header id="main-nav" v-if="!$apollo.loading" class="sticky top-0 z-50 bg-white shadow-sm">
		<div class="container flex items-center justify-between py-4">
			<nuxt-link to="/">
				<h1 class="flex items-center text-lg font-bold">
					<nuxt-img class="mr-2" width="32" height="32" src="icon.svg"></nuxt-img> WooNuxt
				</h1>
			</nuxt-link>
			<nav class="flex text-sm uppercase">
				<nuxt-link class="ml-4" to="/products">All Products</nuxt-link>
				<nuxt-link v-for="category in productCategories.nodes.slice(0, 2)" :key="category.id" :to="`/product-category/${category.slug}`" class="ml-4">
					{{ category.name }}
				</nuxt-link>
				<CartTrigger @icon-click="toggleCart" />
			</nav>
		</div>
	</header>
</template>

<script>
import getProductCategories from '~/gql/queries/getProductCategories'
export default {
	apollo: { productCategories: getProductCategories },
	methods: {
		toggleCart() {
			this.$store.commit('toggleCart', !this.$store.state.showCart)
		}
	}
}
</script>
