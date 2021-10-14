<template>
	<li class="flex items-center gap-4">
		<NuxtImg class="w-16 h-16 rounded-xl" v-if="item[productType].node.image" :src="item[productType].node.image.sourceUrl" />
		<div class="flex-1">
			<div>{{item[productType].node.name}}</div>
			<div class="text-sm font-semibold">{{item[productType].node.price}}</div>
		</div>
		<QuantityButtons :quantity="quantity" @quantity-change="updateQuantity" />
	</li>
</template>

<script>
import updateCartQuantity from '~/gql/mutations/updateCartQuantity'
export default {
	data() {
		return {
			isLoading: false
		}
	},
	props: ['item'],
	methods: {
		async updateQuantity(quantity) {
			const { updateItemQuantities } = await this.$graphql.default.request(updateCartQuantity, {
				key: this.item.key,
				quantity
			})
			this.$store.commit('updateCart', updateItemQuantities.cart)
		}
	},
	computed: {
		productType() {
			return this.item.variation ? 'variation' : 'product'
		},
		quantity() {
			return this.item.quantity
		}
	}
}
</script>