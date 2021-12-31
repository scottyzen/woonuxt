<template>
	<main class="container flex">
		<Filters
			@filter-updated="filterProducts"
			@clear-filters="resetFilter"
			:activeFilters="this.$store.state.filter"
		/>

		<div class="flex flex-col flex-1 md:pl-8">
			<div class="flex mt-8 gap-4 items-center">
				<span class="bg-primary rounded-xl text-white p-1.5 md:hidden">
					<Icon width="22" height="22" />
				</span>
				<input
					type="search"
					placeholder="Search products..."
					:class="{ 'border-gray-400': search }"
					v-model="search"
				/>
			</div>
			<Products
				:category="$route.params.categorySlug"
				:page="parseInt($route.params.pageNumber) || page"
				:products="products"
			/>
		</div>
	</main>
</template>

<script>
import GET_PRODUCTS from '~/gql/queries/getProducts'
export default {
	data() {
		return {
			products: [],
			page: 1,
			search: ''
		}
	},
	async asyncData({ $graphql, params }) {
		const variables = { slug: params.categorySlug }
		const { products } = await $graphql.default.request(GET_PRODUCTS, variables)
		return { products: products.nodes }
	},
	mounted() {
		console.log(this.$store.state.filter);
		if (this.$store.state.filter) {
			this.filterProducts(this.$store.state.filter)
		}
	},
	methods: {
		filterProducts(filter) {
			const categorySlug = this.$route.params.categorySlug
			this.products = this.$store.state.products.filter((product) => {
				let { minPrice, maxPrice, starRating } = filter

				// console.log(minPrice, maxPrice, starRating);

				// Category
				const categpryCondition = categorySlug ? product.productCategories.nodes.map((cat) => cat.slug).some((slug) => slug == categorySlug) : true

				// Price
				maxPrice = maxPrice > 0 ? maxPrice : 9999999999
				const price = product.price ? product.price.replace(/\€/g, '').split(' - ') : []
				const priceCondition = price.some((el) => el >= minPrice || 0) && price.some((el) => el <= maxPrice)

				// Rating
				const ratingCondition = product.averageRating >= starRating

				return priceCondition && ratingCondition && categpryCondition
			})

			this.$store.commit('setFilter', filter);
		},
		resetFilter() {
			console.log('reset');
			this.$store.commit('clearFilter');
		}
	}
}
</script>

<style lang="postcss">
.pagination {
	@apply flex mb-8 p-8 gap-2 items-center justify-center;
}
.pagination a {
	@apply rounded-xl bg-purple-100 leading-none py-2 px-4 text-purple-900 hover:bg-purple-200;
}
input[type="search"] {
	@apply border rounded-xl max-w-md outline-none leading-tight w-full p-2 px-4 pl-10 transition-all;
	background: url("/images/search.svg") no-repeat center left 0.75em;
}
</style>
