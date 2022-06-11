<template>
	<a @click="toggleWishlist" class="cursor-pointer flex mt-4 text-sm text-gray-400 gap-2 items-center">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="18" height="18">
			<path d="M352.92 80C288 80 256 144 256 144s-32-64-96.92-64c-52.76 0-94.54 44.14-95.08 96.81-1.1 109.33 86.73 187.08 183 252.42a16 16 0 0018 0c96.26-65.34 184.09-143.09 183-252.42-.54-52.67-42.32-96.81-95.08-96.81z" :fill="isWishlisted ? 'currentColor' : 'none'" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" />
		</svg><span>{{isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}}</span>
	</a>

</template>

<script>
export default {
	props: {
		product: { type: Object, required: true },
	},
	methods: {
		addToWishlist() {
			this.$store.commit('addToWishlist', this.product);
		},
		removeFromWishlist() {
			this.$store.commit('removeFromWishlist', this.product);
		},
		toggleWishlist() {
			this.isWishlisted ? this.removeFromWishlist() : this.addToWishlist();
		},
	},
	computed: {
		isWishlisted() {
			return this.$store.state.wishlist.some(
				(product) => product.databaseId === this.product.databaseId
			);
		},
	},
};
</script>

<style></style>
