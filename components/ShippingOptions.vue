<template>
    <div class="grid shipping-options gap-4">
        <!-- Shipping options -->
        <div
            v-for="option in options"
            :key="option.id"
            class="option"
            :class="{
                'active-option': option.id === activeOption,
                'hidden': hasFreeShipping && option.id === 'flat_rate:2',
            }"
            @click="setActiveOption(option.id)"
        >
            <div class="text-sm">{{ option.label }}</div>
            <div class="font-semibold">€{{ option.cost }}</div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        options: {
            type: Array,
            required: true,
        },
        activeOption: {
            type: String,
            required: true,
        }
    },
    methods: {
        setActiveOption(id) {
            this.$emit('setActiveOption', id)
        }
    },
    computed: {
        hasFreeShipping() {
            return this.options ? this.options.some(option => parseFloat(option.cost) === 0) : false
        }
    }
}
</script>

<style lang="postcss">
.shipping-options {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
}
.shipping-options .option {
    @apply w-full p-4 rounded-xl text-gray-600 border-2 hover:bg-gray-50 cursor-pointer;
}
.shipping-options .active-option {
    @apply border-primary-light bg-gray-50 cursor-default;
    pointer-events: none;
}
</style>