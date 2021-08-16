<template>
	<div class="container">
		<h1 class="py-12 text-3xl text-center">Login</h1>
		<pre class="mb-12 text-xs">{{this.$auth.user}}</pre>
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
				const data = await this.$graphql.default.request(login, variables)
				console.log(data)
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