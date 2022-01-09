<template>
	<div>
		<nuxt-link class="flex relative items-center justify-center" to="/products">
			<NuxtImg
				class="rounded object-cover h-64 w-full lg:h-[580px]"
				src="/images/hero.jpeg"
				width="1400"
				height="909"
				sizes="sm:100vw md:100vw lg:1200px"
				alt="Hero image"
			/>
			<div class="container text-gray-900 absolute">
				<h1 class="font-bold mb-24 text-2xl md:mb-4 lg:text-6xl">Just landed.</h1>
				<div
					class="font-light max-w-sm mb-12 hidden md:block"
				>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Unde nam dignissimos nostrum veritatis nisi autem accusantium modi? Enim, voluptatibus consectetur.</div>
			</div>
		</nuxt-link>

		<section class="mt-16 md:my-24">
			<div class="container flex items-end justify-between">
				<h2 class="font-semibold text-lg md:text-2xl">Shop by category</h2>
				<nuxt-link class="text-primary" to="/categories">View All</nuxt-link>
			</div>
			<SCSlider>
				<CategoryCard
					class="min-w-[180px] lg:min-w-[200px]"
					v-for="(category, i) in productCategories.nodes"
					:key="i"
					:node="category"
				/>
			</SCSlider>
		</section>

		<section class="mt-16 md:my-24">
			<div class="container flex items-end justify-between">
				<h2 class="font-semibold text-lg md:text-2xl">Best Sellers</h2>
				<nuxt-link class="text-primary" to="/products">View All</nuxt-link>
			</div>
			<SCSlider>
				<ProductCard
					class="min-w-[200px] lg:min-w-[280px]"
					v-for="(node, i) in  bestSellers.nodes"
					:key="node.databaseId"
					:node="node"
					:index="i"
				/>
			</SCSlider>
		</section>

		<section class="mt-16 md:my-24">
			<div class="container flex items-end justify-between">
				<h2 class="font-semibold text-lg md:text-2xl">Latest Products</h2>
				<nuxt-link class="text-primary" to="/products">View All</nuxt-link>
			</div>
			<SCSlider>
				<ProductCard
					class="min-w-[200px] lg:min-w-[280px]"
					v-for="(node, i) in  latesProducts.nodes"
					:key="node.databaseId"
					:node="node"
					:index="i"
				/>
			</SCSlider>
		</section>
		<!-- <ProductRow :products="bestSellers.nodes" /> -->

		<!-- <section class="container  mt-16 md:my-24">
			<h2 class="font-semibold text-lg mb-4 md:text-2xl">Latest Products</h2>
			<ProductRow :products="latesProducts.nodes" />
		</section>-->
	</div>
</template>

<script>
// import registerCustomer from '~/gql/mutations/registerCustomer';
// import login from '~/gql/mutations/login';
import GET_PRODUCTS from '~/gql/queries/getProducts'
import GET_PRODUCT_CATEGORIES from '~/gql/queries/getProductCategories';

export default {
	async asyncData({ $graphql, params }) {
		const { productCategories } = await $graphql.default.request(GET_PRODUCT_CATEGORIES);
		const { products: bestSellers } = await $graphql.default.request(GET_PRODUCTS, { first: 8, orderby: [{ field: "TOTAL_SALES", order: "DESC" }] })
		const { products: latesProducts } = await $graphql.default.request(GET_PRODUCTS, { first: 8, orderby: [{ field: "DATE", order: "DESC" }] })
		return {
			productCategories,
			bestSellers,
			latesProducts
		};
	}
};
</script>