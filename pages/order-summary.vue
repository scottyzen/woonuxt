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
                <div class="text-xs text-gray-400 uppercase">Order</div>
                <div>#{{ order.databaseId }}</div>
            </div>
            <div>
                <div class="text-xs text-gray-400 uppercase">Date</div>
                <div>{{ formatDate(order.date) }}</div>
            </div>
            <div>
                <div class="text-xs text-gray-400 uppercase">Status</div>
                <div>{{ order.status }}</div>
            </div>
            <div>
                <div class="text-xs text-gray-400 uppercase">Payment Method</div>
                <div>{{ order.paymentMethodTitle }}</div>
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
                    :src="item.variation ? item.variation.node.image.sourceUrl : item.product.node.image.sourceUrl"
                />
                <div
                    class="flex-1 leading-tight"
                >{{ item.variation ? item.variation.node.name : item.product.node.name }}</div>
                <div class="text-sm text-gray-600">Qty. {{ item.quantity }}</div>
                <span class="font-semibold text-sm">{{ formatPrice(item.total) }}</span>
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
            <hr class="my-8" />
            <div class="flex justify-between">
                <span class>Total</span>
                <span class="font-semibold">{{ order.total }}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    head() {
        return { title: 'Order received' }
    },
    data() {
        return {
            order: this.$route.params.order
        }
    },
    methods: {
        formatDate(date) {
            // Fotmat DD/MM/YY 
            return new Date(date).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            })
        },
        formatPrice(price) {
            price = parseFloat(price);
            return price.toLocaleString('nl-NL', {
                style: 'currency',
                currency: 'EUR'
            });
        }
    },
}
</script>