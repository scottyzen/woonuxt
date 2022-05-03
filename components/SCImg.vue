<template>
    <img :src="sourceUrl" :width="width" :height="height" :srcset="srcset" />
</template>

<script>
export default {
    name: 'SCImg',
    props: {
        src: { type: String, required: true },
        width: { type: String, default: '200' },
        height: { type: String, default: '200' },
        quality: { type: String, default: '100' },
        format: { type: String, default: 'webp' },
        preload: { type: Boolean, default: false },
        sm: { type: Number, default: 0 },
    },
    head() {
        return {
            link: this.preload ? [{ rel: 'preload', href: this.sourceUrl, as: 'image' }] : [],
        };
    },
    computed: {
        base() {
            if (this.src.startsWith('http')) return `https://images.weserv.nl/?url=${this.src}`;
            return (process.env.NODE_ENV === 'production') ? `https://images.weserv.nl/?url=https://${this.$config.domain}/${this.src}` : this.src;
        },
        sourceUrl() {
            if (this.sm) {
                const ratio = this.width / this.height;
                const smallWidth = this.sm;
                const smallHeight = smallWidth / ratio;
                return `${this.base}?w=${smallWidth}&h=${smallHeight}&output=${this.format}&q=${this.quality}&dpr=2`;
            } else {
                return `${this.base}?w=${this.width}&h=${this.height}&output=${this.format}&q=${this.quality}&dpr=2`
            }
        },
        srcset() {
            const sizes = [320, 768, 1280];

            const sizesBelowMaxWidth = sizes.filter(size => {
                // if (size == 320 && this.sm) return true;
                return size < parseInt(this.width)
            });

            const srsArray = sizesBelowMaxWidth.map(size => {
                const ratio = this.width / this.height;
                const width = size > parseInt(this.width) ? this.width : size;
                const height = width / ratio;

                // get small size ratio
                const smallWidth = this.sm;
                const smallHeight = smallWidth / ratio;

                if (size <= 320 && this.sm) {
                    return `${this.base}?w=${smallWidth}&h=${smallHeight}&output=${this.format}&dpr=2 ${size}w`
                }

                return `${this.base}?w=${width}&h=${height}&output=${this.format}&dpr=2 ${size}w`
            })


            return srsArray.length ? srsArray.join(', ') : null;
        }
    }
}
</script>