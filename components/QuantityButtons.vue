<template>
	<div class="flex w-24">
		<button
			@click.prevent="count > min ? count-- : null"
			class="bg-white rounded-full h-7 shadow text-lg w-7 inline-block hover:bg-primary hover:text-white active:bg-primary-light"
		>-</button>
		<input
			class="bg-transparent border-none outline-none flex-1 text-center w-full apperance-none"
			type="number"
			v-model.number="count"
			min="0"
			:max="max"
			aria-label="Quantity"
		/>
		<button
			@click.prevent="count < max ? count++ : null"
			class="bg-white rounded-full h-7 shadow text-lg w-7 inline-block hover:bg-primary hover:text-white active:bg-primary-light"
		>+</button>
	</div>
</template>

<script>
export default {
	props: {
		quantity: { default: 1, type: Number },
		min: { default: 0, type: Number },
		max: { default: 100, type: Number }
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
input[type="number"] {
	-moz-appearance: textfield;
}
</style>