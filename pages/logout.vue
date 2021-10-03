<template>
	<div class="container flex items-center justify-center min-h-[300px] text-2xl">
		<LoadingIcon v-if="hasLoggedOut == null" />
		<h2 v-if="hasLoggedOut == true">You have been successfully logged out.</h2>
		<h2 v-if="hasLoggedOut == false">Something went wrong. Please try again</h2>
	</div>
</template>

<script>
import { gql } from 'nuxt-graphql-request'

export default {
	data() {
		return {
			hasLoggedOut: null
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
			this.hasLoggedOut = logout.status == 'SUCCESS' ? true : false
		}
	},
	mounted() {
		this.logOut()
	}
}
</script>
