<template>
    <picture>
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
        className: { type: String, default: '' }
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

        },
        srcset() {
            const sizes = ['320', '640', '960', '1280', '1920']
            const srcset = sizes.map(size => {
                return `https://images.weserv.nl/?url=${this.src}?w=${this.width}&h=${this.height}&output=webp ${size}w`
            })
            console.log(srcset);
            return srcset.join(', ')
        }
    }
}
</script>