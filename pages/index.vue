<template>
	<div>
		<NuxtLink class="flex relative items-center justify-center" to="/products">
			<NuxtImg
				class="rounded object-cover w-full lg:h-[580px]"
				src="/images/hero.jpeg"
				width="1400"
				height="909"
				sizes="xs:320px sm:100vw md:100vw lg:100vw"
				alt="Hero image"
				format="webp"
				preload
			/>
			<div class="container text-gray-900 absolute">
				<h1 class="font-bold mb-24 text-2xl md:mb-4 lg:text-6xl">Just landed.</h1>
				<div
					class="font-light max-w-sm mb-12 hidden md:block"
				>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Unde nam dignissimos nostrum veritatis nisi autem accusantium modi? Enim, voluptatibus consectetur.</div>
			</div>
		</NuxtLink>

		<section class="my-16 md:my-24">
			<div class="container flex items-end justify-between">
				<h2 class="font-semibold text-lg md:text-2xl">Shop by category</h2>
				<NuxtLink class="text-primary" to="/categories">View All</NuxtLink>
			</div>

			<SCSlider>
				<CategoryCard
					class="min-w-[140px] lg:min-w-[200px]"
					v-for="(category, i) in productCategories.nodes"
					:key="i"
					:node="category"
				/>
			</SCSlider>
		</section>

		<section class="my-16 md:my-24">
			<div class="container flex items-end justify-between">
				<h2 class="font-semibold text-lg md:text-2xl">Best Sellers</h2>
				<NuxtLink class="text-primary" to="/products">View All</NuxtLink>
			</div>
			<SCSlider class="lg:gap-6">
				<ProductCard
					class="min-w-[160px] lg:min-w-[280px]"
					v-for="node in  bestSellers.nodes"
					:key="node.databaseId"
					:node="node"
				/>
			</SCSlider>
		</section>

		<section class="my-16 md:my-24">
			<div class="container flex items-end justify-between">
				<h2 class="font-semibold text-lg md:text-2xl">Latest Products</h2>
				<NuxtLink class="text-primary" to="/products">View All</NuxtLink>
			</div>
			<SCSlider class="lg:gap-6">
				<ProductCard
					class="min-w-[160px] lg:min-w-[280px]"
					v-for="node in  latesProducts.nodes"
					:key="node.databaseId"
					:node="node"
				/>
			</SCSlider>
		</section>
	</div>
</template>

<script>
import { hydrateWhenIdle } from 'vue-lazy-hydration';
import GET_PRODUCTS from '~/gql/queries/getProducts'
import GET_PRODUCT_CATEGORIES from '~/gql/queries/getProductCategories';

export default {
	head() {
		return {
			title: 'Home',
			meta: [{ name: 'description', content: 'Home page' }]
		}
	},
	async asyncData({ $graphql, params }) {
		const { productCategories } = await $graphql.default.request(GET_PRODUCT_CATEGORIES);
		const { products: bestSellers } = await $graphql.default.request(GET_PRODUCTS, { first: 8, orderby: [{ field: "TOTAL_SALES", order: "DESC" }] })
		const { products: latesProducts } = await $graphql.default.request(GET_PRODUCTS, { first: 8, orderby: [{ field: "DATE", order: "DESC" }] })
		return { productCategories, bestSellers, latesProducts };
	},
	components: {
		SCSlider: hydrateWhenIdle(() => import('../components/SCSlider.vue')),
	},
};
</script>