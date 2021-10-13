<template>
	<div class="flex w-24">
		<button class="inline-block text-lg bg-white rounded-full shadow w-7 h-7">-</button>
		<input class="flex-1 w-full text-center bg-transparent border-none outline-none apperance-none" type="number" value="1">
		<button class="inline-block text-lg bg-white rounded-full shadow w-7 h-7">+</button>
	</div>
</template>

<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
	-webkit-appearance: none;
	margin: 0;
}

/* Firefox */
input[type='number'] {
	-moz-appearance: textfield;
}
</style>