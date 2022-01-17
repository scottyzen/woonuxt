<template>
	<div class="container">
		<h1 class="text-center py-12 text-3xl">Sign In</h1>
		<UserAuthForm buttonText="Login" :submitForm="loginUser" />
	</div>
</template>

<script>
import LOGIN from '~/gql/mutations/login';
import getCart from '~/gql/queries/getCart';

export default {
	methods: {
		async loginUser(logininfo) {
			try {
				const variables = {
					username: logininfo.email,
					password: logininfo.password,
				};
				const { loginWithCookies } = await this.$graphql.default.request(LOGIN, variables);
				console.log(loginWithCookies);
				if (loginWithCookies.status == 'SUCCESS') {
					const { cart, viewer } = await this.$graphql.default.request(getCart);
					console.log({ cart }, { viewer });
					this.$store.commit('updateCart', cart);
					this.$store.commit('updateUser', viewer);

					this.$router.push('/');
				}
			} catch (error) {
				console.error(JSON.stringify(error, undefined, 2));
			}
		},
	},
	created() {
		// console.dir(this.$auth)
	},
};
</script>
