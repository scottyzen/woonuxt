<template>
	<main class="container py-4">
		<div class="flex flex-col gap-8 md:flex-row md:items-center md:justify-evenly">
			<div class="-mx-4">
				<nuxt-img
					class="object-contain rounded-2xl w-full md:w-auto"
					width="500"
					height="500"
					:src="type.image.sourceUrl"
				/>
			</div>

			<div class="max-w-lg">
				<div class="flex mb-4 items-center justify-between">
					<div class="flex-1">
						<h1 class="text-lg mb-0.5">{{ type.name }}</h1>
						<StarRating :rating="product.averageRating" :count="product.reviewCount" />
					</div>
					<QuantityButtons @quantity-change="updateQuantity" :quantity="quantity" :min="1" />
				</div>

				<div v-html="product.description" class="font-light text-sm mb-8"></div>

				<form @submit.prevent="triggerAddToCart">
					<AttributeSelections
						class="mt-4 mb-8"
						v-if="product.attributes"
						:attrs="product.attributes.nodes"
						@attrs-changed="updateSelectedVariations"
					/>
					<div class="flex mt-12 gap-2 items-center justify-between">
						<ProductPrice class="text-lg" :salePrice="type.salePrice" :regularPrice="type.regularPrice" />
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
			indexOfTypeAny: [],
			attrValues: []
		}
	},
	transition(to, from) {
		return to.name === 'products' ? 'slide-right' : 'slide-left'
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
			this.attrValues = variations.map((el) => {
				return { attributeName: el.name, attributeValue: el.value }
			})
			let cloneArray = JSON.parse(JSON.stringify(variations))

			const activeVariation = this.product.variations.nodes.filter((variation) => {
				// If there is any variation of type ANY set the value to ''
				this.indexOfTypeAny.forEach((index) => (cloneArray[index].value = ''))

				return arraysEqual(formatArray(variation.attributes.nodes), formatArray(cloneArray))
			})
			this.activeVariation = activeVariation[0]
			// this.variation = variations
		},
		async triggerAddToCart() {
			// { attributeName: 'size', attributeValue: 'Large' }
			const variationInput = this.activeVariation ? this.attrValues : null

			const input = {
				productId: this.product.databaseId,
				quantity: this.quantity,
				variationId: this.product.variations ? this.activeVariation.databaseId : null,
				variation: variationInput
			}

			try {
				const { addToCart } = await this.$graphql.default.request(ADD_TO_CART, { input })
				this.$store.commit('updateCart', addToCart.cart)
			} catch (error) {
				console.error(error)
			}
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
	@apply rounded bg-gray-800 my-8 text-xs text-white p-4;
}
</style>