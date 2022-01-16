<template>
	<button
		type="submit"
		class="p-2 text-white bg-purple-500 rounded-2xl min-w-[150px] text-center flex items-center justify-center gap-4 focus:outline-none"
		:class="{ 'disabled': disabled }"
		:disabled="disabled"
	>
		<span>{{ addToCartButtonText }}</span>
		<span class="icon"></span>
	</button>
</template>

<script>
// import ADD_TO_CART from '~/gql/mutations/ADD_TO_CART'

export default {
	props: ['addToCartButtonText', 'disabled']
	// methods: {
	// 	async triggerAddToCart() {
	// 		const input = {
	// 			productId: this.productId,
	// 			quantity: this.quantity,
	// 			variation: this.variation
	// 		}
	// 		const { addToCart } = await this.$graphql.default.request(ADD_TO_CART, { input })
	// 		this.$store.commit('updateCart', addToCart.cart)
	// 	}
	// }
}

// variation: [
//     { attributeName: 'pa_color', attributeValue: 'Green' },
//     { attributeName: 'logo', attributeValue: 'No' },
//     { attributeName: 'size', attributeValue: 'Large' }
// ]
</script>

<style lang="postcss">
button {
	outline: none !important;
	transition: all 150ms ease-in;
}
button.disabled {
	@apply bg-gray-400 cursor-not-allowed;
}
button .icon {
	display: inline-block;
	width: 6px;
	height: 12px;
	transform: rotate(0) scale(0);
	transition: none;
	max-width: 0;
}
button.loading .icon {
	@apply animate-spin inline-block rounded-full;
	border: 2px solid #fff;
	border-top: 2px solid transparent;
	width: 12px;
	height: 12px;
	transition: all 150ms ease-in;
	/* animation: spin 600ms infinite forwards linear; */
	transform: scale(1);
	max-width: 100px;
	will-change: transform;
}
button.success {
	@apply bg-green-500;
}
button.success .icon {
	display: inline-block;
	border-bottom: 2px solid #fff;
	border-right: 2px solid #fff;
	transform: rotate(45deg) scale(1);
	transition: all 150ms ease-in;
	max-width: 100px;
}
@keyframes spin {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}
</style>