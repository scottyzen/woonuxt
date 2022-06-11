<template>
	<li class="flex gap-4 items-center">
		<SCImg class="rounded-xl h-16 w-16" v-if="productType.image" :src="productType.image.sourceUrl" :alt="productType.image.altText || productType.name" :title="productType.image.altText || productType.name" />
		<div class="flex-1">
			<div class="leading-tight">{{ productType.name }}</div>
			<ProductPrice class="mt-1 text-xs" :salePrice="productType.salePrice" :regularPrice="productType.regularPrice" />
		</div>
		<QuantityButtons :quantity="quantity" @quantity-change="updateQuantity" />
	</li>
</template>

<script>
import updateCartQuantity from '~/gql/mutations/updateCartQuantity';
export default {
	data() {
		return {
			isLoading: false,
		};
	},
	props: ['item'],
	methods: {
		async updateQuantity(quantity) {
			const { updateItemQuantities } = await this.$graphql.default.request(
				updateCartQuantity,
				{
					key: this.item.key,
					quantity,
				}
			);
			this.$store.commit('updateCart', updateItemQuantities.cart);
		},
	},
	computed: {
		productType() {
			return this.item.product.node.type == 'VARIABLE'
				? this.item.variation.node
				: this.item.product.node;
		},
		quantity() {
			return this.item.quantity;
		},
		product() {
			return this.item.variation ? this.item.variation : this.item.product;
		},
	},
};
</script>