<template>
    <div class="container my-12 text-gray-700">
        <h1 class="font-semibold text-lg mb-8">
            Order Summary
            <span class="font-semibold text-gray-800">#{{ $route.params.id }}</span>
        </h1>
        <div class="grid gap-2" v-if="order">
            <div>
                <span>Order Number:</span>
                <span>{{ order.databaseId }}</span>
            </div>
            <div>
                <span>Order Date:</span>
                <span>{{ order.date }}</span>
            </div>
            <div>
                <span>Order Status:</span>
                <span>{{ order.status }}</span>
            </div>
            <div>
                <span>Order Total:</span>
                <span>{{ order.total }}</span>
            </div>
        </div>
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
            const { order } = await this.$graphql.default.request(GET_ORDER, variables)
            this.order = order
        },
    }
}
</script>