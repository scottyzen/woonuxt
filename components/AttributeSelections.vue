<template>
	<div>
		<pre class="p-4 my-8 text-xs text-white bg-gray-800 rounded">{{attrs}}</pre>
		<div class="relative " v-for="(attr, i) in attrs" :key="i">
			<label :for="attr.name">{{attr.label}}</label>
			<select :name="attr.name" :id="attr.name" class="p-2 border" @change="updateAttrs" :ref="attr.name">
				<option selected disabled hidden>{{attr.label}}</option>
				<option v-for="option in attr.options" :key="option" :value="option">{{option}}</option>
			</select>
		</div>
	</div>
</template>

<script>
export default {
	props: ['attrs'],
	methods: {
		updateAttrs() {
			const selectedVariations = this.attrs.map((row) => {
				console.log(this.$refs[row.name][0].value)
				return { attributeName: row.name, attributeValue: this.$refs[row.name] }
			})

			this.$emit('attrs-changed', selectedVariations)
		}
	}
}
</script>