<template>
  <div class="flex-col flex">
    <div v-if="salePrice">
      <div class="flex justify-between flex-row items-baseline">
        <div class="flex flex-row items-baseline">
          <p class="text-2xl font-bold text-[#eb0037]">{{ salePrice }}</p>
          <p class="text-sm text-[#66676e] ml-2">VAT included</p>
        </div>
      </div>
      <div class="flex-wrap items-baseline flex-row flex">
        <p class="text-sm text-[#66676e]">Originally:</p>
        <p class="text-sm text-[#66676e] ml-1 line-through">
          {{ regularPrice }}
        </p>
        <p class="text-sm text-[#eb0037] ml-1">
          {{Math.round(((parseFloat(salePrice.replace(/[^0-9]/g, "")) - parseFloat(regularPrice.replace(/[^0-9]/g, ""))) / parseFloat(regularPrice.replace(/[^0-9]/g, ""))) * 100)
          }}%
        </p>
      </div>
    </div>
    <div v-else>
      <div class="flex justify-between flex-row items-baseline">
        <div class="flex flex-row items-baseline">
          <p class="text-2xl font-bold text-[#333]">{{ regularPrice }}</p>
          <p class="text-sm text-[#66676e] ml-2">VAT included</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    regularPrice: {
      type: String,
      required: true,
    },
    salePrice: {
      default: null,
    },
  },
};
</script>