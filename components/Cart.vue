<template>
	<section class="bg-white flex flex-col max-w-lg shadow-lg top-0 right-0 bottom-0 w-9/10 fixed overflow-x-hidden">
		<CloseCart class="bg-white rounded-xl shadow-xl p-1.5" />
		<EmptyCart v-if="cart" class="rounded-xl bg-red-400 shadow-xl text-white p-1.5" />

		<div class="mt-8 text-center">Basket</div>

		<TransitionGroup v-if="cart" tag="ul" name="shrink" mode="in-out" class="flex flex-col flex-1 p-8 gap-4 overflow-y-scroll">
			<SwipeCard v-for="item in cart.contents.nodes" :key="item">
				<CartCard :item="item" />
			</SwipeCard>
		</TransitionGroup>

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
.shrink-leave-active {
	transition: transform 300ms;
	position: absolute;
	opacity: 0;
}
.shrink-enter-active {
	transition: opacity 500ms ease-out 250ms, transform 500ms ease-out;
	will-change: opacity, transform;
}
.shrink-enter,
.shrink-leave-to {
	opacity: 0;
	transform: scale(0.75) translateY(25%);
}
</style>