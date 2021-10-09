<template>
	<section class="relative w-full h-full min-h-screen">

		<div v-if="products.length" class="mt-8 text-sm font-light" v-html="pageInfo"></div>

		<transition-group name="shrink" mode="in-out" tag="div" v-if="products.length > 0" class="grid grid-cols-4 gap-8 my-8 min-h-[600px]">
			<ProductCard class="w-full" v-for="node in newProducts" :key="node.databaseId" :node="node" />
		</transition-group>
		<div v-else class="flex flex-col items-center justify-center p-8">
			<nuxt-img width="400" height="400" src="/images/empty.svg"></nuxt-img>
			<span>No Products Found</span>
		</div>

		<!-- <Pagination v-if="products" :category="category" :total="products.length" /> -->

		<div class="flex items-center justify-center gap-2 p-8 mb-8">
			<a href="#top" class="px-4 py-2 leading-none text-purple-900 bg-purple-100 hover:bg-purple-200 rounded-xl" v-if="page > 1" @click="page--">Previous</a>
			<a href="#top" class="px-4 py-2 leading-none text-purple-900 bg-purple-100 hover:bg-purple-200 rounded-xl" @click="page++">Next</a>
		</div>

	</section>
</template>

<script>
export default {
	props: {
		page: { type: Number, default: 1 },
		category: { type: String, default: null },
		products: { type: Array, default: null }
	},
	computed: {
		// postWithPagination() { return this.pager(this.products) },
		perPage() {
			return this.$config.perPage
		},
		newProducts() {
			return this.products.slice(this.perPage * this.page - this.perPage, this.perPage * this.page)
		},
		pageInfo() {
			const small = this.perPage * this.page - this.perPage
			const large = Math.min(this.products.length, this.perPage * this.page)
			return `Showing <strong>${small + 1}</strong> to <strong>${large}</strong> of <strong>${this.products.length}</strong> products`
		}
	},
	methods: {
		// pager(products) {
		// 	const pageNum = this.page || this.$route.params.pageNumber
		// 	return products.slice(this.perPage * (pageNum - 1), this.perPage * pageNum)
		// }
	}
}
</script>

<style>
.shrink-move {
	transition: all 500ms;
}
.shrink-leave-active {
	transition: transform 300ms;
	position: absolute;
	opacity: 0;
}
.shrink-enter-active {
	transition: opacity 500ms ease-out 250ms, transform 500ms ease-out;
}
.shrink-enter,
.shrink-leave-to {
	opacity: 0;
	transform: scale(0.75) translateY(25%);
}
</style>