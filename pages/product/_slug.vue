<template>
	<main class="container py-8">
		<div class="flex flex-col gap-8 md:flex-row md:items-center md:justify-evenly">
			<nuxt-img class="object-contain w-full rounded-2xl md:w-auto" width="500" height="500" :src="type.image.sourceUrl" />

			<div class="max-w-lg">
				<div class="flex items-center justify-between mb-4">
					<div class="flex-1">
						<h1 class="mb-0.5 text-lg ">{{ type.name }}</h1>
						<StarRating :rating="type.averageRating" :count="type.reviewCount" />
					</div>
					<QuantityButtons @quantity-change="updateQuantity" :quantity="quantity" :min="1" />
				</div>

				<div v-html="product.description" class="mb-8 text-sm font-light"></div>

				<form @submit.prevent="triggerAddToCart">
					<AttributeSelections class="mt-4 mb-8" v-if="product.attributes" :attrs="product.attributes.nodes" @attrs-changed="updateSelectedVariations" />
					<div class="flex items-center justify-between gap-2 mt-12">
						<div class="text-lg font-semibold">{{ type.price }}</div>
						<AddToCartButton :disabled="!activeVariation && product.variations" />
					</div>
				</form>

			</div>
		</div>
	</main>
</template>

<script>
import getProduct from '~/gql/queries/getProduct'
import ADD_TO_CART from '~/gql/mutations/ADD_TO_CART'

function arraysEqual(a1, a2) {
	/* WARNING: arrays must not contain {objects} or behavior may be undefined */
	return JSON.stringify(a1) == JSON.stringify(a2)
}

const formatArray = (arr) => {
	return arr.map((v) => {
		let name = v.name.toLowerCase()
		name = name.startsWith('pa_') ? name.replace('pa_', '') : name
		let value = v.value.toLowerCase()
		return { name, value }
	})
}

export default {
	data() {
		return {
			quantity: 1,
			variation: [],
			activeVariation: null,
			indexOfTypeAny: []
		}
	},
	async asyncData({ $graphql, params }) {
		const variables = { slug: params.slug }
		const { product } = await $graphql.default.request(getProduct, variables)
		return { product: product }
	},
	mounted() {
		if (this.product.variations) {
			this.checkForVariationTypeOfAny()
		}
	},
	methods: {
		updateQuantity(quantity) {
			this.quantity = quantity
		},
		checkForVariationTypeOfAny() {
			const numberOfVariation = this.product.variations.nodes[0].attributes.nodes.length

			for (let index = 0; index < numberOfVariation; index++) {
				let tempArray = []
				this.product.variations.nodes.forEach((element) => {
					tempArray.push(element.attributes.nodes[index].value)
				})
				// console.log(tempArray)
				if (!tempArray.some(Boolean)) {
					this.indexOfTypeAny.push(index)
				}
			}
		},
		updateSelectedVariations(variations) {
			const activeVariation = this.product.variations.nodes.filter((variation) => {
				// If there is any variation of type ANY set the value to ''
				this.indexOfTypeAny.forEach((index) => {
					variations[index].value = ''
				})

				return arraysEqual(formatArray(variation.attributes.nodes), formatArray(variations))
			})
			this.activeVariation = activeVariation[0]
			// this.variation = variations
		},
		async triggerAddToCart() {
			// { attributeName: 'size', attributeValue: 'Large' }
			if (this.product.variations) {
				const variationInput = this.activeVariation.attributes.nodes.map((el) => {
					return { attributeName: el.name, attributeValue: el.value }
				})
			}

			const input = {
				productId: this.product.databaseId,
				quantity: this.quantity,
				variationId: this.product.variations ? this.activeVariation.databaseId : null,
				variation: this.product.variations ? variationInpu : null
			}

			const { addToCart } = await this.$graphql.default.request(ADD_TO_CART, { input })
			this.$store.commit('updateCart', addToCart.cart)
		}
	},
	computed: {
		type() {
			return this.activeVariation ? this.activeVariation : this.product
		}
	}
}
</script>

<style lang="postcss">
pre {
	@apply p-4 my-8 text-xs text-white bg-gray-800 rounded;
}
</style>