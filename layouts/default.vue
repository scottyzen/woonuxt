<template>
	<div class="flex flex-col min-h-screen">
		<Header />
		<transition name="slide">
			<Cart v-if="showCart" class="z-50" />
		</transition>
		<transition name="slide">
			<MobileMenu v-if="showMenu" class="z-50" />
		</transition>
		<Nuxt class="flex-1" />
		<transition name="page">
			<div
				v-if="showCart || showMenu"
				class="bg-black opacity-25 inset-0 z-40 fixed"
				@click="closeAllModals"
			></div>
		</transition>
		<LazyFooter />
		<LazyCookieBanner />
	</div>
</template>

<script>
import GET_CART from '~/gql/queries/getCart';

export default {
	computed: {
		showCart() {
			return this.$store.state.showCart;
		},
		showMenu() {
			return this.$store.state.showMenu;
		},
	},
	methods: {
		closeAllModals() {
			this.$store.commit('toggleCart', false);
			this.$store.commit('toggleMenu', false);
		},
		async getCart() {
			try {
				const wooCookie = this.$cookiz.get('woo');
				this.setCookieIfAvailable(wooCookie);

				const { cart, viewer, customer } = await this.$graphql.default.request(
					GET_CART
				);

				this.$store.commit('updateCart', cart);
				if (viewer) {
					this.$store.commit('updateUser', customer);
				} else {
					const token = customer.sessionToken;
					if (!wooCookie) {
						this.$cookiz.set(
							'woo',
							{ token },
							{ path: '/', maxAge: 60 * 60 * 24 * 14 }
						);
						this.$graphql.default.setHeaders({
							'woocommerce-session': `Session ${token}`,
						});
					}
				}
			} catch (error) {
				console.log(error);
			}
		},
		setCookieIfAvailable(wooCookie) {
			if (this.$store.state.viewer || !wooCookie) {
				return;
			}
			this.$graphql.default.setHeaders({
				'woocommerce-session': `Session ${wooCookie.token}`,
			});
		},
	},
	mounted() {
		this.getCart();
	},
};
</script>

<style lang="postcss">
.page-enter-active,
.page-leave-active {
	transition: opacity 300ms ease-in-out;
}
.page-enter,
.page-leave-active {
	opacity: 0;
}
html,
body {
	@apply bg-gray-50 text-gray-900;
	scroll-behavior: smooth;
}

.container {
	max-width: 1440px;
}
.container-sm {
	max-width: 1280px;
}

pre {
	@apply rounded bg-gray-800 my-8 text-xs text-white p-4;
}

/* Enter and leave animations can use different */
/* durations and timing functions.              */
.slide-leave-active,
.slide-enter-active {
	transition: transform 400ms ease-in-out;
}
.slide-enter,
.slide-leave-to {
	transform: translateX(500px);
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
	transition-duration: 300ms;
	transition-property: opacity, transform;
	transition-timing-function: ease-in-out;
	overflow: hidden;
	will-change: transform, opacity;
}

.slide-left-enter,
.slide-right-leave-active {
	opacity: 0;
	transform: translate(1em, 0);
}

.slide-left-leave-active,
.slide-right-enter {
	opacity: 0;
	transform: translate(-1em, 0);
}

@keyframes spin {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}

// slide-up
.slide-up-enter-active,
.slide-up-leave-active {
	transition-duration: 300ms;
	transition-property: height, opacity, transform;
	transition-timing-function: cubic-bezier(0.55, 0, 0.1, 1);
	overflow: hidden;
	will-change: transform, opacity, height;
}

.scale-y-leave-active {
	transition: transform 300ms, max-height 300ms;
	opacity: 0;
	max-height: 0;
	overflow: hidden;
}
.scale-y-enter-active {
	transition: max-height 500ms ease-out, opacity 500ms ease-out 250ms,
		transform 500ms ease-out;
	will-change: opacity, transform, max-height;
	max-height: 600px;
	overflow: hidden;
}
.scale-y-enter,
.scale-y-leave-to {
	opacity: 0;
	transform: scale(0.75) translateY(25%);
	max-height: 0;
	position: absolute;
}
</style>
