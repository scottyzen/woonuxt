<template>
	<li class="flex items-center gap-4">
		<NuxtImg class="w-16 h-16 rounded-xl" v-if="item[productType].node.image" :src="item[productType].node.image.sourceUrl" />
		<div class="flex-1">
			<div>{{item[productType].node.name}}</div>
			<div class="text-sm font-semibold">{{item[productType].node.price}}</div>
		</div>
		<QuantityButtons :quantity="item.quantity" />
	</li>
</template>

<script>
export default {
	props: ['item'],
	computed: {
		productType() {
			return this.item.product.node.type == 'SIMPLE' ? 'product' : 'variation'
		}
	}
}
</script>