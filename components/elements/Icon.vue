<template>
  <svg v-if="name == 'filter'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <path
      d="M35.4 87.12l168.65 196.44A16.07 16.07 0 01208 294v119.32a7.93 7.93 0 005.39 7.59l80.15 26.67A7.94 7.94 0 00304 440V294a16.07 16.07 0 014-10.44L476.6 87.12A14 14 0 00466 64H46.05A14 14 0 0035.4 87.12z"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="32"
    />
  </svg>
  <svg v-else-if="name == 'back-arrow'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48" d="M244 400L100 256l144-144M120 256h292" />
  </svg>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true,
      default: "filter",
    },
  },
};
</script>

<style></style>
