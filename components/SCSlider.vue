<template>
    <div>
        <div class="my-4 gap-4 scslider relative" :style="cssVars" ref="scslider">
            <slot />
        </div>
        <div class="container flex my-6 text-gray-500 gap-1 justify-end">
            <div
                class="cursor-pointer"
                :class="!hasPrev ? 'opacity-25 cursor-default' : ''"
                @click="prev"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 512 512"
                    fill="currentColor"
                >
                    <path
                        d="M321.94 98L158.82 237.78a24 24 0 000 36.44L321.94 414c15.57 13.34 39.62 2.28 39.62-18.22v-279.6c0-20.5-24.05-31.56-39.62-18.18z"
                    />
                </svg>
            </div>
            <div
                class="cursor-pointer"
                :class="!hasNext ? 'opacity-25 cursor-default' : ''"
                @click="next"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 512 512"
                    fill="currentColor"
                >
                    <path
                        d="M190.06 414l163.12-139.78a24 24 0 000-36.44L190.06 98c-15.57-13.34-39.62-2.28-39.62 18.22v279.6c0 20.5 24.05 31.56 39.62 18.18z"
                    />
                </svg>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            containerFromLeft: 0,
            childWidth: 0,
            hasPrev: false,
            hasNext: true,
        };
    },
    props: {
        alignTo: { type: String, default: 'container' },
    },
    mounted() {
        this.handleResize();
    },
    destroyed() {
        window.removeEventListener('resize', this.handleResize);
    },
    methods: {
        handleResize() {
            window.addEventListener('resize', this.handleResize);
            if (process.client) {
                const container = document.querySelector(`.${this.alignTo}`);
                const containerLeftPadding = parseInt(window.getComputedStyle(container).paddingLeft);
                this.containerFromLeft = container.getBoundingClientRect().left + containerLeftPadding / 2;
                this.childWidth = this.$refs.scslider.children[0].offsetWidth
            }
        },
        prev() {
            if (this.$refs.scslider.scrollLeft > 0) {
                this.$refs.scslider.scrollLeft = this.$refs.scslider.scrollLeft - this.childWidth;
            }
            this.checkforNextAndPrev()
        },
        next() {
            if (this.$refs.scslider.scrollLeft < this.$refs.scslider.scrollWidth - this.$refs.scslider.clientWidth) {
                this.$refs.scslider.scrollLeft = this.$refs.scslider.scrollLeft + this.childWidth;
            }
            this.checkforNextAndPrev()
        },
        checkforNextAndPrev() {
            setTimeout(() => {
                this.hasPrev = this.$refs.scslider.scrollLeft > 0 ? true : false;
                this.hasNext = this.$refs.scslider.scrollLeft < this.$refs.scslider.scrollWidth - this.$refs.scslider.clientWidth ? true : false;
            }, 300);
        }
    },
    computed: {
        cssVars() {
            return {
                '--containerFromLeft': this.containerFromLeft + 'px',
            };
        },
    },
};
</script>


<style lang="postcss">
.scslider {
    @apply flex overflow-x-scroll;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    scroll-padding-inline: calc(var(--containerFromLeft) + 1rem);
}
.scslider::-webkit-scrollbar {
    display: none;
}
.scslider > * {
    scroll-snap-align: start;
    scroll-snap-stop: always;
}
@media (min-width: 768px) {
    .scslider {
        scroll-snap-type: x proximity;
    }
}
.scslider::before,
.scslider::after {
    content: "";
    min-width: var(--containerFromLeft);
    max-width: var(--containerFromLeft);
    scroll-snap-align: start;
    scroll-snap-stop: always;
}
</style>