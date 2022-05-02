<template>
    <img v-if="mounted || loading == 'egar' || preload" :src="sourceUrl" :width="width" :height="height"
        :srcset="srcset" />
    <img v-else :src="`${this.base}?w=${20}&h=${20}&output=webp&q=${20}&blur=5`" :width="width" :height="height"
        loading="lazy" />
</template>

<script>
export default {
    name: 'SCImg',
    data() {
        return {
            mounted: false
        }
    },
    props: {
        src: { type: String, required: true },
        width: { type: String, default: '200' },
        height: { type: String, default: '200' },
        quality: { type: String, default: '100' },
        format: { type: String, default: 'webp' },
        loading: { type: String, default: 'egar' },
        preload: { type: Boolean, default: false },
        sm: { type: Number, default: 0 },
    },
    head() {
        return {
            link: this.preload ? [{ rel: 'preload', href: this.sourceUrl, as: 'image', type: 'image/webp' }] : [],
        };
    },
    async mounted() {
        if (this.mounted) {
            return;
        }
        if (!this.preload) {
            this.showImage();
            window.addEventListener('scroll', this.handleScroll);
            window.addEventListener('resize', this.handleScroll);
            window.addEventListener('focus', this.handleScroll);
        }
    },
    methods: {
        handleScroll() {
            if (this.mounted) {
                window.removeEventListener('scroll', this.handleScroll);
                window.removeEventListener('resize', this.handleScroll);
                window.removeEventListener('focus', this.handleScroll);
                return;
            }
            this.showImage();
        },
        showImage() {
            const rect = this.$el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                // console.log('image visible', this.src);
                this.mounted = true;
            }
        },
    },
    computed: {
        base() {
            if (this.src.startsWith('http')) return `https://images.weserv.nl/?url=${this.src}`;
            return (process.env.NODE_ENV === 'production') ? `https://images.weserv.nl/?url=https://${this.$config.domain}/${this.src}` : this.src;
        },
        sourceUrl() {
            return `${this.base}?w=${this.width}&h=${this.height}&output=${this.format}&q=${this.quality}&dpr=2&fit=cover`
        },
        srcset() {
            const sizes = ['320', '768', '1280']
            const sizesBelowMaxWidth = sizes
            // const sizesBelowMaxWidth = sizes.filter(size => parseInt(size) < this.width)

            const srsArray = sizesBelowMaxWidth.map(size => {
                const ratio = this.width / this.height;
                const width = parseInt(size) > parseInt(this.width) ? this.width : size;
                const height = width / ratio;

                // get small size ratio
                const smallWidth = this.sm;
                const smallHeight = smallWidth / ratio;

                if (size == '320' && this.sm) {
                    return `${this.base}?w=${smallWidth}&h=${smallHeight}&output=${this.format}&dpr=2&fit=cover ${size}w`
                }

                return `${this.base}?w=${width}&h=${height}&output=${this.format}&dpr=2&fit=cover ${size}w`
            })

            return srsArray.join(', ')
        }
    }
}
</script>