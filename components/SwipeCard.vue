<template>
	<div class="rounded-lg flex h-16 w-full overflow-hidden relative items-center">
		<TrashIcon class=" transform transition-all right-0 w-6 scale-0 absolute" :class="{'scale-100' : lengthX > 40, 'delete-ready': lengthX > 80}" />
		<div class="rounded-lg inset-0 absolute" :class="{'transition-all' : !isSwiping}" ref="el" :style="{'transform' : isSwiping ? `translateX(-${lengthX}px)` : `none`}">
			<slot :remove="false"></slot>
		</div>
	</div>
</template>

<script>
import updateCartQuantity from '~/gql/mutations/updateCartQuantity';
import { ref, defineComponent } from '@nuxtjs/composition-api';
import { useSwipe } from '@vueuse/core';

export default defineComponent({
	setup(context) {
		// VUEUSE
		const el = ref(null);
		const { isSwiping, lengthX, direction } = useSwipe(el, {
			passive: true,
			async onSwipeEnd() {
				if (lengthX.value > 80) removeItemFromCart();
			},
		});

		const removeItemFromCart = async () => {
			const key = context.attrs.item.key;
			const quantity = 0;
			const { updateItemQuantities } =
				await context.root.$graphql.default.request(updateCartQuantity, {
					key,
					quantity,
				});
			context.root.$store.commit('updateCart', updateItemQuantities.cart);
		};

		return { el, isAlive, isSwiping, lengthX };
	},
});
</script>

<style lang="postcss">
.underlay {
	@apply flex p-4 inset-0 transition-all justify-end absolute items-center;
}

.delete-ready {
	@apply text-red-500;
}
</style>