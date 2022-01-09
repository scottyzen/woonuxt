<template>
    <div class="my-4 scslider" :style="cssVars">
        <slot />
    </div>
</template>

<script>
export default {
    data() {
        return {
            containerFromLeft: 0,
        };
    },
    props: {
        alignTo: {
            type: String,
            default: 'container',
        },
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
    @apply flex gap-4 overflow-x-scroll;
    scroll-snap-type: x proximity;
    scroll-behavior: smooth;
    scroll-padding-inline: calc(var(--containerFromLeft) + 1rem);
}
.scslider::-webkit-scrollbar {
    display: none;
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