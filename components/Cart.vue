<template>
	<section class="fixed top-0 bottom-0 right-0 flex flex-col max-w-lg bg-white shadow-lg w-9/10">
		<CloseCart class="p-1.5 bg-white shadow-xl rounded-xl" />
		<EmptyCart class="p-1.5 bg-red-400 text-white shadow-xl rounded-xl" />

		<div class="mt-8 text-center">Basket</div>

		<ul class="flex flex-col flex-1 gap-4 p-8">
			<CartCard v-for="item in $store.state.cart.contents.nodes" :key="item.databaseId" :item="item" />
		</ul>

		<div class="p-8">
			<nuxt-link class="block p-3 text-lg text-center bg-white shadow-md justify-evenly rounded-2xl hover:(bg-purple-500 text-white)" to="/">
				<span class="mx-2">Checkout</span>
				<span>{{$store.state.cart.total}}</span>
			</nuxt-link>
		</div>

	</section>
</template>

<script>
import { gql } from 'nuxt-graphql-request'
import getCart from '~/gql/queries/getCart'

export default {
	data() {
		return {
			viewer: null
		}
	},
	async fetch() {
		const { cart } = await this.$graphql.default.request(getCart)
		this.$store.commit('updateCart', cart)
	},
	methods: {
		async getUser() {
			const query = gql`
				query {
					viewer {
						email
						firstName
					}
				}
			`

			const data = await this.$graphql.default.rawRequest(query)
			const cart = await this.$graphql.default.request(getCart)
			this.cart = cart
			this.viewer = data.data.viewer
			console.log(data)
		}
	}
}
</script>


<style scoped>
section {
	background: linear-gradient(#fff, #ececf1);
}
</style>