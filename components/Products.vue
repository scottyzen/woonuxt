<template>
	<section class="relative w-full h-full min-h-screen">
		<div v-if="products.length" class="mt-8 text-sm">{{products.length}} products</div>
		<transition-group name="shrink" mode="in-out" tag="div" v-if="products.length > 0" class="grid grid-cols-4 gap-8 my-8">
			<ProductCard class="w-full" v-for="node in postWithPagination" :key="node.databaseId" :node="node" />
		</transition-group>
		<div v-else class="flex flex-col items-center justify-center p-8">
			<nuxt-img width="400" height="400" src="/images/empty.svg"></nuxt-img>
			<span>No Products Found</span>
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