<template>
  <section class="bg-white flex flex-col max-w-lg shadow-lg top-0 right-0 bottom-0 w-9/10 fixed overflow-x-hidden">
    <CloseModals class="bg-white rounded-xl shadow-xl p-1.5" />
    <div class="mt-8 text-center">Menu</div>
    <MenuItems class="m-4 grid p-8 text-gray-500 gap-6" />
  </section>
</template>

<script>
export default {
  methods: {
    closeCart() {
      this.$store.commit("toggleMenu", false);
    },
  },
};
</script>

<style scoped>
section {
  background: linear-gradient(#fff, #ececf1);
}
</style>
