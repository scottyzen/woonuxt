<template>
	<div>
		<section class="relative flex items-center justify-center">
			<NuxtImg class="object-cover w-full rounded h-64 lg:h-[580px]" src="/images/hero.jpeg" loading="lazy" />
			<div class="container absolute text-gray-900">
				<h1 class="mb-12 text-3xl font-bold md:mb-4 lg:text-6xl">Just landed.</h1>
				<div class="hidden max-w-sm mb-12 font-light md:block">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Unde nam dignissimos nostrum veritatis nisi autem accusantium modi? Enim, voluptatibus consectetur.</div>
				<nuxt-link class="inline-block p-4 px-6 leading-none text-black bg-white rounded shadow-sm" to="/products">Shop New Arrivals</nuxt-link>
				<!-- <nuxt-link class="big-button" to="/products">Shop New Arrivals</nuxt-link> -->
			</div>
		</section>
		<section class="container mt-16">
			<div class="flex items-end justify-between">
				<h2 class="text-2xl font-semibold">Shop by category</h2>
				<nuxt-link class="text-green-700" to="/products">Browse all categories</nuxt-link>
			</div>
		</section>

		<ul class="my-8 scslider" :style="cssVars">
			<li class="relative flex justify-center h-64 overflow-hidden border border-white rounded item" v-for="(cat, i) in categories" :key="i">
				<NuxtImg class="absolute inset-0 object-cover w-full h-full" :src="`/images/${cat}.jpg`" />
				<div class="absolute inset-0 hover:opacity-50 opacity-40 top-1/2 bg-gradient-to-t from-black to-transparent"></div>
				<nuxt-link :to="`/product-category/${cat}`" class="relative z-10 my-4 mt-auto font-semibold text-white capitalize">{{cat}}</nuxt-link>
			</li>
		</ul>
	</div>
</template>

<script>
import registerCustomer from '~/gql/mutations/registerCustomer'
import login from '~/gql/mutations/login'

export default {
	data() {
		return {
			categories: ['accessories', 'hoodies', 'music', 'clothing', 'tshirts', 'accessories', 'hoodies', 'music'],
			// categories: ['accessories', 'hoodies', 'music'],
			containerFromLeft: 0
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
	display: flex;
	gap: 20px;
	flex-flow: row nowrap;
	align-items: center;
	overflow-x: scroll;
	scroll-snap-type: x mandatory;
	scroll-behavior: smooth;
	scroll-padding-inline-start: calc(var(--containerFromLeft) + 1rem);
	/* margin: 0 1rem; */
	/* cursor: ew-resize; */
}
.scslider::-webkit-scrollbar {
	display: none;
}
.scslider .item {
	/* flex: 0 0 20%; */
	width: 20%;
	min-width: 180px;
	display: inherit;
	justify-content: center;
	align-items: center;
	scroll-snap-align: start;
	scroll-snap-stop: always;
	/* margin-left: 20px; */
}
.scslider::before,
.scslider::after {
	content: '';
	min-width: var(--containerFromLeft);
	max-width: var(--containerFromLeft);
	scroll-snap-align: start;
	scroll-snap-stop: always;
}
</style>