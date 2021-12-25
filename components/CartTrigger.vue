<template>
	<div class="relative cursor-pointer" @click="iconClick">
		<svg width="20" height="20" class="ml-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"  :data-itemCount="$store.state.itemCount">
			<circle cx="176" cy="416" r="16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" />
			<circle cx="400" cy="416" r="16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" />
			<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M48 80h64l48 272h256" />
			<path d="M160 288h249.44a8 8 0 007.85-6.43l28.8-144a8 8 0 00-7.85-9.57H128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" />
		</svg>
		<span v-if="$store.state.cart && $store.state.cart.contents.itemCount > 0" class="text-white absolute -top-2 -right-2 inline-flex justify-center items-center bg-purple-500 text-[10px] rounded-full leading-none p-[3px] min-w-[16px]">{{$store.state.cart.contents.itemCount}}</span>
	</div>
</template>

<script>
export default {
	methods: {
		iconClick() {
			this.$emit('icon-click')
		}
	}
}
</script>

<style scoped>
svg:before {
	content: attr(data-itemCount);
	display: inline-flex;
	background: red;
}
</style>
