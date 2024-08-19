<script setup lang="ts">
defineProps({
  size: { default: '20', type: String || Number },
  color: { default: '#4B5563', type: String },
  speed: { default: '250ms', type: String },
  stroke: { default: '2.5', type: String || Number },
});

const gradientId = useId();
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient :id="gradientId" x1="8.042%" y1="0%" x2="65.682%" y2="23.865%">
        <stop :stop-color="color" stop-opacity="0" offset="0%" />
        <stop :stop-color="color" stop-opacity=".631" offset="63.146%" />
        <stop :stop-color="color" offset="100%" />
      </linearGradient>
    </defs>
    <g fill="none" fill-rule="evenodd">
      <g transform="translate(1 1)">
        <path id="Oval-2" d="M36 18c0-9.94-8.06-18-18-18" :stroke="`url(#${gradientId})`" :stroke-width="stroke">
          <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" :dur="speed" repeatCount="indefinite" />
        </path>
        <circle fill="#fff" cx="36" cy="18" r="1">
          <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" :dur="speed" repeatCount="indefinite" />
        </circle>
      </g>
    </g>
  </svg>
</template>
