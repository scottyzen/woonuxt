<template>
    <div class="-mx-4 md:m-0 md:w-[500px]" v-if="mainImage">
        <nuxt-img
            class="object-contain rounded-2xl w-full min-w-[350px]"
            width="600"
            height="600"
            format="webp"
            fit="outside"
            :src="firstImage"
            v-show="imageToShow === null"
        />
        <nuxt-img
            class="object-contain rounded-2xl w-full min-w-[350px]"
            width="600"
            height="600"
            format="webp"
            fit="outside"
            :src="mainImage"
            v-show="imageToShow === 0"
        />
        <nuxt-img
            class="object-contain rounded-2xl w-full min-w-[350px]"
            width="600"
            height="600"
            format="webp"
            fit="outside"
            v-for="(node, i) in gallery.nodes"
            :key="i"
            :src="node.sourceUrl"
            v-show="imageToShow === i + 1"
        ></nuxt-img>
        <div v-if="gallery" class="my-4 gallery-images">
            <nuxt-img
                class="cursor-pointer rounded-2xl"
                width="110"
                height="140"
                format="webp"
                fit="outside"
                :src="firstImage"
                @click.native="changeImage(null)"
            ></nuxt-img>
            <nuxt-img
                class="cursor-pointer rounded-2xl"
                width="110"
                height="140"
                format="webp"
                fit="outside"
                v-for="(node, i) in gallery.nodes"
                :key="i"
                :src="node.sourceUrl"
                @click.native="changeImage(i + 1)"
            ></nuxt-img>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            imageToShow: 0
        }
    },
    props: ['firstImage', 'mainImage', 'gallery'],
    methods: {
        changeImage(index) {
            this.imageToShow = index;
        }
    },
    watch: {
        mainImage(newImage) {
            this.imageToShow = 0;
        }
    },
}
</script>

<style>
</style>