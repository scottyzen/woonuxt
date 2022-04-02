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
        format: { type: String, default: 'webp' },
    },
    computed: {
        base() {
            if (this.src.startsWith('http')) return `https://images.weserv.nl/?url=${this.src}`;
            return (process.env.NODE_ENV === 'production') ? `https://images.weserv.nl/?url=https://${this.$config.domain}/${this.src}` : this.src;
        },
        sourceUrl() {
            return `${this.base}?w=${this.width}&h=${this.height}&output=${this.format}&q=${this.quality}`
        },
        srcset() {
            const sizes = ['320', '768', '1280']

            const srcset = sizes.filter(size => size < this.width).map(size => {
                const ratio = this.width / this.height;
                const width = parseInt(size) > parseInt(this.width) ? this.width : size;
                const height = width / ratio;
                return `${this.base}?w=${width}&h=${height}&output=${this.format} ${size}w`
            })

            return srcset.join(', ')
        },
    }
}
</script>