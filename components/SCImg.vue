<template>
    <img
        v-if="mounted || loading == 'egar'"
        :src="sourceUrl"
        :width="width"
        :height="height"
        :srcset="srcset"
        :loading="loading"
    />
    <img
        v-else
        :src="`${this.base}?w=${20}&h=${20}&output=webp&q=${20}&blur=5`"
        :width="width / 10"
        :height="height / 10"
        :loading="loading"
    />
</template>

<script>
export default {
    name: 'SCImg',
    props: {
        src: { type: String, required: true },
        width: { type: String, default: '200' },
        height: { type: String, default: '200' },
        quality: { type: String, default: '90' },
        format: { type: String, default: 'webp' },
        mounted: { type: Boolean, default: false },
        loading: { type: String, default: 'lazy' },
    },
    mounted() {
        this.mounted = true;
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
            const sizesBelowMaxWidth = sizes.filter(size => size < this.width)

            return sizesBelowMaxWidth.map(size => {
                const ratio = this.width / this.height;
                const width = parseInt(size) > parseInt(this.width) ? this.width : size;
                const height = width / ratio;
                return `${this.base}?w=${width}&h=${height}&output=${this.format} ${size}w`
            }).join(', ')
        }
    }
}
</script>