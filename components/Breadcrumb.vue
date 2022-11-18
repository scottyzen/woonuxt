<template>
  <div class="flex text-sm text-dark-200 gap-1 items-center overflow-x-auto overflow-y-hidden">
    <div class="shadowBreadcrumb"></div>
    <span v-for="(link, i) in format" :key="link.name" class="flex items-center">
      <NuxtLink v-if="link.slug" :to="link.slug" class="hover:text-primary hover:underline">{{ link.name }}</NuxtLink>
      <span v-else class="text-dark-200 font-semibold truncate">{{ link.name }}</span>
      <span v-if="i + 1 < format.length" class="mx-2 w-1.25">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="63.925 63.925 224.1 384.1">
          <path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z" fill="#7f54b2"/>
        </svg>
      </span>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    format: { type: Array, default: [] },
  },
};
</script>
<style lang="scss">
.overflow-x-auto::-webkit-scrollbar {
  display: none;
}
.shadowBreadcrumb {
  background: -webkit-gradient(linear, left top, right top, color-stop(100%, hsl(0deg 0% 100%)), color-stop(0, #fff0));
  z-index: 1;
  position: absolute;
  height: 25px;
  pointer-events: none;
  width: 30px;
  right: 15px;
}
</style>