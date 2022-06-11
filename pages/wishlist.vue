<template>
	<div class="mx-auto my-4 w-full max-w-3xl">
		<!-- <pre>{{wishlist}}</pre> -->
		<ul v-if="wishlist.length" class="divide-y divide-gray-100 my-8 grid">
			<WishListItem v-for="product in wishlist" :key="product.databaseId" :product="product" />
		</ul>
		<div v-else class="flex text-center min-h-96 text-gray-500 items-center justify-center">
			<p>You have no items in your wishlist.</p>
		</div>
	</div>
</template>

<script>
export default {
	head() {
		return { title: 'FAQ' };
	},
	computed: {
		wishlist() {
			return this.$store.state.wishlist;
		},
	},
};
</script>