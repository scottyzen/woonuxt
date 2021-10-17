<template>
	<div class="flex flex-col gap-2">
		<div class="relative " v-for="(attr, i) in attrs" :key="i">

			<div v-if="attr.options.length > 3" class="flex items-center justify-between">
				<div>{{attr.label}}</div>
				<select :name="attr.name" :id="attr.name" @change="updateAttrs" :ref="attr.name" required>
					<option selected disabled hidden :value="null">Choose {{attr.label}}</option>
					<option v-for="option in attr.options" :key="option" :value="option">{{option}}</option>
				</select>
			</div>

			<div v-else class="flex items-center justify-between">
				<div>{{attr.label}}</div>
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
				let name = row.name
				let radioValue = document.querySelector(`.name-${name}:checked`)
				let value = radioValue ? radioValue.value : this.$refs[row.name][0].value

				return { name: name.toLowerCase(), value: value }
			})

			this.$emit('attrs-changed', selectedVariations)
		}
	},
	mounted() {
		this.updateAttrs()
	}
}
</script>

<style lang="postcss">
select {
	@apply appearance-none py-2 px-4 border border-white shadow rounded-2xl;
	background: url('/images/chevron-down.svg') center right 10px no-repeat;
	background-size: 1rem;
	padding-right: 2.5rem;
}

.radio-button {
	@apply inline-block rounded-2xl py-1.5 px-3 text-sm text-center text-gray-800 bg-gray-50 border border-white shadow cursor-pointer;
}

input[type='radio']:checked ~ span {
	@apply bg-purple-500 text-white;
}
</style>