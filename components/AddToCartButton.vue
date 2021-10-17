<template>
	<button type="submit" class="p-2 text-white bg-purple-500 rounded-2xl min-w-[150px] text-center" :class="{'disabled': disabled}" :disabled="disabled">Add to Cart</button>
</template>

<script>
// import ADD_TO_CART from '~/gql/mutations/ADD_TO_CART'

export default {
	props: ['productId', 'quantity', 'variation', 'disabled']
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
button.disabled {
	@apply bg-gray-400 cursor-not-allowed;
}
</style>