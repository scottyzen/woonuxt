<template>
	<main class="container flex ">
		<aside id="filters">

			<!-- Price Range -->
			<h3 class="mb-3">Price Range</h3>
			<div class="flex justify-between gap-4">
				<div class="relative flex items-center w-1/2 ">
					<span v-if="filter.minPrice" class="absolute p-2">€</span>
					<input class="price-input" type="number" placeholder="Min" min="0" v-model.number="filter.minPrice" step="1" :class="{'active': filter.minPrice}">
				</div>
				<div class="relative flex items-center w-1/2 ">
					<span v-if="filter.maxPrice" class="absolute p-2">€</span>
					<input class="price-input" type="number" placeholder="Max" max="90" v-model.number="filter.maxPrice" step="1" :class="{'active': filter.maxPrice}">
				</div>
			</div>

		</aside>

		<div class="w-full pl-8">
			<Products :category="$route.params.categorySlug" :page="parseInt($route.params.pageNumber) || 1" :products="products" />
		</div>

	</main>
</template>

<script>
import getProducts from '~/gql/queries/getProducts'
export default {
	data() {
		return {
			products: [],
			filter: {
				minPrice: null,
				maxPrice: 90
			}
		}
	},
	async asyncData({ $graphql, params }) {
		const variables = { slug: params.categorySlug }
		const { products } = await $graphql.default.request(getProducts, variables)
		return { products: products.nodes }
	},
	methods: {
		filterProducts() {
			this.products = this.$store.state.products.filter((product) => {
				const min = this.filter.minPrice
				const max = this.filter.maxPrice || 999999999
				const price = product.price ? product.price.replace(/\€/g, '').split(' - ') : []
				return price.some((el) => el >= min) && price.some((el) => el <= max)
			})
		}
	},
	watch: {
		filter: {
			handler(after, before) {
				this.filterProducts()
			},
			deep: true
		}
	}
}
</script>

<style lang="postcss">
#filters {
	@apply border-r border-gray-100 py-8 pr-8 bg-white;
	width: 250px;
	box-shadow: -100px 0 0 white, -200px 0 0 white, -300px 0 0 white;
}
.price-input {
	@apply p-2 leading-tight border rounded-xl w-full transition-all outline-none;
}
.price-input.active {
	@apply pl-6 border-gray-400;
}
</style>
