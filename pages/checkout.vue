<template>
    <div
        class="container flex flex-wrap my-12 gap-8 justify-evenly items-start md:flex-row-reverse"
    >
        <div
            class="bg-white border-b rounded-2xl shadow-sm w-full p-6 top-20 text-gray-700 md:max-w-sm md:sticky"
        >
            <h2 class="font-semibold mb-4">Order Summary</h2>
            <div v-if="cart">
                <div class="flex justify-between">
                    <span class="text-gray-600">Subtotal</span>
                    <span class="font-semibold">{{ cart.subtotal }}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600">Tax</span>
                    <span class="font-semibold">{{ cart.totalTax }}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600">Shipping</span>
                    <span class="font-semibold">{{ cart.shippingTotal }}</span>
                </div>
                <hr class="my-4" />
                <div class="flex justify-between">
                    <span class="text-gray-600">Total</span>
                    <span class="font-semibold">{{ cart.total }}</span>
                </div>
            </div>
        </div>

        <form @submit.prevent="pay" class="w-full max-w-3xl grid gap-4 checkout-form md:flex-1">
            <h2 class="text-xl w-full">Billing Details</h2>

            <BillingDetails :billing="billing" />

            <div>
                <label class="flex justify-between" for>
                    Credit Card
                    <span
                        class="text-sm text-orange-400 capitalize"
                    >Test mode: 4242 4242 4242 4242</span>
                </label>
                <StripeElements
                    v-if="loadStripe"
                    class="w-full"
                    :stripe-key="$config.stripePublishableKey"
                    :instance-options="{}"
                    :elements-options="{}"
                    #default="{ elements }"
                    ref="elms"
                >
                    <StripeElement
                        type="card"
                        :elements="elements"
                        :options="cardOptions"
                        ref="card"
                    />
                </StripeElements>
            </div>

            <button
                type="submit"
                class="bg-primary rounded-2xl shadow-md my-4 text-white text-lg text-center mb-8 p-3 block justify-evenly hover:bg-primary-dark"
            >{{ buttonText }}</button>
        </form>
    </div>
</template>

<script>
import { StripeElements, StripeElement } from 'vue-stripe-elements-plus'
import CHECKOUT from '~/gql/mutations/checkout';
import GET_CART from '~/gql/queries/getCart';

export default {
    data() {
        return {
            loadStripe: false,
            buttonText: 'Place Order',
            billing: {
                country: 'IE',
            },
            cardOptions: {
                hidePostalCode: true,
                style: {
                    base: {
                        color: '#1F2937',
                        fontSize: '16px',
                        lineHeight: '20px',
                    }
                },
            }
        }
    },
    components: {
        StripeElements,
        StripeElement
    },
    head() {
        return {
            script: [{ src: 'https://js.stripe.com/v3/' }]
        }
    },
    methods: {
        pay() {
            this.buttonText = 'Processing...';
            // ref in template
            const groupComponent = this.$refs.elms
            const cardComponent = this.$refs.card
            // Get stripe element
            const cardElement = cardComponent.stripeElement

            groupComponent.instance.createSource(cardElement).then(result => {
                this.checkout(result.source.id)
            })

        },
        async checkout(sourceId) {
            try {
                const variables = {
                    billing: this.billing,
                    metaData: [{ key: "_stripe_source_id", value: sourceId }],
                }
                const { checkout } = await this.$graphql.default.request(CHECKOUT, variables)
                if (checkout.result == 'success') {
                    this.buttonText = 'Order Successfull';
                    const { cart, viewer, customer } = await this.$graphql.default.request(GET_CART);
                    this.$store.commit('updateCart', cart);
                    if (cart) {
                        this.$router.push('/order/' + checkout.order.databaseId)
                    }
                } else {
                    this.buttonText = 'Place Order';
                }
            } catch (error) {
                console.log(error);
            }
        }
    },
    computed: {
        cart() {
            return this.$store.state.cart
        },
    },
    mounted() {
        setTimeout(() => {
            this.loadStripe = true
        }, 300);
    }
}
</script>

<style lang="postcss">
.checkout-form input,
.checkout-form textarea,
.checkout-form .StripeElement,
.checkout-form select {
    @apply bg-white border rounded-xl outline-none w-full p-3 block;
}
label {
    @apply text-xs mb-1 text-gray-600 inline-block uppercase block;
}
</style>