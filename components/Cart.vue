<template>
	<section v-if="!$apollo.loading" class="fixed top-0 right-0 h-screen p-12 bg-white shadow-lg w-96">
		<CloseCart />
		<pre class="text-xs" v-if="cart">{{ cart }}</pre>
		<pre class="text-xs" v-if="viewer">{{ viewer }}</pre>
		<button @click="getUser">Get User</button>
	</section>
</template>

<script>
import axios from 'axios'
import { gql } from 'nuxt-graphql-request'
import getCart from '~/gql/queries/getCart'
const requestHeaders = {
	'Content-Type': 'application/json',
	Accept: 'application/json'
}

export default {
	data() {
		return {
			cart: null,
			viewer: null
		}
	},
	async fetch() {
		const cart = await this.$graphql.default.request(getCart)
		this.cart = cart
	},
	methods: {
		async getUser() {
			// const query = gql`
			// 	query {
			// 		viewer {
			// 			email
			// 			firstName
			// 		}
			// 	}
			// `

			// axios.post(`https://testing.2cubedtest.com/grapghql`, { withCredentials: true }, query).then(
			// 	(response) => {
			// 		console.log(response)
			// 	},
			// 	(error) => {
			// 		console.log(error)
			// 	}
			// )

			// const data = await this.$graphql.default.rawRequest(query)
			// const cart = await this.$graphql.default.request(getCart)
			// this.cart = cart
			// this.viewer = data.data.viewer
			// console.log(data)

			const data = {
				query: `query {
					viewer {
						email
						firstName
					}
				}`
			}

			const options = {
				method: 'POST',
				withCredentials: true,
				headers: {
					'content-type': 'application/json',
					Accept: 'application/json'
				},
				data,
				url: 'https://testing.2cubedtest.com/graphql'
			}

			try {
				const response = await axios(options)
				console.log(response)
			} catch (error) {
				console.error(error)
			}
		}
	}
}
</script>
