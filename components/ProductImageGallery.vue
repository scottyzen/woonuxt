<template>
  <div class="relative pointer-events-auto">
    <div class="flex h-full items-center border-b border-[#e6e6e6] overflow-auto md:border md:rounded-[1.25rem] md:w-[400px] lg:w-[500px]">
      <NuxtImg
        fit="outside"
        format="webp"
        width="600px"
        :src="activeImg"
        class="w-full object-center transform"
        alt="Main Product Image"
        placeholder
      />
    </div>

    <div class="bullets-wrapper">
      <div class="bullets-container gap-2">
        <NuxtImg 
          v-for="(img, i) in gallery.nodes" 
          :key="`image-${i}`"
          fit="outside"
          format="webp"
          width="600px"
          :alt="`Product thumbnail #${i}`"
          :src="img.sourceUrl"
          placeholder
          class="w-5 rounded-sm sm:w-10 md:w-6 lg:w-8"
          @mouseover="currentThumbnail(img.sourceUrl, i)"
          :class="[activeThumb == i ? 'focused': '']"
          />
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
    currentThumbnail: function (img, i) {
      this.activeImg = img;
      this.activeThumb = i;
    }
  }
};
</script>
<style lang="scss">
.focused {
  opacity: 0.4
}
.bullets-wrapper {
    padding: 0.5rem;
    background-color: hsla(0,0%,100%,.7);
    border-radius: 0.875rem;
    position: absolute;
    left: 50%;
    bottom: 0.563rem;
    transform: translate(-50%);
}
.bullets-wrapper .bullets-container {
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    border-radius: 0.5rem;
}
</style>