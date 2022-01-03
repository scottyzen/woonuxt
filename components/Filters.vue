<template>
	<aside id="filters" class="hidden md:block">
		<span class="text-xl mb-8 block">Filter</span>

		<!-- Price Range -->
		<div class="mb-3">Price Range</div>
		<div class="flex gap-4 justify-between">
			<div class="flex w-1/2 relative items-center">
				<span v-if="filter.minPrice" class="p-2 absolute">€</span>
				<input
					class="price-input"
					type="number"
					placeholder="Min"
					min="0"
					v-model.number="filter.minPrice"
					step="1"
					:class="{ 'active': filter.minPrice }"
				/>
			</div>
			<div class="flex w-1/2 relative items-center">
				<span v-if="filter.maxPrice" class="p-2 absolute">€</span>
				<input
					class="price-input"
					type="number"
					placeholder="Max"
					min="0"
					max="90"
					v-model.number="filter.maxPrice"
					step="1"
					:class="{ 'active': filter.maxPrice }"
				/>
			</div>
		</div>

		<div class="mt-8 mb-3">Rating</div>
		<div class="grid gap-1">
			<label for="star-five" class="flex items-center">
				<input id="star-five" type="radio" :value="5" v-model="filter.starRating" />
				<Stars :number="5" />
			</label>
			<label for="star-four" class="flex items-center">
				<input id="star-four" type="radio" :value="4" v-model="filter.starRating" />
				<Stars :number="4" />
			</label>
			<label for="star-three" class="flex items-center">
				<input id="star-three" type="radio" :value="3" v-model="filter.starRating" />
				<Stars :number="3" />
			</label>
			<label for="star-two" class="flex items-center">
				<input id="star-two" type="radio" :value="2" v-model="filter.starRating" />
				<Stars :number="2" />
			</label>
			<label for="star-one" class="flex items-center">
				<input id="star-one" type="radio" :value="1" v-model="filter.starRating" />
				<Stars :number="1" />
			</label>
		</div>

		<transition name="fadeUp">
			<a
				v-if="showRestButton"
				@click="reset"
				class="rounded-xl cursor-pointer bg-purple-600 mt-12 text-center text-white leading-tight w-full p-2 block hover:bg-purple-700"
			>Clear all filters</a>
		</transition>
	</aside>
</template>

<script>

export default {
	data() {
		const initialState = {
			minPrice: null,
			maxPrice: 90,
			starRating: null,
		};
		return {
			filter: initialState,
			initialState: JSON.stringify(initialState),
		};
	},
	mounted() {
		if (this.$store.state.filter) {
			this.filter = this.$store.state.filter
		}
	},
	methods: {
		reset() {
			this.filter = JSON.parse(this.initialState);
		},
	},
	watch: {
		filter: {
			handler(newVal, oldVal) {
				// check if newVal is equal to initialState
				if (JSON.stringify(newVal) === this.initialState) {
					this.$store.commit('setFilter', null);
				} else {
					this.$store.commit('setFilter', newVal);
				}
				this.$emit('filter-updated');
			},
			deep: true,
		}
	},
	computed: {
		showRestButton() {
			return JSON.stringify(this.filter) !== this.initialState;
		},
	},
}
</script>

<style lang="postcss">
#filters {
	@apply bg-white border-r border-gray-100 py-8 pr-8 w-[225px];
	box-shadow: -100px 0 0 white, -200px 0 0 white, -300px 0 0 white;
}
.price-input {
	@apply border rounded-xl outline-none leading-tight w-full p-2 transition-all;
}
.price-input.active {
	@apply border-gray-400 pl-6;
}
.fadeUp-enter-active,
.fadeUp-leave-active {
	transition: all 300ms;
}
.fadeUp-enter,
.fadeUp-leave-active {
	opacity: 0;
	transform: translateY(10px);
}
</style>
