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
			<div class="container container-sm text-gray-900 absolute">
				<h1 class="font-bold mb-24 text-2xl md:mb-4 lg:text-6xl">Just landed.</h1>
				<div
					class="font-light max-w-sm mb-12 hidden md:block"
				>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Unde nam dignissimos nostrum veritatis nisi autem accusantium modi? Enim, voluptatibus consectetur.</div>
			</div>
		</nuxt-link>

		<section class="container container-sm mt-8 md:mt-24">
			<div class="flex items-end justify-between">
				<h2 class="font-semibold text-lg md:text-2xl">Shop by category</h2>
				<nuxt-link class="text-green-700" to="/products">View All</nuxt-link>
			</div>
		</section>
		<div class="my-4 scslider" :style="cssVars">
			<nuxt-link
				class="item"
				v-for="(cat, i) in productCategories.nodes"
				:key="i"
				:to="`/product-category/${cat.slug}`"
			>
				<NuxtImg
					v-if="cat.image"
					sizes="sm:50vw md:200px"
					width="400"
					height="400"
					class="h-full object-cover w-full inset-0 absolute"
					:src="cat.image.sourceUrl"
					loading="lazy"
					:alt="cat.name"
				/>
				<div class="overlay"></div>
				<span
					class="font-semibold mt-auto text-sm text-white mb-2 z-10 relative capitalize md:text-base md:mb-4"
				>{{ cat.name }}</span>
			</nuxt-link>
		</div>

		<section class="container container-sm mt-8 md:my-24">
			<h2 class="font-semibold text-lg mb-4 md:text-2xl">Best Sellers</h2>
			<ProductRow :products="bestSellers.nodes" />
		</section>

		<section class="container container-sm mt-8 md:my-24">
			<h2 class="font-semibold text-lg mb-4 md:text-2xl">Latest Products</h2>
			<ProductRow :products="latesProducts.nodes" />
		</section>

		<!-- <div class="container py-8">
			<pre class="font-light bg-gray-800 my-4 text-white p-4 text-[10px] whitespace-pre-wrap">{{$store.state.cart}}</pre>
			<pre class="font-light bg-gray-800 my-4 text-white p-4 text-[10px] whitespace-pre-wrap">{{$store.state.user}}</pre>
		</div>-->
	</div>
</template>

<script>
// import registerCustomer from '~/gql/mutations/registerCustomer';
// import login from '~/gql/mutations/login';
import GET_PRODUCTS from '~/gql/queries/getProducts'
import GET_PRODUCT_CATEGORIES from '~/gql/queries/getProductCategories';

export default {
	data() {
		return {
			containerFromLeft: 0,
		};
	},
	async asyncData({ $graphql, params }) {
		const { productCategories } = await $graphql.default.request(GET_PRODUCT_CATEGORIES);
		const { products: bestSellers } = await $graphql.default.request(GET_PRODUCTS, { first: 5, orderby: [{ field: "TOTAL_SALES", order: "DESC" }] })
		const { products: latesProducts } = await $graphql.default.request(GET_PRODUCTS, { first: 5, orderby: [{ field: "DATE", order: "DESC" }] })
		return {
			productCategories,
			bestSellers,
			latesProducts
		};
	},
	mounted() {
		this.handleResize();
	},
	destroyed() {
		window.removeEventListener('resize', this.handleResize);
	},
	methods: {
		handleResize() {
			window.addEventListener('resize', this.handleResize);
			if (process.client) {
				const container = document.querySelector('.container-sm');
				const containerLeftPadding = parseInt(window.getComputedStyle(container).paddingLeft);
				this.containerFromLeft = container.getBoundingClientRect().left + containerLeftPadding / 2;
			}
		},
	},
	computed: {
		cssVars() {
			return {
				'--containerFromLeft': this.containerFromLeft + 'px',
			};
		},
	},
};
</script>

<style lang="postcss">
.scslider {
	@apply flex gap-4 overflow-x-scroll;
	scroll-snap-type: x mandatory;
	scroll-behavior: smooth;
	scroll-padding-inline: calc(var(--containerFromLeft) + 1rem);
}
.scslider::-webkit-scrollbar {
	display: none;
}
.scslider .item {
	@apply border border-white rounded flex relative justify-center overflow-hidden;
	width: 20%;
	min-width: 25vw;
	scroll-snap-align: start;
	scroll-snap-stop: always;
	aspect-ratio: 4 / 5;
}
@media (min-width: 768px) {
	.scslider .item {
		min-width: 200px;
	}
}
.scslider::before,
.scslider::after {
	content: "";
	min-width: var(--containerFromLeft);
	max-width: var(--containerFromLeft);
	scroll-snap-align: start;
	scroll-snap-stop: always;
}
.overlay {
	@apply bg-gradient-to-t from-black to-transparent h-1/2 opacity-50 inset-x-0 bottom-0 absolute;
}
</style>