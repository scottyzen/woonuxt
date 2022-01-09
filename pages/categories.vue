<template>
    <main class="container">
        <div
            class="my-4 grid gap-4 grid-cols-2 lg:gap-8 lg:grid-cols-3 xl:grid-cols-4"
            :style="cssVars"
        >
            <CategoryCard
                v-for="(category, i) in productCategories.nodes"
                :key="i"
                :node="category"
            />
        </div>
    </main>
</template>

<script>
import GET_PRODUCT_CATEGORIES from '~/gql/queries/getProductCategories';

export default {
    async asyncData({ $graphql, params }) {
        const { productCategories } = await $graphql.default.request(GET_PRODUCT_CATEGORIES)
        return { productCategories }
    },
}
</script>
