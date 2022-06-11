<template>
	<div class="flex flex-col gap-2 justify-between">
		<div class="flex flex-wrap py-2 relative justify-between" v-for="(attr, i) in attrs" :key="i">
			<div v-if="attr.name == 'pa_color'" class="grid gap-2">
				<div>Color</div>
				<div class="flex gap-2">
					<span v-for="(option, i) in attr.options" :key="option.id">

						<label>
							<input class="hidden" :checked="i == 0" @change="updateAttrs($event)" type="radio" :class="`name-${attr.name}`" :name="attr.name" :value="option" :ref="attr.name" />
							<span class="color-button" :class="`color-${option}`"></span>
						</label>
					</span>
				</div>
			</div>

			<div v-else-if="attr.options.length > 3" class="grid gap-2">
				<div>{{ attr.label }}</div>
				<select :name="attr.name" :id="attr.name" @change="updateAttrs" :ref="attr.name" required class="border-white shadow">
					<option selected disabled hidden :value="null">Choose {{ attr.label }}</option>
					<option v-for="option in attr.options" :key="option" :value="option">{{ option }}</option>
				</select>
			</div>

			<div v-else class="grid gap-2">
				<div>{{ attr.label }}</div>
				<div class="flex gap-2">
					<span v-for="(option, i) in attr.options" :key="option.id">
						<label>
							<input class="hidden" :checked="i == 0" @change="updateAttrs($event)" type="radio" :class="`name-${attr.name}`" :name="attr.name" :value="option" :ref="attr.name" />
							<span class="radio-button" :class="`picker-${option}`">{{ option }}</span>
						</label>
					</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: ['attrs'],
	methods: {
		updateAttrs() {
			const selectedVariations = this.attrs.map((row) => {
				let name = row.name;
				let radioValue = document.querySelector(`.name-${name}:checked`);
				let value = radioValue
					? radioValue.value
					: this.$refs[row.name][0].value;

				// console.log({ name: name.toLowerCase(), value: value })

				return { name: name.toLowerCase(), value: value };
			});

			this.$emit('attrs-changed', selectedVariations);
		},
	},
	mounted() {
		this.updateAttrs();
	},
};
</script>

<style lang="postcss">
select {
	@apply border-2 rounded-2xl  py-2 px-4 appearance-none;
	background: url('/images/chevron-down.svg') center right 10px no-repeat;
	background-size: 1rem;
	padding-right: 2.5rem;
}

.radio-button {
	@apply border-transparent border-white cursor-pointer outline bg-gray-50 border-2 rounded-2xl text-sm text-center outline-2 outline-gray-100 py-1.5 px-3 transition-all text-gray-800 inline-block;
}

.color-button {
	@apply border-transparent border-white cursor-pointer outline bg-gray-50 border-2 rounded-2xl text-sm text-center outline-2 outline-gray-100 transition-all text-gray-800 inline-block;
	width: 2rem;
	height: 2rem;
}
.color-green {
	@apply bg-green-500;
}
.color-blue {
	@apply bg-blue-500;
}

.color-red {
	@apply bg-red-500;
}

.color-yellow {
	@apply bg-yellow-500;
}

.color-orange {
	@apply bg-orange-500;
}

.color-purple {
	@apply bg-purple-500;
}
.color-black {
	@apply bg-black;
}

input[type='radio']:checked ~ span {
	@apply outline outline-2 outline-gray-500;
}
</style>