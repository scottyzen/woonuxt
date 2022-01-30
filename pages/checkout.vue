<template>
    <div
        class="container flex flex-wrap my-12 gap-8 justify-evenly items-start md:flex-row-reverse lg:gap-12"
    >
        <div
            class="bg-white border-b rounded-2xl shadow-sm w-full p-6 top-20 text-gray-700 md:max-w-sm md:mt-16 md:sticky"
        >
            <h2 class="font-semibold mb-4">Order Summary</h2>
            <div v-if="cart" class>
                <div class="flex justify-between">
                    <span class="text-gray-600">Subtotal</span>
                    <span>{{ cart.subtotal }}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600">Tax</span>
                    <span>{{ cart.totalTax }}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600">Shipping</span>
                    <span>{{ cart.shippingTotal }}</span>
                </div>
                <hr class="my-4" />
                <div class="flex justify-between">
                    <span class="text-gray-600">Total</span>
                    <span class="font-semibold">{{ cart.total }}</span>
                </div>
            </div>
        </div>

        <form @submit.prevent="pay" class="w-full max-w-3xl grid gap-4 checkout-form md:flex-1">
            <h2 class="text-xl mb-2 w-full">Billing Details</h2>

            <BillingDetails :billing="billing" @update-billing="updateBilling" />

            <!-- Pay methods -->
            <div class="mt-2 col-span-full">
                <div class="flex gap-4">
                    <div class="flex gap-1">
                        <input
                            type="radio"
                            name="paymentMethod"
                            id="cc"
                            value="stripe"
                            v-model="paymentMethod"
                        />
                        <label for="cc">Credit or Debit Card</label>
                    </div>
                    <div class="flex gap-1">
                        <input
                            type="radio"
                            name="paymentMethod"
                            id="cod"
                            value="cod"
                            v-model="paymentMethod"
                        />
                        <label for="cod">Cash on Delivery</label>
                    </div>
                </div>

                <div v-if="paymentMethod == 'stripe'">
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
                    <span
                        class="mt-1 text-sm text-right text-orange-400 capitalize block"
                    >Test mode: 4242 4242 4242 4242</span>
                </div>
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

export default {
    head() {
        return { title: 'Checkout' }
    },
    data() {
        return {
            loadStripe: false,
            buttonText: 'Place Order',
            billing: {
                country: 'IE',
            },
            paymentMethod: 'stripe',
            cardOptions: {
                hidePostalCode: true,
                style: {
                    base: { color: '#1F2937', fontSize: '16px' }
                },
            }
        }
    },
    components: {
        StripeElements,
        StripeElement
    },
    methods: {
        pay() {
            this.buttonText = 'Processing...';
            if (this.paymentMethod == 'stripe') {
                this.payWithStripe();
            } else {
                this.checkout()
            }
        },
        payWithStripe() {
            this.buttonText = 'Processing...';

            // ref in template
            const groupComponent = this.$refs.elms
            const cardComponent = this.$refs.card
            // Get stripe element
            const cardElement = cardComponent.stripeElement

            groupComponent.instance.createSource(cardElement).then(result => {
                this.buttonText = 'Checking out...';
                this.checkout(result.source.id)
            })
        },
        async checkout(sourceId) {
            try {
                const variables = {
                    billing: this.billing,
                    metaData: sourceId ? [{ key: "_stripe_source_id", value: sourceId }] : null,
                    paymentMethod: this.paymentMethod,
                }
                console.log(variables);
                const { checkout } = await this.$graphql.default.request(CHECKOUT, variables)
                if (checkout.result == 'success') {
                    this.buttonText = 'Order Successfull';
                    this.$store.commit('updateCart', null);
                    this.$router.push({ name: 'order-summary', params: { order: checkout.order } })
                } else {
                    this.buttonText = 'Place Order';
                }
            } catch (error) {
                console.log(error);
            }
        },
        addStripeScript() {
            // Check if the stripe script is already added to the head
            if (document.querySelector('script[src="https://js.stripe.com/v3/"]')) {
                this.loadStripe = true
            } else {
                // Add the stripe script to the head
                const script = document.createElement('script')
                script.src = 'https://js.stripe.com/v3/'
                script.async = true
                document.head.appendChild(script)
                // Wait for the stripe script to be loaded
                script.onload = () => {
                    this.loadStripe = true
                }
            }
        },
        updateBilling(billing) {
            this.billing = billing
        }
    },
    computed: {
        cart() {
            return this.$store.state.cart
        }
    },
    mounted() {
        this.addStripeScript()
    }
}
</script>

<style lang="postcss">
.checkout-form input[type="text"],
.checkout-form input[type="email"],
.checkout-form input[type="tel"],
.checkout-form textarea,
.checkout-form .StripeElement,
.checkout-form select {
    @apply bg-white border rounded-xl outline-none w-full py-2.5 px-4 block;
}
label {
    @apply text-xs mb-1.5 text-gray-600 inline-block uppercase block;
}
.checkout-form .StripeElement {
    padding: 1rem 0.75rem;
}
</style>