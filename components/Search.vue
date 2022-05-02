<template>
    <input type="search" placeholder="Search products..." :class="{ 'border-purple-500': search }" v-model="search" />
</template>

<script >
import Fuse from 'fuse.js'

export default {
    data() {
        return {
            search: '',
            results: null
        }
    },
    methods: {
        searchProducts() {
            const options = {
                shouldSort: true,
                threshold: 0.3,
                location: 0,
                distance: 100,
                maxPatternLength: 32,
                minMatchCharLength: 1,
                useExtendedSearch: true,
                keys: [
                    "name",
                    "description",
                    ['allPaColor', 'nodes', 'name']
                ]
            }
            const fuse = new Fuse(this.$store.state.products, options)
            const results = fuse.search(this.search)
            if (results.length > 0) {
                // keet in original format
                this.results = results.map((result) => result.item)
            } else {
                this.results = []
            }

            this.$emit('search', {
                search: this.search,
                results: this.results
            })
        }
    },
    watch: {
        search() {
            this.searchProducts()
        }
    }
}
</script>