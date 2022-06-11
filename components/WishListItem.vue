<template>
	<li class="flex py-4 gap-6 items-center">
		<SCImg class="rounded-xl h-24 w-24" v-if="product.image" :src="product.image.sourceUrl" :alt="product.image.altText || product.name" :title="product.image.altText || product.name" />
		<div class="flex-1">
			<NuxtLink class="text-lg leading-tight" :to="`/product/${product.slug}`">{{ product.name }}</NuxtLink>
			<ProductPrice class="mt-1 text-xs" :salePrice="product.salePrice" :regularPrice="product.regularPrice" />
		</div>
		<button @click="removeFromWishlist"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="24" height="24">
				<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M368 368L144 144M368 144L144 368" />
			</svg></button>
	</li>
</template>

<script>
export default {
	props: {
		product: {
			type: Object,
			required: true,
		},
	},
	methods: {
		removeFromWishlist() {
			this.$store.commit('removeFromWishlist', this.product);
		},
	},
};
</script>