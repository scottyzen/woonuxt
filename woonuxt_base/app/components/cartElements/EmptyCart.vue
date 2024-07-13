<script setup lang="ts">
const { emptyCart } = useCart();
</script>

<template>
  <button class="cursor-pointer top-6 right-6 md:right-8 absolute" title="Empty Cart" @click="emptyCart">
    <TrashIcon />
  </button>
</template>
