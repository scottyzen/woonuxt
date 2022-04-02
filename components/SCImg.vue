<template>
    <img :src="sourceUrl" :width="width" :height="height" :srcset="srcset" />
</template>

<script>
export default {
    name: 'SCImg',
    props: {
        src: { type: String, required: true },
        width: { type: String, default: '250' },
        height: { type: String, default: '250' },
        quality: { type: String, default: '100' },
    },
    computed: {
        base() {
            if (this.src.startsWith('http')) {
                return `https://images.weserv.nl/?url=${this.src}`
            } else {
                return (process.env.NODE_ENV === 'production') ? `https://images.weserv.nl/?url=https://${this.$config.domain}/${this.src}` : this.src
            }
        },
        sourceUrl() {
            return `${this.base}?w=${this.width}&h=${this.height}&output=webp&q=${this.quality}`
        },
        srcset() {
            const sizes = ['320', '768', '1280']
            const maxWidth = this.width;
            const sizesBelowMaxWidth = sizes.filter(size => size < maxWidth)

            const srcset = sizesBelowMaxWidth.map(size => {
                const ratio = this.width / this.height;
                const width = parseInt(size) > parseInt(this.width) ? this.width : size;
                const height = width / ratio;
                return `${this.base}?w=${width}&h=${height}&output=webp ${size}w`
            })
            return srcset.join(', ')
        },
    }
}
</script>