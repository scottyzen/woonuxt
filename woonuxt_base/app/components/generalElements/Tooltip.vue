<script setup lang="ts">
const { text } = defineProps({ text: { type: String, required: true } });
</script>

<template>
  <div class="tooltip-wrapper">
    <slot></slot>
    <div class="tooltip">{{ text }}</div>
  </div>
</template>
  
  <style scoped>
.tooltip-wrapper {
  position: relative;
  display: inline-block;
}

.tooltip {
  visibility: hidden;
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;
  text-align: center;
  border-radius: 4px;
  padding: 5px 10px;
  position: absolute;
  z-index: 1;
  bottom: 140%;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.3s;
  white-space: nowrap;
}

.tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -7px;
  border-width: 7px;
  border-style: solid;
  border-color: rgba(0, 0, 0, 0.8) transparent transparent transparent;
}

.tooltip-wrapper:hover .tooltip {
  visibility: visible;
  opacity: 1;
}
</style>
  