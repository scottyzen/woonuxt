<template>
	<li class="flex items-center gap-4">

		<NuxtImg class="w-16 h-16 rounded-xl" v-if="productType.image" :src="productType.image.sourceUrl" />
		<div class="flex-1">
			<div class="leading-tight">{{productType.name}}</div>
			<div class="text-xs font-semibold">{{productType.price}}</div>
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
			return this.item.product.node.type == 'VARIABLE' ? this.item.variation.node : this.item.product.node
		},
		quantity() {
			return this.item.quantity
		},
		product() {
			return this.item.variation ? this.item.variation : this.item.product
		}
	}
}
</script>