<template>
	<div class="container flex min-h-[300px] text-2xl items-center justify-center">
		<LoadingIcon v-if="hasLoggedOut == null" />
		<h2 v-if="hasLoggedOut == true">You have been successfully logged out.</h2>
		<h2 v-if="hasLoggedOut == false">Something went wrong. Please try again</h2>
	</div>
</template>

<script>
import { gql } from 'nuxt-graphql-request';

export default {
	data() {
		return {
			hasLoggedOut: null,
		};
	},
	methods: {
		async logOut() {
			const query = gql`
				mutation Logout {
					logout(input: { clientMutationId: "kjnasljxnaslk" }) {
						status
					}
				}
			`;
			const { logout } = await this.$graphql.default.request(query);
			this.hasLoggedOut = logout.status == 'SUCCESS' ? true : false;

			if (this.hasLoggedOut) {
				this.$store.commit('updateUser', undefined);
				this.$store.commit('updateCart', null);
				this.deleteAllCookies();
				setTimeout(() => {
					this.$router.push('/login');
				}, 500);
			}
		},
		deleteAllCookies() {
			if (process.client) {
				const cookies = document.cookie.split(';');
				for (const cookie of cookies) {
					const eqPos = cookie.indexOf('=');
					const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
					document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
				}
			}
		},
	},
	mounted() {
		this.logOut();
	},
};
</script>
