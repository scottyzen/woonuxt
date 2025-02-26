<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useHead } from '#app';

// Set page metadata
useHead({
  title: 'Contact Us - ModaPrime USA',
  meta: [
    { name: 'description', content: 'Get in touch with ModaPrime USA through our official contact channels.' }
  ]
});

const formData = ref({
  name: '',
  email: '',
  message: '',
  subject: '',
  phone: ''
});

const isSubmitting = ref(false);
const formStatus = ref({
  success: false,
  error: false,
  message: ''
});

// Get WordPress URL from environment
const wpUrl = ref('');
onMounted(() => {
  // This will be replaced with the actual WordPress URL from your environment
  wpUrl.value = process.env.NUXT_PUBLIC_WP_URL || '';
});

async function submitForm() {
  if (!formData.value.name || !formData.value.email || !formData.value.message) {
    formStatus.value = {
      success: false,
      error: true,
      message: 'Please fill out all required fields'
    };
    return;
  }
  
  isSubmitting.value = true;
  formStatus.value = {
    success: false,
    error: false,
    message: ''
  };
  
  try {
    // First try the local API endpoint
    const response = await fetch('/api/contact-us', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData.value)
    });
    
    const result = await response.json();
    
    if (result.success) {
      formStatus.value = {
        success: true,
        error: false,
        message: result.message || 'Thank you for your message. We will get back to you soon.'
      };
      // Reset form
      formData.value = {
        name: '',
        email: '',
        message: '',
        subject: '',
        phone: ''
      };
    } else {
      formStatus.value = {
        success: false,
        error: true,
        message: result.message || 'There was an error submitting your message'
      };
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    formStatus.value = {
      success: false,
      error: true,
      message: 'There was an error connecting to our server. Please try again later.'
    };
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div class="container my-12 md:my-16">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Contact Us</h1>
      
      <!-- Official Contact Channels -->
      <section class="mb-10">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Official Contact Channels</h2>
        <p class="text-gray-700 mb-6">
          For your security, please only use these official channels to contact ModaPrime USA:
        </p>
        
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
          <ul class="space-y-4">
            <li class="flex items-start">
              <div class="flex-shrink-0 mt-1">
                <Icon name="ion:globe-outline" class="text-blue-600" size="20" />
              </div>
              <div class="ml-3">
                <p class="font-medium">Official Website:</p>
                <a href="https://modaprimeusa.com" class="text-blue-600 hover:underline">modaprimeusa.com</a>
              </div>
            </li>
            <li class="flex items-start">
              <div class="flex-shrink-0 mt-1">
                <Icon name="ion:mail-outline" class="text-blue-600" size="20" />
              </div>
              <div class="ml-3">
                <p class="font-medium">Email:</p>
                <a href="mailto:modaprime@protonmail.com" class="text-blue-600 hover:underline">modaprime@protonmail.com</a>
              </div>
            </li>
            <li class="flex items-start">
              <div class="flex-shrink-0 mt-1">
                <Icon name="ion:paper-plane-outline" class="text-blue-600" size="20" />
              </div>
              <div class="ml-3">
                <p class="font-medium">Telegram:</p>
                <p class="text-blue-600">@EJ1994</p>
              </div>
            </li>
          </ul>
        </div>
      </section>
      
      <!-- Contact Form -->
      <section class="mb-10">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Send Us a Message</h2>
        
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <form @submit.prevent="submitForm">
            <!-- Status Messages -->
            <div v-if="formStatus.success" class="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
              <div class="flex">
                <div class="flex-shrink-0">
                  <Icon name="ion:checkmark-circle" class="text-green-600" size="20" />
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium">{{ formStatus.message }}</p>
                </div>
              </div>
            </div>
            
            <div v-if="formStatus.error" class="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
              <div class="flex">
                <div class="flex-shrink-0">
                  <Icon name="ion:alert-circle" class="text-red-600" size="20" />
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium">{{ formStatus.message }}</p>
                </div>
              </div>
            </div>
            
            <!-- Form Fields -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name <span class="text-red-500">*</span></label>
                <input 
                  type="text" 
                  id="name" 
                  v-model="formData.name" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email <span class="text-red-500">*</span></label>
                <input 
                  type="email" 
                  id="email" 
                  v-model="formData.email" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Phone (optional)</label>
                <input 
                  type="tel" 
                  id="phone" 
                  v-model="formData.phone" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label for="subject" class="block text-sm font-medium text-gray-700 mb-1">Subject (optional)</label>
                <input 
                  type="text" 
                  id="subject" 
                  v-model="formData.subject" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div class="mb-6">
              <label for="message" class="block text-sm font-medium text-gray-700 mb-1">Message <span class="text-red-500">*</span></label>
              <textarea 
                id="message" 
                v-model="formData.message" 
                rows="5" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              ></textarea>
            </div>
            
            <div class="flex justify-end">
              <button 
                type="submit" 
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                :disabled="isSubmitting"
              >
                <span v-if="isSubmitting" class="mr-2">
                  <Icon name="ion:reload-outline" class="animate-spin" size="16" />
                </span>
                <span v-if="isSubmitting">Sending...</span>
                <span v-else>Send Message</span>
              </button>
            </div>
          </form>
        </div>
      </section>
      
      <!-- Security Reminder -->
      <div class="bg-gray-50 p-5 rounded-lg border border-gray-200">
        <div class="flex items-start">
          <div class="flex-shrink-0 mt-0.5">
            <Icon name="ion:shield-checkmark-outline" class="text-blue-600" size="20" />
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-gray-900">Security Reminder</h3>
            <p class="text-xs text-gray-600 mt-1">
              For your security, please only communicate with us through our official channels. Never share sensitive information via email or messaging platforms.
            </p>
            <p class="text-xs text-gray-600 mt-2">
              <NuxtLink to="/security" class="text-blue-600 hover:underline">View our security information</NuxtLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
