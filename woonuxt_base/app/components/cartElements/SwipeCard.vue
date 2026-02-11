<template>
  <div v-if="isAlive" class="rounded-lg flex h-16 w-full overflow-hidden relative items-center">
    <TrashIcon class="transform transition-all right-0 w-6 scale-0 absolute" :class="{ 'scale-100': displayLengthX > 40, 'delete-ready': displayLengthX > 80 }" />
    <div
      class="rounded-lg inset-0 absolute"
      :class="{ 'transition-all': !isSwiping || disabled }"
      ref="el"
      :style="{ transform: isSwiping && !disabled ? `translateX(-${displayLengthX}px)` : `none` }">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { useSwipe } from '@vueuse/core';
const props = defineProps({
  disabled: { type: Boolean, default: false },
});
const emit = defineEmits(['remove']);

const isAlive = ref(true);
const el = ref(null);
const { isSwiping, lengthX } = useSwipe(el, {
  passive: true,
  onSwipeEnd() {
    if (props.disabled) return;
    if (lengthX.value > 80) {
      isAlive.value = false;
      emit('remove');
    }
  },
});
const displayLengthX = computed(() => (props.disabled ? 0 : lengthX.value));
</script>

<style>
@reference "#tailwind";

.underlay {
  @apply flex p-4 inset-0 transition-all justify-end absolute items-center;
}
.delete-ready {
  @apply text-red-500;
}
</style>
