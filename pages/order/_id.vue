<template>
	<div class="container my-4">
		<h1 class="font-semibold text-xl mb-8">Order #{{$route.params.id}}</h1>
		<pre>{{order}}</pre>
	</div>
</template>

<script>
import GET_ORDER from '~/gql/queries/getOrder';
export default {
	head() {
		return { title: 'Order #{{$route.params.id}}' };
	},
	data() {
		return {
			order: null,
		};
	},
	mounted() {
		this.getOrder();
	},
	methods: {
		async getOrder() {
			const { order } = await this.$graphql.default.request(GET_ORDER, {
				id: this.$route.params.id,
			});
			this.order = order;
		},
	},
};
</script>

<style>
</style>