<template>
	<main class="container flex">
		<Filters
			@filter-updated="filterProducts"
			@clear-filters="resetFilter"
			:activeFilters="this.$store.state.filter"
		/>

		<div class="flex flex-col flex-1 md:pl-8">
			<div class="flex mt-8 gap-4 items-center">
				<span class="rounded-xl bg-gray-500 text-white p-1.5 md:hidden">
					<Icon name="filter" width="22" height="22" />
				</span>
				<Search @search="filterSearch" />
			</div>
			<Products
				:category="$route.params.categorySlug"
				:page="parseInt($route.params.pageNumber) || page"
				:products="products"
				@setPage="setPage"
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
			searchedProducts: null,
			page: this.$route.params.page || 1,
			search: ''
		}
	},
	async asyncData({ $graphql, params }) {
		const variables = { slug: params.categorySlug }
		const { products } = await $graphql.default.request(GET_PRODUCTS, variables)
		return { products: products.nodes }
	},
	mounted() {
		if (this.$store.state.filter) {
			this.filterProducts(this.$store.state.filter)
		}
	},
	methods: {
		setPage(number) {
			this.page = number
		},
		filterProducts(filter) {
			const filteredProducts = this.$store.state.products.filter((product) => {
				let { minPrice, maxPrice, starRating } = filter

				// Category
				const categoryCondition = this.$route.params.categorySlug ? product.productCategories.nodes.map((cat) => cat.slug).some((slug) => slug == categorySlug) : true

				// Price
				maxPrice = maxPrice > 0 ? maxPrice : 9999999999
				const price = product.price ? product.price.replace(/\€/g, '').split(' - ') : []
				const priceCondition = price.some((el) => el >= minPrice || 0) && price.some((el) => el <= maxPrice)

				// Rating
				const ratingCondition = product.averageRating >= starRating

				return priceCondition && ratingCondition && categoryCondition
			})
			this.refreshProducts(filteredProducts);
			this.$store.commit('setFilter', filter);

			// If they are no products on Page change page number to 1
			if (this.products.length < this.$config.perPage) {
				this.page = 1
			}
		},
		refreshProducts(productsFilteresd, productsFound) {
			this.products = !productsFound ? productsFilteresd : productsFilteresd.filter((product) => {
				return productsFound.some((productFound) => productFound.databaseId == product.databaseId)
			})
			// If they are no products on Page change page number to 1
			if (this.products.length < this.$config.perPage) { this.page = 1 }
		},
		resetFilter() {
			this.$store.commit('clearFilter');
		},
		filterSearch(payload) {
			const { search, results } = payload
			if (!search && this.$store.state.filter) {
				this.filterProducts(this.$store.state.filter)
				return
			}
			this.refreshProducts(this.products, results);

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
