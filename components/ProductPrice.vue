<template>
    <div class="flex items-center">
        <span
            class="font-semibold"
            :class="{ 'text-gray-500 line-through text-xs opacity-80': salePrice }"
        >{{ regularPrice }}</span>
        <span v-if="salePrice" class="font-semibold ml-2">{{ salePrice }}</span>
    </div>
</template>

<script>
export default {
    props: {
        regularPrice: {
            type: String,
            required: true
        },
        salePrice: {
            default: null
        }
    }
}
</script>