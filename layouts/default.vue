<template>
	<div>
		<Header />
		<transition name="slide">
			<Cart v-if="showCart" class="z-50" />
		</transition>
		<transition name="page" mode="out-in">
			<Nuxt />
		</transition>
		<transition name="page">
			<div v-if="showCart" class="bg-black opacity-25 inset-0 z-40 fixed" @click="closeCart"></div>
		</transition>
		<Footer />
	</div>
</template>

<script>
import getCart from '~/gql/queries/getCart';
export default {
	computed: {
		showCart() {
			return this.$store.state.showCart;
		},
	},
	methods: {
		closeCart() {
			this.$store.commit('toggleCart', false);
		},
		async getCart() {
			try {
				const { cart, viewer } = await this.$graphql.default.request(getCart);
				console.log(cart, viewer);
				this.$store.commit('updateCart', cart);
				this.$store.commit('updateUser', viewer);
			} catch (error) {
				console.log(error);
			}
		},
	},
	mounted() {
		this.getCart();
	},
};
</script>

<style lang="postcss">
.page-enter-active,
.page-leave-active {
	transition: opacity 300ms ease-in-out;
}
.page-enter,
.page-leave-active {
	opacity: 0;
}
html,
body {
	@apply bg-gray-50 text-gray-900;
	scroll-behavior: smooth;
}

.container {
	max-width: 1440px;
}

/* Enter and leave animations can use different */
/* durations and timing functions.              */
.slide-leave-active,
.slide-enter-active {
	transition: transform 400ms ease-in-out;
}
.slide-enter,
.slide-leave-to {
	transform: translateX(500px);
}

.big-button {
	@apply rounded font-semibold text-sm leading-tight py-3 inline-flex justify-center items-center uppercase;
	box-shadow: 0 2px 0 #025e47, inset 0 0 8px rgb(255 210 0 / 10%),
		inset 0 1px 0 #37ff91, inset 0 -1px 0 #06c465;
	background: linear-gradient(to bottom, #37ff91 0%, #06c465 100%) no-repeat 0,
		linear-gradient(to bottom, #37ff91 0%, #06c465 100%) no-repeat 100%,
		#06994f linear-gradient(to bottom, #25ca85 0%, #057a40 100%) no-repeat;
	background-size: 1px 100%, 1px 100%, cover;
	color: #f9f5e1;
	text-shadow: 0 -1px rgb(0 71 0 / 30%);
	min-width: 200px;
}
</style>
