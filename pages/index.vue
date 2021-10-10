<template>
	<div>
		<nuxt-link class="relative flex items-center justify-center" to="/products">
			<NuxtImg class="object-cover w-full rounded h-64 lg:h-[580px]" src="/images/hero.jpeg" width="1400" height="909" sizes="sm:100vw md:100vw lg:1200px" alt="Hero image" />
			<div class="container absolute text-gray-900">
				<h1 class="mb-24 text-2xl font-bold md:mb-4 lg:text-6xl">Just landed.</h1>
				<div class="hidden max-w-sm mb-12 font-light md:block">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Unde nam dignissimos nostrum veritatis nisi autem accusantium modi? Enim, voluptatibus consectetur.</div>
			</div>
		</nuxt-link>
		<section class="container mt-8 md:mt-16">
			<div class="flex items-end justify-between">
				<h2 class="text-lg font-semibold md:text-2xl">Shop by category</h2>
				<nuxt-link class="text-green-700" to="/products">View All</nuxt-link>
			</div>
		</section>

		<div class="my-4 scslider" :style="cssVars">
			<nuxt-link class="relative flex justify-center overflow-hidden border border-white rounded h-36 md:h-64 item" v-for="(cat, i) in productCategories.nodes" :key="i" :to="`/product-category/${cat.slug}`">
				<NuxtImg v-if="cat.image" sizes="sm:50vw md:200px" width="400" height="400" class="absolute inset-0 object-cover w-full h-full" :src="cat.image.sourceUrl" loading="lazy" :alt="cat.name" />
				<div class="overlay"></div>
				<span class="relative z-10 mt-auto mb-2 text-sm font-semibold text-white capitalize md:mb-4 md:text-base">{{cat.name}}</span>
			</nuxt-link>
		</div>
	</div>
</template>

<script>
import registerCustomer from '~/gql/mutations/registerCustomer'
import login from '~/gql/mutations/login'
import getProductCategories from '../gql/queries/getProductCategories'

export default {
	data() {
		return {
			categories: ['accessories', 'hoodies', 'music', 'clothing', 'tshirts', 'accessories', 'hoodies', 'music'],
			// categories: ['accessories', 'hoodies', 'music'],
			containerFromLeft: 0
		}
	},
	async asyncData({ $graphql, params }) {
		const { productCategories } = await $graphql.default.request(getProductCategories)
		return {
			productCategories
		}
	},
	mounted() {
		window.addEventListener('resize', this.handleResize)
		this.handleResize()
	},
	destroyed() {
		window.removeEventListener('resize', this.handleResize)
	},
	methods: {
		handleResize() {
			if (process.client) {
				this.containerFromLeft = document.querySelector('.container').getBoundingClientRect().left
			}
		}
	},
	computed: {
		cssVars() {
			return {
				'--containerFromLeft': this.containerFromLeft + 'px'
			}
		}
	}
}
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
	width: 20%;
	min-width: 25vw;
	scroll-snap-align: start;
	scroll-snap-stop: always;
}
@media (min-width: 768px) {
	.scslider .item {
		min-width: 200px;
	}
}
.scslider::before,
.scslider::after {
	content: '';
	min-width: var(--containerFromLeft);
	max-width: var(--containerFromLeft);
	scroll-snap-align: start;
	scroll-snap-stop: always;
}
.overlay {
	@apply absolute inset-x-0 bottom-0 opacity-50 h-1/2 bg-gradient-to-t from-black to-transparent;
}
</style>