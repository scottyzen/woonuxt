<script setup>
const { toggleBodyClass, removeBodyClass } = useHelpers();
onBeforeUnmount(() => {
  removeBodyClass('show-mobile-menu');
});
</script>

<template>
  <div>
    <svg
      width="24"
      height="24"
      class="cursor-pointer mr-4"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      @click="toggleBodyClass('show-mobile-menu')">
      <path
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-miterlimit="10"
        stroke-width="32"
        d="M80 160h352M80 256h352M80 352h352" />
    </svg>
  </div>
</template>
