<template>
  <button
    type="submit"
    class="trnstn w-full h-50px border rounded-md text-xl tracking-wide cursor-pointer overflow-hidden font-semibold border-[#7C54B4] bg-[#7C54B4] hover:bg-[#AC7CDB] text-white"
    :class="{ disabled: disabled }"
    :disabled="disabled"
  >
    <span>{{ addToCartButtonText }}</span>
  </button>
</template>

<script>
export default {
  props: ["addToCartButtonText", "disabled"],
};
</script>
<style lang="scss">
.trnstn {
  transition: all 0.3s ease-in-out;
}
.success,
.success:hover {
  background-color: #46af62;
  border-color: #fff;
}
</style>