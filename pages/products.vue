<template>
	<main class="container flex">
		<Filters @filter-updated="filterProducts" :activeFilters="this.$store.state.filter" />

		<div class="flex flex-col flex-1 md:pl-8">
			<div class="flex mt-8 gap-4 items-center">
				<span class="rounded-xl bg-gray-500 text-white p-1.5 md:hidden">
					<Icon name="filter" width="22" height="22" />
				</span>
				<MultiSearch @has-changed="filterProducts" :activeTags="this.$store.state.searchTags" />
				<!-- <Search @search="filterSearch" /> -->
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
import Fuse from 'fuse.js'

export default {
	data() {
		return {
			products: [],
			page: this.$route.params.page || 1,
			fuseOptions: {
				shouldSort: true,
				threshold: 0.3,
				location: 0,
				distance: 100,
				maxPatternLength: 32,
				minMatchCharLength: 1,
				keys: [
					"name",
					"productCategories.nodes.name"
				]
			}
		}
	},
	async asyncData({ $graphql, params }) {
		const variables = { slug: params.categorySlug }
		const { products } = await $graphql.default.request(GET_PRODUCTS, variables)
		return { products: products.nodes }
	},
	mounted() {
		if (this.$store.state.filter || this.$store.state.searchTags.length) {
			this.filterProducts()
		}
	},
	methods: {
		setPage(number) {
			this.page = number
		},
		filterProducts() {

			const FILTERED_PRODUCTS = this.$store.state.filter ? this.$store.state.products.filter((product) => {
				let { minPrice, maxPrice, starRating } = this.$store.state.filter

				// Category
				const categoryCondition = this.$route.params.categorySlug ? product.productCategories.nodes.map((cat) => cat.slug).some((slug) => slug == categorySlug) : true

				// Price
				maxPrice = maxPrice > 0 ? maxPrice : 9999999999
				const price = product.price ? product.price.replace(/\€/g, '').split(' - ') : []
				const priceCondition = price.some((el) => el >= minPrice || 0) && price.some((el) => el <= maxPrice)

				// Rating
				const ratingCondition = product.averageRating >= starRating


				return priceCondition && ratingCondition && categoryCondition
			}) : this.$store.state.products



			const fuse = new Fuse(this.$store.state.products, this.fuseOptions)
			const searchTags = this.$store.state.searchTags;
			const SEARCHED_PRODUCTS = searchTags.length ? fuse.search(searchTags.join(' | ')).map((result) => result.item) : this.$store.state.products

			const PRODUCTS_IN_BOTH = SEARCHED_PRODUCTS.filter((product) => FILTERED_PRODUCTS.some((filteredProduct) => filteredProduct.databaseId == product.databaseId))

			this.refreshProducts(PRODUCTS_IN_BOTH);

		},
		refreshProducts(products) {
			this.products = products;
			if (this.products.length < this.$config.perPage) { this.page = 1 }
		},
	},
}
</script>

<style lang="postcss" >
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
