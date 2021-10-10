<template>
	<main class="container flex">
		<Filters @filter-updated="filterProducts" />

		<div class="flex flex-col flex-1 md:pl-12">
			<input type="search" class="w-full max-w-md p-2 px-4 mt-8 leading-tight transition-all border outline-none rounded-xl" placeholder="Search products...">
			<Products :category="$route.params.categorySlug" :page="parseInt($route.params.pageNumber) || page" :products="products" />
		</div>
	</main>
</template>

<script>
import getProducts from '~/gql/queries/getProducts'
export default {
	data() {
		return {
			products: [],
			page: 1
		}
	},
	async asyncData({ $graphql, params }) {
		const variables = { slug: params.categorySlug }
		const { products } = await $graphql.default.request(getProducts, variables)
		return { products: products.nodes }
	},
	methods: {
		filterProducts(filter) {
			this.products = this.$store.state.products.filter((product) => {
				let { minPrice, maxPrice, starRating } = filter

				maxPrice = maxPrice > 0 ? maxPrice : 9999999999
				const price = product.price ? product.price.replace(/\€/g, '').split(' - ') : []
				const priceCondition = price.some((el) => el >= minPrice || 0) && price.some((el) => el <= maxPrice)

				const ratingCondition = product.averageRating >= starRating

				return priceCondition && ratingCondition
			})
		}
	}
}
</script>

<style lang="postcss">
.pagination {
	@apply flex items-center justify-center gap-2 p-8 mb-8;
}
.pagination a {
	@apply px-4 py-2 leading-none text-purple-900 bg-purple-100 hover:bg-purple-200 rounded-xl;
}
</style>
