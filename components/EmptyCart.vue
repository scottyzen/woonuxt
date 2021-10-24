<template>
	<TrashIcon class="cursor-pointer top-6 right-8 absolute" @click="EmptyCart" />
</template>

<script>
import EMPTY_CART from '../gql/mutations/EMPTY_CART'
export default {
	methods: {
		async EmptyCart() {
			console.log('empty cart')
			const { emptyCart } = await this.$graphql.default.request(EMPTY_CART)
			console.log(emptyCart)
			this.$store.commit('updateCart', null)
		}
	}
}
</script>
