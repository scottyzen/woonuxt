<template>
	<div
		class="container flex flex-wrap my-12 gap-8 justify-evenly items-start md:flex-row-reverse lg:gap-12"
	>
		<!-- <pre>cart: {{cart}}</pre> -->
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

		<form @submit.prevent="pay" class="w-full max-w-2xl grid gap-8 checkout-form md:flex-1">
			<div>
				<h2 class="text-xl mb-3 w-full">Billing Details</h2>
				<BillingDetails :billing="billing" @update-billing="updateBilling" />
			</div>

			<label for="shipToDifferentAddress" class="flex gap-2 items-center">
				<span>Ship to a different address?</span>
				<input
					type="checkbox"
					name="shipToDifferentAddress"
					id="shipToDifferentAddress"
					v-model="shipToDifferentAddress"
				/>
			</label>

			<transition name="scale-y" mode="out-in">
				<div v-if="shipToDifferentAddress">
					<h2 class="text-xl mb-3 w-full">Shipping Details</h2>
					<ShippingDetails :shipping="shipping" @update-shipping="updateShipping" />
				</div>
			</transition>

			<!-- Pay methods -->
			<div class="mt-2 col-span-full">
				<h2 class="text-xl mb-3 w-full">Payment Options</h2>
				<div class="flex gap-4">
					<div class="flex gap-1">
						<input type="radio" name="paymentMethod" id="cc" value="stripe" v-model="paymentMethod" />
						<label for="cc">Credit or Debit Card</label>
					</div>
					<div class="flex gap-1">
						<input type="radio" name="paymentMethod" id="cod" value="cod" v-model="paymentMethod" />
						<label for="cod">Cash on Delivery</label>
					</div>
					<div class="flex gap-1">
						<input type="radio" name="paymentMethod" id="paypal" value="paypal" v-model="paymentMethod" />
						<label for="paypal">PayPal</label>
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
						<StripeElement type="card" :elements="elements" :options="cardOptions" ref="card" />
					</StripeElements>
					<span
						class="mt-1 text-sm text-right text-orange-400 capitalize block"
					>Test mode: 4242 4242 4242 4242</span>
				</div>
			</div>

			<div>
				<h2 class="text-xl mb-3 w-full">Order Note (Optional)</h2>
				<textarea name="order-note" id="order-note" class="w-full" v-model="orderNote"></textarea>
			</div>

			<button
				class="bg-primary rounded-2xl shadow-md my-4 text-white text-lg text-center mb-8 p-3 block justify-evenly hover:bg-primary-dark"
			>{{ buttonText }}</button>
		</form>
	</div>
</template>

<script>
import { StripeElements, StripeElement } from 'vue-stripe-elements-plus';
import CHECKOUT from '~/gql/mutations/checkout';

export default {
	middleware({ app, store, redirect, dispatch, commit }) {
		if (!store.state.cart || store.state.cart.isEmpty) {
			return redirect('/');
		}
	},
	head() {
		return { title: 'Checkout' };
	},
	data() {
		return {
			loadStripe: false,
			buttonText: 'Place Order',
			billing: {
				country: 'IE',
			},
			shipping: {
				country: 'IE',
			},
			orderNote: '',
			shipToDifferentAddress: false,
			paymentMethod: 'stripe',
			cardOptions: {
				hidePostalCode: true,
				style: {
					base: { color: '#1F2937', fontSize: '16px' },
				},
			},
		};
	},
	components: {
		StripeElements,
		StripeElement,
	},
	methods: {
		pay() {
			this.buttonText = 'Processing...';
			if (this.paymentMethod == 'stripe') {
				this.payWithStripe();
			} else {
				this.checkout();
			}
		},
		payWithStripe() {
			this.buttonText = 'Processing...';

			// ref in template
			const groupComponent = this.$refs.elms;
			const cardComponent = this.$refs.card;
			// Get stripe element
			const cardElement = cardComponent.stripeElement;

			groupComponent.instance.createSource(cardElement).then((result) => {
				this.buttonText = 'Checking out...';
				this.checkout(result.source.id);
			});
		},
		async checkout(sourceId) {
			try {
				const variables = {
					billing: this.billing,
					shipping: this.shipToDifferentAddress ? this.shipping : this.billing,
					metaData: sourceId
						? [{ key: '_stripe_source_id', value: sourceId }]
						: null,
					paymentMethod: this.paymentMethod,
					customerNote: this.orderNote,
					shipToDifferentAddress: this.shipToDifferentAddress,
				};

				const { checkout } = await this.$graphql.default.request(CHECKOUT, variables);
				if (checkout.result == 'success') {
					this.buttonText = 'Order Successfull';
					this.$store.commit('updateCart', null);
					if (this.paymentMethod == 'paypal') {
						this.$router.push(checkout.redirect);
					} else {
						this.$router.push({ name: 'order-summary', params: { order: checkout.order } });
					}
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
				this.loadStripe = true;
			} else {
				// Add the stripe script to the head
				const script = document.createElement('script');
				script.src = 'https://js.stripe.com/v3/';
				script.async = true;
				document.head.appendChild(script);
				// Wait for the stripe script to be loaded
				script.onload = () => {
					this.loadStripe = true;
				};
			}
		},
		updateBilling(billing) {
			this.billing = billing;
		},
		updateShipping(shipping) {
			this.shipping = shipping;
		},
	},
	computed: {
		cart() {
			return this.$store.state.cart;
		},
	},
	mounted() {
		this.addStripeScript();
	},
};
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