<template>
    <div class="grid gap-0.5">
        <div v-for="cat in productCategories" :key="cat.databaseId" class="flex gap-2 items-center">
            <input
                :id="cat.slug"
                type="checkbox"
                :value="cat.slug"
                v-model="selectedCategories"
                @change="checkboxChanged"
            />
            <label :for="cat.slug">{{ cat.name }}</label>
        </div>
    </div>
</template>

<script>
import GET_PRODUCT_CATEGORIES from '~/gql/queries/getProductCategories';
export default {
    data() {
        return {
            selectedCategories: [],
            productCategories: null,
        };
    },
    props: {
        activeCategories: { type: Array, default: [] },
    },
    mounted() {
        this.selectedCategories = this.activeCategories.length ? this.activeCategories : [];
    },
    methods: {
        checkboxChanged() {
            this.$emit('checkbox-changed', this.selectedCategories.filter(Boolean));
        },
    },
    async fetch() {
        const { productCategories } = await this.$graphql.default.request(GET_PRODUCT_CATEGORIES)
        this.productCategories = productCategories.nodes
    },
    watch: {
        activeCategories(newCategories) {
            this.selectedCategories = newCategories;
        },
    },
}
</script>

<style>
</style>