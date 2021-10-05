<template>
	<section class="fixed top-0 right-0 h-screen p-12 bg-white shadow-lg w-96">
		<CloseCart />
		<pre class="text-xs" v-if="$store.state.cart">{{ $store.state.cart }}</pre>
		<pre class="text-xs" v-if="viewer">{{ viewer }}</pre>
		<button @click="getUser">Get User</button>
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
