<template>
	<div class="container my-4">
		<h1 class="font-semibold text-xl mb-8">News</h1>
		<div class="mb-8 grid gap-2">
			<SwipeCard>Scott</SwipeCard>
			<SwipeCard>Ciara</SwipeCard>
			<SwipeCard>Adam</SwipeCard>
			<SwipeCard>Tadgh</SwipeCard>
		</div>

		<pre class="rounded bg-gray-800 text-white p-4 text-[10px] whitespace-pre-wrap">
			{{cart}}
			{{viewer}}
		</pre>
	</div>
</template>

<script>
import getCart from '~/gql/queries/getCart';

export default {
	data() {
		return {
			cart: null,
			viewer: null,
		};
	},
	methods: {
		async onClient() {
			try {
				const { cart, viewer } = await this.$graphql.default.request(getCart);
				console.log({ cart }, { viewer });
				this.cart = cart;
				this.viewer = viewer;
			} catch (error) {
				console.error(JSON.stringify(error, undefined, 2));
			}
		},
	},
	mounted() {
		this.onClient();
	},
};
</script>

