<template>
    <div class="-mx-4 md:m-0 md:w-[500px]" v-if="mainImage">
        <SCImg
            class="object-contain rounded-2xl w-full min-w-[350px]"
            width="600"
            height="600"
            :src="firstImage"
            v-show="imageToShow === null"
        />
        <SCImg
            class="object-contain rounded-2xl w-full min-w-[350px]"
            width="600"
            height="600"
            :src="mainImage"
            v-show="imageToShow === 0"
        />
        <SCImg
            class="object-contain rounded-2xl w-full min-w-[350px]"
            width="600"
            height="600"
            v-for="(node, i) in gallery.nodes"
            :key="i"
            :src="node.sourceUrl"
            v-show="imageToShow === i + 1"
        />
        <div v-if="gallery.nodes.length" class="my-4 gallery-images">
            <SCImg
                class="cursor-pointer rounded-2xl"
                width="110"
                height="140"
                :src="firstImage"
                @click.native="changeImage(null)"
            />
            <SCImg
                class="cursor-pointer rounded-2xl"
                width="110"
                height="140"
                v-for="(node, i) in gallery.nodes"
                :key="i"
                :src="node.sourceUrl"
                @click.native="changeImage(i + 1)"
            />
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