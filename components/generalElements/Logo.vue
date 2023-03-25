<script setup>
const runtimeConfig = useRuntimeConfig();
const logoUrl = runtimeConfig?.public?.LOGO || null;
</script>

<template>
  <NuxtLink to="/">
    <img v-if="logoUrl" :src="logoUrl" alt="Logo" class="object-contain h-10" />
    <div v-else class="flex font-bold text-lg gap-2 items-center">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 124 124" transform="scale(1 -1)">
        <path
          fill="#AE7DDD"
          fill-rule="evenodd"
          d="M55.75 27.155c-3.222-5.54-11.278-5.54-14.5 0L6.134 87.535C2.912 93.075 6.94 100 13.384 100h27.413c-2.753-2.407-3.773-6.57-1.69-10.142L65.704 44.27 55.75 27.155z"
          clip-rule="evenodd" />
        <path fill="#7F54B2" d="M78 40.4c2.667-4.533 9.333-4.533 12 0l29.06 49.4c2.667 4.533-.666 10.199-5.999 10.199H54.938c-5.333 0-8.666-5.666-6-10.199L78 40.4z" />
      </svg>
      <span>WooNuxt</span>
    </div>
  </NuxtLink>
</template>
