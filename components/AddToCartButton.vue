<template>
	<button
		type="submit"
		class="bg-primary flex rounded-2xl text-white text-center min-w-[150px] p-2.5 gap-4 items-center justify-center focus:outline-none"
		:class="{ 'disabled': disabled }"
		:disabled="disabled"
	>
		<span>{{ addToCartButtonText }}</span>
		<span class="icon"></span>
	</button>
</template>

<script>
export default {
	props: ['addToCartButtonText', 'disabled']
}
</script>

<style lang="postcss">
button {
	outline: none !important;
	transition: all 150ms ease-in;
}
button.disabled {
	@apply cursor-not-allowed bg-gray-400;
}
button .icon {
	display: inline-block;
	width: 6px;
	height: 12px;
	transform: rotate(0) scale(0);
	transition: none;
	max-width: 0;
}
button.loading .icon {
	@apply rounded-full animate-spin-fast inline-block;
	border: 2px solid #fff;
	border-left: 2px solid transparent;
	width: 12px;
	height: 12px;
	transition: all 150ms ease-in;
	transform: scale(1);
	max-width: 100px;
	will-change: transform;
}
/* button.success {
	@apply bg-green-500;
} */
button.success .icon {
	display: inline-block;
	border-bottom: 2px solid #fff;
	border-right: 2px solid #fff;
	transform: rotate(45deg) scale(1);
	transition: all 150ms ease-in;
	max-width: 100px;
}
</style>