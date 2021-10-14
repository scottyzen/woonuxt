<template>
	<main class="container py-12">
		<div class="flex flex-wrap">
			<nuxt-img class="object-cover rounded" width="400" height="400" fit="cover" :src="product.image.sourceUrl" />
			<div class="p-12">
				<h1 class="mb-1 text-xl ">{{ product.name }}</h1>
				<div class="">{{ product.price }}</div>
				<AttributeSelections v-if="product.localAttributes" :attrs="product.localAttributes.nodes" @attrs-changed="updateSelectedVariations" />
				<AddToCartButton :productId="product.databaseId" :quantity="quantity" :variation="variation" />
				<QuantityButtons @quantity-change="updateQuantity" :quantity="quantity" :min="1" />
				<!-- 
				<pre class="p-4 my-8 text-sm text-white bg-gray-800 rounded">
					{{product.localAttributes.nodes}}
				</pre> -->

			</div>
		</div>
	</main>
</template>

<script>
import getProduct from '~/gql/queries/getProduct'
export default {
	data() {
		return {
			quantity: 1,
			variation: []
		}
	},
	async asyncData({ $graphql, params }) {
		const variables = { slug: params.slug }
		const { product } = await $graphql.default.request(getProduct, variables)
		return { product }
	},
	methods: {
		updateQuantity(quantity) {
			this.quantity = quantity
		},
		updateSelectedVariations(variations) {
			this.variation = variations
		}
	}
}
</script>
