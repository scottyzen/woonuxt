<template>
	<div class="container">
		<h1 class="text-center py-12 text-3xl">Sign In</h1>
		<UserAuthForm buttonText="Login" :submitForm="loginUser" />
	</div>
</template>

<script>
import LOGIN from '~/gql/mutations/login';
import GET_CART from '~/gql/queries/getCart';

export default {
	head() {
		return { title: 'Login' }
	},
	methods: {
		async loginUser(logininfo) {
			try {
				const variables = { username: logininfo.email, password: logininfo.password };
				const { loginWithCookies } = await this.$graphql.default.request(LOGIN, variables);

				if (loginWithCookies.status == 'SUCCESS') {
					const { cart, viewer, customer } = await this.$graphql.default.request(GET_CART);
					this.$store.commit('updateCart', cart);
					this.$store.commit('updateUser', customer);
					this.$router.push('/');
					this.$cookiz.remove('woo');
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
