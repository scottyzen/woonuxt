<template>
    <picture :class="className">
        <source :srcset="srcset" :width="width" :height="height" :alt="alt" :class="className" />
        <img :src="sourceUrl" :width="width" :height="height" :alt="alt" :class="className" />
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
        className: { type: String, default: '' },
        quality: { type: String, default: '75' },
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