<template>
    <img v-if="mounted || loading == 'eager'" :src="sourceUrl" :width="width" :height="height" :srcset="srcset"
        :loading="loading" />
    <img v-else :src="`${this.base}?w=${20}&h=${20}&output=webp&q=${20}&blur=5`" :width="width" :height="height"
        :loading="loading" />
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
        mounted: { type: Boolean, default: false },
        loading: { type: String, default: 'lazy' },
        preload: { type: Boolean, default: false },
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
            const rect = this.$el.getBoundingClientRect();
            // check if an image is visible
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                this.mounted = true;
            } else {
                // On scroll, check if an image is visible
                window.addEventListener('scroll', this.handleScroll);
                // On resize, check if an image is visible
                window.addEventListener('resize', this.handleScroll);
                // On focus, check if an image is visible
                window.addEventListener('focus', this.handleScroll);
            }
        }

    },
    methods: {
        handleScroll() {
            this.mounted = true;
            window.removeEventListener('scroll', this.handleScroll);
            window.removeEventListener('resize', this.handleScroll);
            window.removeEventListener('focus', this.handleScroll);
        },
    },
    destroyed() {
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleScroll);
        window.removeEventListener('focus', this.handleScroll);
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