<script>
// import { ref, defineComponent } from '@vue/composition-api';
import { useSwipe } from '@vueuse/core';

export default defineComponent({
	setup(props, { emit }) {
		const isAlive = ref(true);
		const el = ref(null);
		const { isSwiping, lengthX } = useSwipe(el, {
			passive: true,
			onSwipeEnd() {
				if (lengthX.value > 80) {
					isAlive.value = false;
					emit('has-swiped');
				}
			},
		});

		return { el, isAlive, isSwiping, lengthX };
	},
});
</script>


<template>
	<div v-if="isAlive" class="rounded-lg flex h-16 w-full overflow-hidden relative items-center">
		<TrashIcon class=" transform transition-all right-0 w-6 scale-0 absolute" :class="{'scale-100' : lengthX > 40, 'delete-ready': lengthX > 80}" />
		<div class="rounded-lg inset-0 absolute" :class="{'transition-all' : !isSwiping}" ref="el" :style="{'transform' : isSwiping ? `translateX(-${lengthX}px)` : `none`}">
			<slot :remove="false"></slot>
		</div>
	</div>
</template>


<style lang="postcss">
.underlay {
	@apply flex p-4 inset-0 transition-all justify-end absolute items-center;
}

.delete-ready {
	@apply text-red-500;
}
</style>