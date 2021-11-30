<template>
	<section class="bg-white flex flex-col max-w-lg shadow-lg top-0 right-0 bottom-0 w-9/10 fixed overflow-x-hidden">
		<CloseCart class="bg-white rounded-xl shadow-xl p-1.5" />
		<EmptyCart v-if="cart" class="rounded-xl bg-red-400 shadow-xl text-white p-1.5" />

		<div class="mt-8 text-center">Basket</div>

		<ul v-if="cart" class="flex flex-col flex-1 p-8 gap-4 overflow-y-scroll">
			<SwipeCard v-for="item in cart.contents.nodes" :key="item.key" :item="item" @has-swiped="removeItemFromCart(item.key)">
				<CartCard :item="item" />
			</SwipeCard>
		</ul>

		<div v-else class="flex flex-col flex-1 mb-12 items-center justify-center" @click="closeCart">
			<div class="text-xl mb-20 text-gray-300">Cart is empty</div>
			<nuxt-link class="bg-purple-500 rounded-2xl text-white text-center min-w-[180px] p-2" to="/products">Continue Shopping</nuxt-link>
		</div>

		<div v-if="cart" class="p-8">
			<nuxt-link class="bg-white rounded-2xl shadow-md text-lg text-center p-3 block justify-evenly hover:(bg-purple-500 text-white) " to="/">
				<span class="mx-2">Checkout</span>
				<span>{{cart.total}}</span>
			</nuxt-link>
		</div>

	</section>
</template>

<script>
import UPDATE_CART_QUANTITY from '~/gql/mutations/updateCartQuantity';
export default {
	computed: {
		cart() {
			return this.$store.state.cart;
		},
	},
	methods: {
		closeCart() {
			this.$store.commit('toggleCart', false);
		},
		async removeItemFromCart(key) {
			console.log('removeItemFromCart', key);
			const { updateItemQuantities } = await this.$graphql.default.request(
				UPDATE_CART_QUANTITY,
				{ key, quantity: 0 }
			);
			this.$store.commit('updateCart', updateItemQuantities.cart);
		},
	},
};
</script>


<style scoped>
section {
	background: linear-gradient(#fff, #ececf1);
}
.shrink-move {
	transition: all 500ms;
}
</style>