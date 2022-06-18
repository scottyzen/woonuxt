<template>
	<span v-if="node.salePrice" class="rounded-md bg-red-400 text-xs text-white tracking-tight px-1.5 leading-6 z-10">{{salePercentage}} %</span>
</template>

<script>
export default {
	props: {
		node: { type: Object, default: null },
	},
	computed: {
		salePercentage: function () {
			const salePrice = parseFloat(this.node.salePrice.replace(/[^0-9]/g, ''));
			const regularPrice = parseFloat(
				this.node.regularPrice.replace(/[^0-9]/g, '')
			);
			return Math.round(((salePrice - regularPrice) / regularPrice) * 100);
		},
	},
};
</script>