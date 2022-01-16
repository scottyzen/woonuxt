<template>
	<NuxtLink :to="{ name: 'product-slug', params: { slug: node.slug, page: page } }" class="relative">
		<span
			v-if="node.onSale"
			class="rounded-md bg-yellow-300 text-xs tracking-tight px-1.5 top-2 right-2 text-yellow-700 leading-5 z-10 absolute"
		>SALE</span>

		<NuxtImg
			v-if="node.image"
			class="product-image"
			:src="node.image.sourceUrl"
			:alt="node.name"
			:title="node.name"
			fit="inside"
			width="136"
			height="136"
			sizes="xs:128px sm:296px md:325px xl:400px"
			:loading="index === 0 ? 'eager' : 'lazy'"
			quality="90"
			format="webp"
		/>

		<div class="p-2">
			<StarRating :rating="node.averageRating" :count="node.reviewCount" />
			<h2 class="font-light mb-2 leading-tight">{{ node.name }}</h2>
			<ProductPrice class="text-sm" :salePrice="node.salePrice" :regularPrice="node.regularPrice" />
		</div>
	</NuxtLink>
</template>

<script>
export default {
	props: {
		node: { type: Object, default: null },
		index: { type: Number, default: 1 },
		page: { type: Number, default: 1 }
	}
}
</script>

<style lang="postcss">
img.product-image {
	@apply rounded-xl object-top object-cover w-full aspect-square;
	aspect-ratio: 1/1.125;
}
</style>