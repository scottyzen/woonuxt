<template>
	<main class="container flex items-stretch h-full">
		<aside id="filters" class="h-full ">

			<!-- Price Range -->
			<h3 class="mb-3">Price Range</h3>
			<div class="flex justify-between gap-4">
				<input class="w-1/2 p-2 px-3 leading-tight border rounded-xl" type="number" name="min-price" id="min-price" placeholder="Min" min="0" v-model.number="filter.minPrice" step="1">
				<input class="w-1/2 p-2 px-3 leading-tight border rounded-xl" type="number" name="max-price" id="max-price" placeholder="Max" max="90" v-model.number="filter.maxPrice" step="1">
			</div>

		</aside>

		<div class="w-full pl-8">
			<!-- <pre class="text-xs">{{products}}</pre> -->
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
			this.products = this.$store.state.products.filter((product) => product.price >= this.filter.minPrice && product.price <= this.filter.maxPrice)
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
	box-shadow: -200px 0 0 white;
}
</style>
