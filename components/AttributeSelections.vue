<template>
	<div class="divide-y flex flex-col divide-gray-100 divide-y-2">
		<div class="py-2 relative" v-for="(attr, i) in attrs" :key="i">
			<div v-if="attr.options.length > 3" class="flex items-center justify-between">
				<div>{{ attr.label }}</div>
				<select
					:name="attr.name"
					:id="attr.name"
					@change="updateAttrs"
					:ref="attr.name"
					required
					class="border-white shadow"
				>
					<option selected disabled hidden :value="null">Choose {{ attr.label }}</option>
					<option v-for="option in attr.options" :key="option" :value="option">{{ option }}</option>
				</select>
			</div>

			<div v-else class="flex items-center justify-between">
				<div>{{ attr.label }}</div>
				<div class="flex gap-2">
					<span v-for="(option, i) in attr.options" :key="option.id">
						<label>
							<input
								class="hidden"
								:checked="i == 0"
								@change="updateAttrs($event)"
								type="radio"
								:class="`name-${attr.name}`"
								:name="attr.name"
								:value="option"
								:ref="attr.name"
							/>
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

				// console.log({ name: name.toLowerCase(), value: value })

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
	@apply border rounded-2xl shadow py-2 px-4 appearance-none;
	background: url("/images/chevron-down.svg") center right 10px no-repeat;
	background-size: 1rem;
	padding-right: 2.5rem;
}

.radio-button {
	@apply border border-white cursor-pointer bg-gray-50 rounded-2xl shadow text-sm text-center py-1.5 px-3 text-gray-800 inline-block;
}

input[type="radio"]:checked ~ span {
	@apply bg-purple-500 text-white;
}
</style>