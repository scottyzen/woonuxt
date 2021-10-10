<template>
	<nuxt-link class="text-center" :to="`/product/${node.slug}`">
		<nuxt-picture class="w-full mb-2" :src="node.image.sourceUrl" :alt="node.name" :title="node.name" fit="cover" width="136" height="136" sizes="xs:128px sm:296px md:325px xl:400px" :loading="index == 0 ? 'eager': 'lazy'" quality="90" format="webp" />
		<div class="p-2">
			<div class="text-sm">{{ node.name }}</div>
			<strong>{{ node.price }}</strong>
			<div class="flex justify-center">
				<Stars :number="node.averageRating" />
			</div>
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

<style >
picture.w-full img {
	width: 100%;
}
</style>