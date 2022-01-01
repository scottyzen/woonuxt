<template>
	<section
		class="bg-white flex flex-col max-w-lg shadow-lg top-0 right-0 bottom-0 w-9/10 fixed overflow-x-hidden"
		v-if="cart"
	>
		<CloseCart class="bg-white rounded-xl shadow-xl p-1.5" />
		<EmptyCart v-if="!cart.isEmpty" class="rounded-xl bg-red-400 shadow-xl text-white p-1.5" />

		<div class="mt-8 text-center">Basket</div>

		<template v-if="!cart.isEmpty">
			<ul class="flex flex-col flex-1 p-8 gap-4 overflow-y-scroll">
				<SwipeCard
					v-for="item in cart.contents.nodes"
					:key="item.key"
					:item="item"
					@has-swiped="removeItemFromCart(item.key)"
				>
					<CartCard :item="item" />
				</SwipeCard>
			</ul>
			<div class="p-8">
				<nuxt-link
					class="bg-white rounded-2xl shadow-md text-lg text-center p-3 block justify-evenly hover:(bg-purple-500 text-white) "
					to="/"
				>
					<span class="mx-2">Checkout</span>
					<span>{{ cart.total }}</span>
				</nuxt-link>
			</div>
		</template>

		<!-- Empty Cart Message -->
		<div v-else class="flex flex-col flex-1 mb-12 items-center justify-center">
			<div class="text-xl mb-20 text-gray-300">Cart is empty</div>
		</div>
	</section>
</template>

<script>
import UPDATE_CART_QUANTITY from '~/gql/mutations/updateCartQuantity';
export default {
	methods: {
		closeCart() {
			this.$store.commit('toggleCart', false);
		},
		async removeItemFromCart(key) {
			const { updateItemQuantities } = await this.$graphql.default.request(
				UPDATE_CART_QUANTITY,
				{ key, quantity: 0 }
			);
			this.$store.commit('updateCart', updateItemQuantities.cart);
		},
	},
	computed: {
		cart() {
			return this.$store.state.cart;
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