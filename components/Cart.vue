<template>
	<section class="fixed top-0 bottom-0 right-0 flex flex-col max-w-lg bg-white shadow-lg w-9/10">
		<CloseCart class="p-1.5 bg-white shadow-xl rounded-xl" />
		<EmptyCart v-if="cart" class="p-1.5 bg-red-400 text-white shadow-xl rounded-xl" />

		<div class="mt-8 text-center">Basket</div>

		<ul v-if="cart" class="flex flex-col flex-1 gap-4 p-8 overflow-y-scroll">
			<CartCard v-for="item in cart.contents.nodes" :key="item.databaseId" :item="item" />
		</ul>

		<div class="flex flex-col items-center justify-center flex-1 mb-12" @click="closeCart">
			<div class="mb-20 text-xl text-gray-300">Cart is empty</div>
			<nuxt-link class="p-2 text-white bg-purple-500 rounded-2xl min-w-[180px] text-center" to="/products">Continue Shopping</nuxt-link>
		</div>

		<div v-if="cart" class="p-8">
			<nuxt-link class="block p-3 text-lg text-center bg-white shadow-md justify-evenly rounded-2xl hover:(bg-purple-500 text-white)" to="/">
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
			return this.$store.state.cart
		}
	},
	methods: {
		closeCart() {
			this.$store.commit('toggleCart', false)
		}
	}
}
</script>


<style scoped>
section {
	background: linear-gradient(#fff, #ececf1);
}
</style>