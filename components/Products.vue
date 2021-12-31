<template>
	<section class="h-full min-h-screen w-full relative">
		<!-- Count Description -->
		<div
			v-if="products.length"
			class="font-light mt-8 text-sm -top-16 right-0 absolute hidden lg:block"
		>
			Showing
			<strong>{{ small + 1 }}</strong> to
			<strong>{{ large }}</strong> of
			<strong>{{ this.products.length }}</strong> products
		</div>

		<!-- No Products Found  -->
		<div v-if="products.length == 0" class="flex flex-col p-8 items-center justify-center">
			<nuxt-img width="400" height="400" src="/images/empty.svg"></nuxt-img>
			<span>No Products Found</span>
		</div>

		<!-- Products -->
		<transition-group
			v-else
			name="shrink"
			mode="in-out"
			class="my-8 min-h-[600px] grid transition-all gap-8 product-grid"
		>
			<ProductCard
				class="w-full"
				v-for="(node, i) in newProducts"
				:key="node.databaseId"
				:node="node"
				:index="i"
			/>
		</transition-group>

		<!-- Pagination -->
		<div class="pagination">
			<a href="#" v-if="page > 1" @click="page--">Previous</a>
			<a href="#" v-if="large != products.length" @click="page++">Next</a>
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
		small() {
			return this.perPage * this.page - this.perPage
		},
		large() {
			return Math.min(this.products.length, this.perPage * this.page)
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

<style lang="postcss">
.product-grid {
	grid-template-columns: repeat(2, 1fr);
}
@media (min-width: 768px) {
	.product-grid {
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
	}
}
.pagination {
	@apply flex mb-8 p-8 gap-2 items-center justify-center;
}
.pagination a {
	@apply rounded-xl bg-purple-100 leading-none py-2 px-4 text-purple-900 hover:bg-purple-200;
}
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
	will-change: opacity, transform;
}
.shrink-enter,
.shrink-leave-to {
	opacity: 0;
	transform: scale(0.75) translateY(25%);
}
</style>