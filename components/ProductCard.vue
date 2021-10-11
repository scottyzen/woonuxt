<template>
	<nuxt-link :to="`/product/${node.slug}`" class="relative ">

		<span v-if="node.onSale" class="absolute z-10 px-1.5 text-xs leading-5 text-yellow-700 bg-yellow-300 tracking-tight  rounded-md top-2 right-2">SALE</span>

		<nuxt-picture class="w-full mb-2" :src="node.image.sourceUrl" :alt="node.name" :title="node.name" fit="cover" width="136" height="136" sizes="xs:128px sm:296px md:325px xl:400px" :loading="index == 0 ? 'eager': 'lazy'" quality="90" format="webp" />

		<div class="p-2">
			<StarRating :rating="node.averageRating" :count="node.reviewCount" />
			<h2 class="mb-2 font-light leading-tight">{{ node.name }}</h2>
			<div class="text-sm font-semibold">{{ node.price }}</div>
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
	@apply w-full rounded-xl;
}
</style>