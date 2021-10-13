<template>
	<div class="flex w-24">
		<button @click="count--" class="inline-block text-lg bg-white rounded-full shadow w-7 h-7">-</button>
		<input class="flex-1 w-full text-center bg-transparent border-none outline-none apperance-none" type="number" v-model.number="count">
		<button @click="count++" class="inline-block text-lg bg-white rounded-full shadow w-7 h-7">+</button>
	</div>
</template>

<script>
export default {
	props: {
		quantity: { default: 1, type: Number }
	},
	computed: {
		count: {
			get() {
				return this.quantity
			},
			set(newValue) {
				this.$emit('quantity-change', newValue)
			}
		}
	}
}
</script>

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