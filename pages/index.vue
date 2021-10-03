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
		<section class="container my-32">
			<div class="flex items-end justify-between">
				<h2 class="text-2xl font-semibold">Shop by category</h2>
				<nuxt-link class="text-green-700" to="/products">Browse all categories</nuxt-link>
			</div>
			<ul class="grid grid-cols-2 gap-10 my-8 lg:grid-cols-5">
				<li class="relative flex items-end justify-center h-48 overflow-hidden rounded" v-for="(cat, i) in categories" :key="i">
					<NuxtImg class="absolute inset-0 object-cover w-full h-full" :src="`/images/${cat}.jpg`" />
					<div class="absolute inset-0 hover:opacity-40 opacity-20 top-1/2 bg-gradient-to-t from-black to-transparent"></div>
					<nuxt-link :to="`/product-category/${cat}`" class="relative z-10 my-4 font-semibold text-white capitalize">{{cat}}</nuxt-link>
				</li>
			</ul>
		</section>
	</div>
</template>

<script>
import registerCustomer from '~/gql/mutations/registerCustomer'
import login from '~/gql/mutations/login'

export default {
	data() {
		return {
			categories: ['accessories', 'hoodies', 'music', 'clothing']
		}
	},
	methods: {
		// async startWooSession() {
		// 	const password = this.$auth.user.sub
		// 	const email = this.$auth.user.email
		// 	const data = await this.$graphql.default.request(registerCustomer, { email, password })
		// 	const username = data.registerCustomer.customer.username
		// 	if (username) {
		// 		this.login(username, password)
		// 	}
		// },
		// async login(username, password) {
		// 	const data = await this.$graphql.default.request(login, { username, password })
		// 	console.log(data)
		// }
	},
	mounted() {
		// if (this.$auth.loggedIn && this.$auth.strategy.options.name == 'google') {
		// 	this.startWooSession()
		// }
	}
}
</script>