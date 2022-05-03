<template>
    <img :src="sourceUrl" :width="width" :height="height" :srcset="srcset" :data-dpr="dpr" />
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
        dpr: { type: Number, default: 2 },
    },
    head() {
        return {
            link: this.preload ? [{ rel: 'preload', href: this.sourceUrl, as: 'image' }] : [],
        };
    },
    // mounted() {
    //     this.$nextTick(() => {
    //         setTimeout(() => {
    //             this.dpr = window.devicePixelRatio;
    //         }, 2000);
    //     });
    // },
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
                return `${this.base}?w=${smallWidth}&h=${smallHeight}&output=${this.format}&q=${this.quality}&dpr=${this.dpr}`;
            } else {
                return `${this.base}?w=${this.width}&h=${this.height}&output=${this.format}&q=${this.quality}&dpr=${this.dpr}`
            }
        },
        isRetina() {
            let mediaQuery
            if (typeof window !== 'undefined' && window !== null) {
                mediaQuery =
                    '(-webkit-min-device-pixel-ratio: 1.25), (min--moz-device-pixel-ratio: 1.25), (-o-min-device-pixel-ratio: 5/4), (min-resolution: 1.25dppx)'
                if (window.devicePixelRatio > 1.25) {
                    return true
                }
                if (window.matchMedia && window.matchMedia(mediaQuery).matches) {
                    return true
                }
            }
            return false
        },
        srcset() {
            const sizes = ['320', '768', '1280', '1920', '2560'];

            const sizesBelowMaxWidth = sizes.filter(size => {
                if (size == '320' && this.sm) return true;
                return parseInt(size) < parseInt(this.width)
            });

            const srsArray = sizes.slice(0, sizesBelowMaxWidth.length + 1).map(size => {
                const ratio = this.width / this.height;
                const width = parseInt(size) > parseInt(this.width) ? this.width : size;
                const height = width / ratio;

                // get small size ratio
                const smallWidth = this.sm;
                const smallHeight = smallWidth / ratio;

                if (size == '320' && this.sm) {
                    return `${this.base}?w=${smallWidth}&h=${smallHeight}&output=${this.format}&dpr=${this.dpr} ${size}w`
                }

                return `${this.base}?w=${width}&h=${height}&output=${this.format}&dpr=${this.dpr} ${size}w`
            })


            return srsArray.length ? srsArray.join(', ') : null;
        }
    }
}
</script>