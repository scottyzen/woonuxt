<template>
	<main class="container container-sm py-4 relative lg:py-12">
		<ProductBackButton :page="$route.params.page" />
		<div class="flex flex-col gap-8 md:flex-row md:justify-between">
			<ProductImageGallery :first-image="product.image.sourceUrl" :main-image="type.image.sourceUrl"
				:gallery="product.galleryImages" />

			<div class="md:max-w-xl md:py-4">
				<div class="flex mb-4 items-center justify-between">
					<div class="flex-1">
						<h1 class="font-semibold text-xl mb-0.5">{{ type.name }}</h1>
						<StarRating :rating="product.averageRating" :count="product.reviewCount" />
					</div>
					<ProductPrice class="text-lg" :salePrice="type.salePrice" :regularPrice="type.regularPrice" />
				</div>

				<div v-html="product.description" class="font-light mb-8"></div>

				<form @submit.prevent="triggerAddToCart">
					<AttributeSelections class="mt-4 mb-8" v-if="product.attributes" :attrs="product.attributes.nodes"
						@attrs-changed="updateSelectedVariations" />
					<div class="flex mt-12 gap-8 items-center">
						<AddToCartButton class="max-w-xs flex-1" :add-to-cart-button-text="addToCartButtonText"
							:disabled="!activeVariation && product.variations" :class="{
								'loading': addToCartState == 'loading',
								'success': addToCartState == 'success'
							}" />
						<QuantityButtons @quantity-change="updateQuantity" :quantity="quantity" :min="1" />
					</div>
				</form>
			</div>
		</div>
		<div class="my-24">
			<div class="font-semibold text-xl mb-4">Related Products</div>
			<ProductRow :products="product.related.nodes" />
		</div>
	</main>
</template>

<script>
import GET_PRODUCT from '~/gql/queries/getProduct'
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
	scrollToTop: true,
	head() {
		return { title: this.product.name }
	},
	data() {
		return {
			imageToShow: 0,
			quantity: 1,
			variation: [],
			activeVariation: null,
			indexOfTypeAny: [],
			attrValues: [],
			showBackButton: false,
			addToCartState: null,
			addToCartButtonText: 'Add to Cart',
		}
	},
	transition(to, from) {
		if (from && from.name === 'products') {
			return 'slide-left'
		}
		if (to.name === 'products') {
			return 'slide-right'
		}
	},
	async asyncData({ $graphql, params }) {
		const variables = { slug: params.slug }
		const { product } = await $graphql.default.request(GET_PRODUCT, variables)
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
			if (!this.product.variations) {
				return
			}

			this.attrValues = variations.map(el => ({ attributeName: el.name, attributeValue: el.value }))
			let cloneArray = JSON.parse(JSON.stringify(variations))
			const activeVariation = this.product.variations.nodes.filter((variation) => {
				// If there is any variation of type ANY set the value to ''
				this.indexOfTypeAny.forEach((index) => (cloneArray[index].value = ''))

				return arraysEqual(formatArray(variation.attributes.nodes), formatArray(cloneArray))
			})

			this.activeVariation = activeVariation[0]
			this.variation = variations

			// Overwrite the selected gallery image if the variation has a featured image
			// if (this.activeVariation && this.activeVariation.image.sourceUrl) {
			// 	this.selectedGalleryImage = null
			// }
		},
		async triggerAddToCart() {
			this.addToCartState = 'loading';
			this.addToCartButtonText = 'Adding to Cart...';
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
				this.addToCartState = 'success';
				this.addToCartButtonText = 'Added to Cart';
				setTimeout(() => {
					this.addToCartState = null
					this.addToCartButtonText = 'Add to Cart';
				}, 2500);

				this.$store.commit('updateCart', addToCart.cart)
			} catch (error) {
				console.error(error)
			}
		},
		// changeGalleryImage(index) {
		// 	this.selectedGalleryImage = this.product.galleryImages.nodes[index].sourceUrl
		// }
	},
	computed: {
		type() {
			return this.activeVariation ? this.activeVariation : this.product
		}
	}
}
</script>

<style>
.gallery-images {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
	gap: 1rem;
}

.gallery-images img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}
</style>