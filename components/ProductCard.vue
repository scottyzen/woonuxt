<template>
	<nuxt-link :to="`/product/${node.slug}`" class="relative">
		<span
			v-if="node.onSale"
			class="rounded-md bg-yellow-300 text-xs tracking-tight px-1.5 top-2 right-2 text-yellow-700 leading-5 z-10 absolute"
		>SALE</span>

		<nuxt-picture
			v-if="node.image"
			class="mb-2 w-full"
			:src="node.image.sourceUrl"
			:alt="node.name"
			:title="node.name"
			fit="cover"
			width="136"
			height="136"
			sizes="xs:128px sm:296px md:325px xl:400px"
			:loading="index == 0 ? 'eager' : 'lazy'"
			quality="90"
			format="webp"
		/>

		<div class="p-2">
			<StarRating :rating="node.averageRating" :count="node.reviewCount" />
			<h2 class="font-light mb-2 leading-tight">{{ node.name }}</h2>
			<ProductPrice class="text-sm" :salePrice="node.salePrice" :regularPrice="node.regularPrice" />
		</div>
	</nuxt-link>
</template>

<script>
export default {
	props: {
		node: {
			type: Object,
			default: null
		},
		index: {
			type: Number,
			default: 1
		}
	}
}
</script>

<style lang="postcss">
picture.w-full img {
	@apply rounded-xl w-full;
}
</style>