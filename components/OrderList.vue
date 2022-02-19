<template>
	<div>
		<table v-if="orders" class="text-left w-full table-auto">
			<thead>
				<tr>
					<th>Order Number</th>
					<th>Order Date</th>
					<th>Order Status</th>
					<th>Total</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="order in orders.nodes" :key="order.orderNumber">
					<td>{{ order.orderNumber }}</td>
					<td>{{ formatDate(order.date) }}</td>
					<td>{{ order.status }}</td>
					<td>{{ order.total }}</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
import GET_ORDERS from '~/gql/queries/getOrders.gql';
export default {
	data() {
		return {
			orders: null,
			loading: false,
			error: null,
		};
	},
	methods: {
		async getOrders() {
			try {
				this.loading = true;
				const { customer } = await this.$graphql.default.request(GET_ORDERS);
				this.orders = customer.orders;
				this.loading = false;
			} catch (error) {
				this.error = error;
				this.loading = false;
			}
		},
		formatDate(date) {
			return new Date(date).toLocaleDateString();
		},
	},
	mounted() {
		this.getOrders();
	},
};
</script>

<style lang="postcss" scoped>
tbody tr:nth-child(odd) {
	background-color: #fafafa;
	@apply rounded-lg;
}
td,
th {
	@apply py-2 px-3;
}
</style>