<template>
	<div v-if="isAlive" class="rounded-lg flex h-16 w-full overflow-hidden relative items-center">
		<TrashIcon class=" transform transition-all right-0 w-6 scale-0 absolute" :class="{'scale-100' : lengthX > 40, 'delete-ready': lengthX > 80}" />
		<div class="rounded-lg inset-0 absolute" :class="{'transition-all' : !isSwiping}" ref="el" :style="{'transform' : isSwiping ? `translateX(-${lengthX}px)` : `none`}">
			<slot></slot>
		</div>
	</div>
</template>

<script setup>
const el = ref(null);
const isAlive = ref(true);
const { isSwiping, lengthX, direction } = useSwipe(el, {
	passive: false,
	onSwipeEnd() {
		if (lengthX.value > 80) {
			isAlive.value = false;
		}
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