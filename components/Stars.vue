<template>
  <div class="flex ml-2">
    <svg v-for="i in number" :key="i" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 512 512" fill="#FFC328">
      <path
        d="M394 480a16 16 0 01-9.39-3L256 383.76 127.39 477a16 16 0 01-24.55-18.08L153 310.35 23 221.2a16 16 0 019-29.2h160.38l48.4-148.95a16 16 0 0130.44 0l48.4 149H480a16 16 0 019.05 29.2L359 310.35l50.13 148.53A16 16 0 01394 480z"
      />
    </svg>
  </div>
</template>

<script>
export default {
  props: ["number"],
};
</script>
