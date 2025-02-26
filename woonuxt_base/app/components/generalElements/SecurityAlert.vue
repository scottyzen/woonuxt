<script setup lang="ts">
import { ref } from 'vue';

const showAlert = ref(true);

const closeAlert = () => {
  showAlert.value = false;
};
</script>

<template>
  <Transition name="fade">
    <div 
      v-if="showAlert" 
      class="fixed bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-sm w-full border-l-4 border-blue-600 z-50"
    >
      <div class="flex items-start">
        <div class="flex-shrink-0 mt-0.5">
          <Icon name="ion:information-circle" class="text-blue-600" size="20" />
        </div>
        <div class="ml-3 flex-1 pr-6">
          <h3 class="font-medium text-gray-900 text-sm">Verify Your Connection</h3>
          <div class="mt-1">
            <p class="text-xs text-gray-600">
              For your security, please ensure you're on our official website and verify our contact information:
            </p>
            <ul class="mt-1 space-y-1">
              <li class="flex items-center text-xs">
                <Icon name="ion:checkmark-circle" class="text-green-600 mr-1" size="12" />
                <span>Website: <span class="font-medium">modaprimeusa.com</span></span>
              </li>
              <li class="flex items-center text-xs">
                <Icon name="ion:checkmark-circle" class="text-green-600 mr-1" size="12" />
                <span>Email: <span class="font-medium">modaprime@protonmail.com</span></span>
              </li>
              <li class="flex items-center text-xs">
                <Icon name="ion:checkmark-circle" class="text-green-600 mr-1" size="12" />
                <span>Telegram: <span class="font-medium">@EJ1994</span></span>
              </li>
            </ul>
            <p class="text-xs text-gray-600 mt-1">
              <NuxtLink to="/security" class="text-blue-600 hover:underline">Learn more about secure shopping →</NuxtLink>
            </p>
          </div>
        </div>
        <button 
          @click="closeAlert" 
          class="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          aria-label="Close alert"
        >
          <Icon name="ion:close-outline" size="18" />
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style> 
