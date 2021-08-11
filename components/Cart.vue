<template>
	<section v-if="!$apollo.loading" class="fixed top-0 right-0 h-screen p-12 bg-white shadow-lg w-96">
		<CloseCart />
		<pre class="text-xs" v-if="cart">{{cart}}</pre>
		<pre class="text-xs" v-if="viewer">{{viewer}}</pre>
		<button @click="getUser">Get User</button>
	</section>
</template>

<script>
import { gql } from 'nuxt-graphql-request'
import getCart from '~/gql/queries/getCart'
const requestHeaders = {
	'Content-Type': 'application/json',
	Accept: 'application/json'
	// authorization: `Basic ${Buffer.from(`2cubed_admin:fBw4$)(M#7*7@Hfvr3aMxq%l`).toString('base64')}`
	// 'woocommerce-session': `Session ya29.a0ARrdaM-ETQ93J_rRS46421Iswn05sjIK1nuIwk7jFOuDypH1XRv5qCHYLgUvemxAVJ6Bd6bTn7BJBwMMsEVP7J0uJvS_eGop_Rtf5QbOTb0QP20QGYeq1ZDwEEBUd-H8vdf2sp0sbykuNpx3g3WA0rwKQ87n`
	// 'woocommerce-session':
	// 	'Session eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvdGVzdGluZy4yY3ViZWR0ZXN0LmNvbSIsImlhdCI6MTYyODQ1MDExNiwibmJmIjoxNjI4NDUwMTE2LCJleHAiOjE2Mjg2MjI5MTYsImRhdGEiOnsiY3VzdG9tZXJfaWQiOjF9fQ.uWYc9sa5X9vPnshk3sqqw2Qi1nTIV66PVbxRaWocpFE'
	// Authorization:
	// 	'Bearer ya29.a0ARrdaM-ETQ93J_rRS46421Iswn05sjIK1nuIwk7jFOuDypH1XRv5qCHYLgUvemxAVJ6Bd6bTn7BJBwMMsEVP7J0uJvS_eGop_Rtf5QbOTb0QP20QGYeq1ZDwEEBUd-H8vdf2sp0sbykuNpx3g3WA0rwKQ87n'
}

export default {
	data() {
		return {
			cart: null,
			viewer: null
		}
	},
	async fetch() {
		console.log(`Basic ${Buffer.from(`2cubed_admin:fBw4$)(M#7*7@Hfvr3aMxq%l`).toString('base64')}`)
		const cart = await this.$graphql.default.request(getCart, {}, requestHeaders)
		this.cart = cart
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

			const data = await this.$graphql.default.rawRequest(query, {}, requestHeaders)
			const cart = await this.$graphql.default.request(getCart, {}, requestHeaders)
			this.cart = cart
			this.viewer = data.data.viewer
			console.log(data)
		}
	}
}
</script>
