<template>
    <img :src="sourceUrl" />
</template>

<script>
export default {
    props: {
        src: { type: String, required: true },
        width: { type: String, default: '250' },
        height: { type: String, default: '250' },
        quality: { type: String, default: '75' },
    },
    computed: {
        sourceUrl() {

            if (this.src.startsWith('http')) {
                return `https://images.weserv.nl/?url=${this.src}?w=${this.width}&h=${this.height}&output=webp`
            } else {
                if (process.env.NODE_ENV === 'production') {
                    return `https://images.weserv.nl/?url=https://${this.$config.domain}/${this.src}&w=${this.width}&h=${this.height}&output=webp`
                } else {
                    return this.src
                }
            }

        }
    }
}
</script>