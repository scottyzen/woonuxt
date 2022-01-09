<template>
    <div>
        <div
            class="my-4 gap-4 scslider relative"
            :style="cssVars"
            ref="scslider"
            @scroll="handleScroll($event)"
            :class="!extraClass ? extraClass : ''"
        >
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
                    fill="currentColor"
                    viewBox="0 0 512 512"
                >
                    <path
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="48"
                        d="M328 112L184 256l144 144"
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
                    fill="currentColor"
                    viewBox="0 0 512 512"
                >
                    <path
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="48"
                        d="M184 112l144 144-144 144"
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
        extraClass: { type: String, default: '' }
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
                const containerFromLeft = container.getBoundingClientRect().left;
                const containerPaddingLeft = parseInt(window.getComputedStyle(container).getPropertyValue('padding-left')) / 2;
                this.containerFromLeft = containerFromLeft + containerPaddingLeft;
                this.childWidth = this.$refs.scslider.children[0].offsetWidth
            }
        },
        handleScroll(e) {
            const { scrollLeft, scrollWidth, offsetWidth } = e.target;
            this.hasPrev = scrollLeft > 0;
            this.hasNext = scrollLeft + offsetWidth < scrollWidth;
        },
        prev() {
            if (this.$refs.scslider.scrollLeft > 0) {
                this.$refs.scslider.scrollLeft = this.$refs.scslider.scrollLeft - this.childWidth;
            }
        },
        next() {
            if (this.$refs.scslider.scrollLeft < this.$refs.scslider.scrollWidth - this.$refs.scslider.clientWidth) {
                this.$refs.scslider.scrollLeft = this.$refs.scslider.scrollLeft + this.childWidth;
            }
        },
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