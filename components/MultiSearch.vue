<template>
    <Multiselect
        :multiple="true"
        :hide-selected="true"
        v-model="selected"
        :options="[]"
        placeholder="Search..."
        ref="multisearch"
        :taggable="true"
        :maxHeight="0"
        @tag="addTag"
        @update="updateSelected"
        class="flex-1 box-border"
    ></Multiselect>
</template>

<script>
import Multiselect from 'vue-multiselect'
export default {
    components: { Multiselect },
    data() {
        return {
            selected: []
        }
    },
    props: {
        activeTags: {
            type: Array,
            default: () => []
        }
    },
    mounted() {
        this.selected = this.activeTags
    },
    methods: {
        updateSelected(newSelected) {
            this.selected = newSelected
        },
        addTag(newTag) {
            this.selected.push(newTag);
            // focus on the input
            this.$refs.multisearch.$el.focus()
        },
    },
    watch: {
        selected(newVal, oldVal) {
            this.$store.commit('setSearchTags', this.selected)
            this.$emit('has-changed')
        }
    },
    computed: {
        searchTags() {
            return this.$store.state.searchTags
        }
    }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style lang="postcss">
.multiselect__tags {
    @apply border rounded-xl flex max-w-md outline-none flex-1 leading-tight w-full p-2 pr-10 items-center overflow-hidden;
    background: url("/images/search.svg") no-repeat center right 0.75em;
    border-radius: 0.75rem !important;
}
.multiselect__input,
.multiselect__placeholder {
    @apply bg-transparent flex flex-1 m-0 text-base w-full p-0 text-gray-600 w-36 md:text-sm;
    position: static !important;
}
.multiselect__placeholder {
    display: none !important;
}
.multiselect {
    margin-top: 5px;
    margin-bottom: 5px;
}
.multiselect__tags-wrap {
    @apply flex;
}
.multiselect__select {
    @apply hidden;
}

.multiselect__tag {
    @apply bg-primary-light max-w-full mb-0;
    animation: scale-in-left 300ms ease-out;
    transform-origin: left;
}
@keyframes scale-in-left {
    from {
        transform: translateX(-10px);
        opacity: 0;
        max-width: 0;
    }
}
.multiselect__tag-icon:after {
    @apply text-primary;
}
.multiselect__content-wrapper {
    display: none !important;
}
.multiselect__tag-icon:focus,
.multiselect__tag-icon:hover {
    @apply bg-primary-light;
}
.form-group {
    margin-bottom: 0;
}
</style>