<template>
    <div class="grid gap-8 product-grid" v-if="products">
        <ProductCard
            class="w-full"
            v-for="(node, i) in  products"
            :key="node.databaseId"
            :node="node"
            :index="i"
            :class="{
                'hidden': i === products.length - 1,
                'lg:block': i === products.length - 1
            }"
        />
    </div>
</template>

<script>
export default {
    props: {
        products: {
            type: Array,
            default: null
        }
    }
}
</script>