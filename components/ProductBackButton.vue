<template>
    <transition name="scale-y">
        <nuxt-link
            v-if="showButton"
            :to="{ name: 'products', params: { page: this.page } }"
            class="bg-white rounded-full shadow-lg m-4 leading-tight p-2 px-4 top-4 left-4 gap-1 inline-flex absolute item-center justify-center md:left-0"
        >
            <Icon name="back-arrow" width="18" class="-ml-1" />Back
        </nuxt-link>
    </transition>
</template>

<script>
export default {
    data() {
        return {
            showButton: false
        }
    },
    props: {
        page: {
            type: Number,
            default: 1
        }
    },
    mounted() {
        setTimeout(() => {
            this.showButton = true
        }, 300)
    },
}
</script>