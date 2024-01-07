<script setup lang="ts">
const { info } = defineProps({
  info: { type: Object, required: true },
});
</script>

<template>
  <div>
    <Head>
      <Title>{{ info.name }}</Title>
      <Meta name="description" hid="description" :content="info.shortDescription ?? ''" />
    </Head>
  </div>
</template>
