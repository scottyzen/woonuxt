<template>
	<section class="relative w-full h-full min-h-screen">
		<div v-if="products" class="mt-8 text-sm">{{products.length}} products</div>
		<div v-if="products" class="grid grid-cols-2 gap-8 my-8 lg:grid-cols-4">
			<ProductCard v-for="node in postWithPagination" :key="node.databaseId" :node="node" />
		</div>
		<div v-else class="p-8">
			No Products Found
		</div>
		<Pagination v-if="products" :category="category" :total="products.length" />
	</section>
</template>

<script>
export default {
	props: {
		perPage: { type: Number, default: null },
		page: { type: Number, default: 1 },
		category: { type: String, default: null },
		products: { type: Array, default: null }
	},
	computed: {
		postWithPagination() {
			return this.pager(this.products)
		}
	},
	methods: {
		pager(products) {
			const perPage = this.perPage || this.$config.perPage
			const pageNum = this.page || this.$route.params.pageNumber
			return products.slice(perPage * (pageNum - 1), perPage * pageNum)
		}
	}
}
</script>
