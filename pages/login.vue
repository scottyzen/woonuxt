<template>
	<div class="container">
		<h1 class="py-12 text-3xl text-center">Login</h1>
		<UserAuthForm buttonText="Login" :submitForm="loginUser" />
	</div>
</template>

<script>
import login from '~/gql/mutations/login'

export default {
	methods: {
		async loginUser(logininfo) {
			try {
				const variables = {
					username: logininfo.email,
					password: logininfo.password
				}
				const { loginWithCookies } = await this.$graphql.default.request(login, variables)
				if (loginWithCookies.status == 'SUCCESS') {
					this.$router.push('/')
				}
			} catch (error) {
				console.error(JSON.stringify(error, undefined, 2))
			}
		}
	},
	created() {
		// console.dir(this.$auth)
	}
}
</script>
