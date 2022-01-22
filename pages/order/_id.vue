<template>
    <div class="container my-12 text-gray-800">
        <h1 class="font-semibold text-lg mb-8">Order Summary</h1>
        <table v-if="order" class="divide-y rounded-lg min-w-full overflow-hidden">
            <tbody class="divide-y divide-gray-100">
                <tr>
                    <td class="py-3 whitespace-nowrap">Number</td>
                    <td class="py-3 whitespace-nowrap">{{ order.databaseId }}</td>
                </tr>
                <tr>
                    <td class="py-3 whitespace-nowrap">Date</td>
                    <td class="py-3 whitespace-nowrap">{{ order.date }}</td>
                </tr>
                <tr>
                    <td class="py-3 whitespace-nowrap">Status</td>
                    <td class="py-3 whitespace-nowrap">{{ order.status }}</td>
                </tr>
                <tr>
                    <td class="py-3 whitespace-nowrap">Total</td>
                    <td class="py-3 whitespace-nowrap">{{ order.total }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import GET_ORDER from '~/gql/queries/getOrder'
export default {
    data() {
        return {
            order: null
        }
    },
    mounted() {
        this.getOrder()
    },
    methods: {
        async getOrder() {
            const variables = { id: this.$route.params.id }
            const { order, customer } = await this.$graphql.default.request(GET_ORDER, variables)
            const foundOrder = customer.orders.nodes.find(order => order.databaseId === this.$route.params.id)
            this.order = order ? order : foundOrder
        },
    },
}
</script>