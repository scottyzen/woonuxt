<template>
    <picture ref="scimage">
        <source
            :srcset="srcset"
            :width="width"
            :height="height"
            :alt="alt"
            :class="className"
            :loading="loading"
        />
        <img
            :src="sourceUrl"
            :width="width"
            :height="height"
            :alt="alt"
            :class="className"
            :loading="loading"
        />
    </picture>
</template>

<script>
export default {
    name: 'SCImg',
    props: {
        src: { type: String, required: true },
        width: { type: String, default: '250' },
        height: { type: String, default: '250' },
        quality: { type: String, default: '75' },
        alt: { type: String, default: 'Image' },
        quality: { type: String, default: '100' },
        loading: { type: String, default: 'lazy' },
        mounted: { type: Boolean, default: false },
        className: { type: String, default: '' },
    },
    mounted() {
        this.className = this.$refs.scimage.className;
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
            const sizes = ['320', '640', '960', '1280', '1920']
            return sizes.map(size => `${this.base}?w=${this.width}&h=${this.height}&output=webp ${size}w`).join(', ')
        }
    }
}
</script>