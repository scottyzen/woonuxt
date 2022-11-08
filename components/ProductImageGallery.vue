<template>
  <div class="md:w-[500px]">
    <div class="rounded-2xl overflow-hidden border border-[#e6e6e6]">
      <NuxtImg
        fit="outside"
        format="webp"
        width="500"
        :src="activeImg"
        class="w-full object-center transform"
        alt="Main Product Image"
        placeholder
      />
    </div>

    <div class="flex mt-4 gap-5 relative justify-center">
      <div v-for="(img, i) in gallery.nodes" :key="`image-${i}`">
        <div :class="{ focused: i === activeThumb}" class="rounded-xl overflow-hidden border border-[#e6e6e6] w-full h-full">
          <NuxtImg
            fit="outside"
            format="webp"
            width="500"
            :src="img.sourceUrl"
            :alt="`Product thumbnail #${i}`"
            class="w-12 h-full object-cover cursor-pointer"
            @mouseover="changeActiveImg(i), selectedThumb(i)"
            placeholder
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeThumb: 0
    }
  },
  props: [
    "activeImg",
    "gallery"
  ],
  methods: {
    changeActiveImg(i) {
      this.activeImg = this.gallery.nodes[i].sourceUrl;
    },
    selectedThumb(i) {
      this.activeThumb = i;
    }
  }
};
</script>
<style>
.focused {
  outline-color: #ae7ddd;
  outline-style: auto;
  opacity: 0.75
}
</style>