<template>
	<NuxtLink :to="{ name: 'product-slug', params: { slug: node.slug, page: page } }" class="relative">
		<span
			v-if="node.onSale"
			class="border rounded-md bg-yellow-200 border-yellow-300 text-xs tracking-tight px-1.5 top-2 right-2 text-orange-800 leading-5 z-10 absolute"
		>SALE</span>

		<NuxtImg
			v-if="node.image"
			class="product-image"
			:src="node.image.sourceUrl"
			:alt="node.name"
			:title="node.name"
			fit="inside"
			width="120"
			height="120"
			sizes="sm:120px sm:300px"
			:loading="(index <= 1 || index == 5) ? 'eager' : 'lazy'"
			:preload="(index <= 1) ? true : false"
			quality="100"
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