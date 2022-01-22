<template>
    <div
        class="w-full p-8 text-gray-800 md:bg-white md:rounded-xl md:mx-auto md:shadow md:my-12 md:max-w-3xl md:p-16"
        v-if="order"
    >
        <h1 class="font-semibold text-xl mb-2">Order received</h1>
        <p class>Thank you for your order. We will send you an email with the order details.</p>

        <hr class="my-8" />

        <div class="flex justify-between">
            <div>
                <div class="text-xs text-gray-400 uppercase">Order number</div>
                <div class="font-semibold">{{ order.databaseId }}</div>
            </div>
            <div>
                <div class="text-xs text-gray-400 uppercase">Date</div>
                <div class="font-semibold">{{ formatDate(order.date) }}</div>
            </div>
            <div>
                <div class="text-xs text-gray-400 uppercase">Status</div>
                <div class="font-semibold">{{ order.status }}</div>
            </div>
            <div>
                <div class="text-xs text-gray-400 uppercase">Payment Method</div>
                <div class="font-semibold">{{ order.paymentMethod }}</div>
            </div>
        </div>

        <hr class="my-8" />

        <div class="grid gap-2">
            <div
                v-for="item in order.lineItems.nodes"
                :key="item.product.databaseId"
                class="flex gap-8 items-center justify-between"
            >
                <NuxtImg
                    class="rounded-xl h-16 w-16"
                    v-if="item.product.image"
                    :src="item.product.image.sourceUrl"
                />
                <div class="flex-1 leading-tight">{{ item.product.name }}</div>
                <div class="text-sm text-gray-600">Qty. {{ item.quantity || 1 }}</div>
                <ProductPrice
                    class="text-sm"
                    :salePrice="item.product.salePrice"
                    :regularPrice="item.product.regularPrice"
                />
            </div>
        </div>

        <hr class="my-8" />

        <div>
            <div class="flex justify-between">
                <span>Subtotal</span>
                <span>{{ order.subtotal }}</span>
            </div>
            <div class="flex justify-between">
                <span>Tax</span>
                <span>{{ order.totalTax }}</span>
            </div>
            <div class="flex justify-between">
                <span>Shipping</span>
                <span>{{ order.shippingTotal }}</span>
            </div>
            <div class="flex justify-between">
                <span class>Total</span>
                <span class="font-semibold">{{ order.total }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import GET_CART from '~/gql/queries/getCart';
export default {
    data() {
        return {
            order: this.$route.params.order
        }
    },
    mounted() {
        this.getCart();
    },
    methods: {
        async getCart() {
            const { cart } = await this.$graphql.default.request(GET_CART);
            this.$store.commit('updateCart', cart);
        },
        formatDate(date) {
            return new Date(date).toLocaleDateString();
        },
    },
}
</script>