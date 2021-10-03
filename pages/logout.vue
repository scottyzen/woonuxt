<template>
	<div class="container flex items-center justify-center min-h-[300px] text-2xl">
		<h2 v-if="hasLoggedOut">You have been successfully logged out.</h2>
		<h2 v-else>Something went wrong. Please try again</h2>
	</div>
</template>

<script>
import { gql } from 'nuxt-graphql-request'

export default {
	data() {
		return {
			hasLoggedOut: false
		}
	},
	methods: {
		async logOut() {
			const query = gql`
				mutation Logout {
					logout(input: { clientMutationId: "kjnasljxnaslk" }) {
						status
					}
				}
			`
			const { logout } = await this.$graphql.default.request(query)
			// SUCCESS
			if (logout.status == 'SUCCESS') {
				this.hasLoggedOut = true
			}

			console.log(logout.status)
		}
	},
	mounted() {
		this.logOut()
	}
}
</script>
