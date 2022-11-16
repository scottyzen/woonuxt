<template>
  <div @click="toggleWishlist" class="cursor-pointer">
    <div class="relative inline-block">
      <div
        :class="{ active: isWishlisted, animate: isWishlisted }"
        @click="isWishlisted = !isWishlisted"
        class="button relative min-w-50px h-50px ml-4 rounded-md border border-[#e6e6e6] shadow cursor-pointer flex justify-center items-center"
      >
        <svg width="32px" height="24px">
          <g fill="none" fill-rule="evenodd">
            <path
              class="heart-stroke"
              d="M13.0185191,4.25291223 L12.9746137,4.25291223 C10.1097846,4.25291223 8.67188189,6.6128289 8.5182129,8.92335198 C8.39747298,10.6740809 8.73225185,12.8528876 14.0777375,18.4782704 C14.7127154,19.1080239 15.5654911,19.4695694 16.4596069,19.4880952 C17.3247917,19.4700909 18.1444718,19.0969678 18.7262246,18.4563177 C19.3189478,17.9074999 24.5052763,12.5894551 24.3570955,8.98921012 C24.2363556,6.42623084 22.123407,4.25291223 19.7525139,4.25291223 C18.5053576,4.22947431 17.3125171,4.76253118 16.4980242,5.70727948 C15.6177331,4.73767759 14.354699,4.20555668 13.04596,4.25291223 L13.0185191,4.25291223 Z"
              fill="#7c54b4"
            />
            <path
              class="heart-full"
              d="M13.0185191,4.25291223 L12.9746137,4.25291223 C10.1097846,4.25291223 8.67188189,6.6128289 8.5182129,8.92335198 C8.39747298,10.6740809 8.73225185,12.8528876 14.0777375,18.4782704 C14.7127154,19.1080239 15.5654911,19.4695694 16.4596069,19.4880952 C17.3247917,19.4700909 18.1444718,19.0969678 18.7262246,18.4563177 C19.3189478,17.9074999 24.5052763,12.5894551 24.3570955,8.98921012 C24.2363556,6.42623084 22.123407,4.25291223 19.7525139,4.25291223 C18.5053576,4.22947431 17.3125171,4.76253118 16.4980242,5.70727948 C15.6177331,4.73767759 14.354699,4.20555668 13.04596,4.25291223 L13.0185191,4.25291223 Z"
              fill="#7c54b4"
            />
            <path
              class="heart-lines"
              d="M26,4 L30.6852129,0.251829715"
              stroke="#7c54b4"
              stroke-width="2"
              stroke-linecap="round"
            />
            <path
              class="heart-lines"
              d="M2.314788,4 L7.00000086,0.251829715"
              stroke="#7c54b4"
              stroke-width="2"
              stroke-linecap="round"
              transform="matrix(-1 0 0 1 10.314788 1)"
            />
            <path
              class="heart-lines"
              d="M27,12 L33,12"
              stroke="#7c54b4"
              stroke-width="2"
              stroke-linecap="round"
            />
            <path
              class="heart-lines"
              d="M0,12 L6,12"
              stroke="#7c54b4"
              stroke-width="2"
              stroke-linecap="round"
              transform="matrix(-1 0 0 1 7 1)"
            />
            <path
              class="heart-lines"
              d="M24,19 L28.6852129,22.7481703"
              stroke="#7c54b4"
              stroke-width="2"
              stroke-linecap="round"
            />
            <path
              class="heart-lines"
              d="M4.314788,19 L9.00000086,22.7481703"
              stroke="#7c54b4"
              stroke-width="2"
              stroke-linecap="round"
              transform="matrix(-1 0 0 1 14.314788 1)"
            />
          </g>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    product: { type: Object, required: true },
  },
  methods: {
    addToWishlist() {
      this.$store.commit("addToWishlist", this.product);
    },
    removeFromWishlist() {
      this.$store.commit("removeFromWishlist", this.product);
    },
    toggleWishlist() {
      this.isWishlisted ? this.removeFromWishlist() : this.addToWishlist();
    }
  },
  computed: {
    isWishlisted() {
      return this.$store.state.wishlist?.some((product) => product.databaseId === this.product.databaseId);
    }
  }
};
</script>

<style lang="scss">
.heart- {
  &stroke {
    fill: none;
    stroke: #8c8c8c;
    stroke-width: 2px;
    opacity: 1;
    transform-origin: center center;
    .button.active & {
      opacity: 0;
    }
  }

  &full {
    opacity: 0;
    transform-origin: 50% 50%;

    .button.active & {
      opacity: 1;
    }
  }

  &lines {
    stroke-width: 2px;
    display: none;
  }
}
.button:not(.active):hover {
  .heart-stroke {
    animation: pulse 1s ease-out infinite;
  }
}

.button.animate {
  .heart-full {
    animation: heart 0.35s;
  }
  .heart-lines {
    animation: lines 0.2s ease-out forwards;
    display: block;
  }
}

@keyframes lines {
  0% {
    stroke-dasharray: 6;
    stroke-dashoffset: 16;
  }
  100% {
    stroke-dasharray: 13;
    stroke-dashoffset: 18;
  }
}

@keyframes heart {
  0% {
    transform: scale(1);
    transform-origin: center center;
    animation-timing-function: ease-out;
  }
  10% {
    transform: scale(1.2);
    animation-timing-function: ease-in;
  }
  35% {
    transform: scale(1);
    animation-timing-function: ease-out;
  }
  75% {
    transform: scale(1.1);
    animation-timing-function: ease-in;
  }
  100% {
    transform: scale(1);
    animation-timing-function: ease-out;
  }
}

@keyframes pulse {
  0% {
    opacity: 1;
    transform-origin: center center;
    transform: scale(1);
  }
  50% {
    stroke: #7c54b4;
    transform: scale(1.15);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>