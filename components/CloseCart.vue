<template>
	<svg class="absolute cursor-pointer top-5 left-8" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512" @click="closeCart">
		<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M368 368L144 144M368 144L144 368" />
	</svg>
</template>

<script>
export default {
	methods: {
		closeCart() {
			this.$store.commit('toggleCart', false)
		}
	}
}
</script>
