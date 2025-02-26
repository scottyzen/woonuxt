<script setup lang="ts">
// Set page metadata
try {
  definePageMeta({
    title: 'Contact Us',
    description: 'Get in touch with ModaPrime USA through our official channels.'
  });
} catch (e) {
  // Handle error if definePageMeta is not available
}
</script>

<template>
  <div class="container my-12 md:my-16">
    <div class="max-w-3xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Contact Us</h1>
      
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Official Contact Channels</h2>
        
        <div class="space-y-6">
          <div class="flex items-start">
            <div class="flex-shrink-0 mt-1">
              <Icon name="ion:globe-outline" class="text-blue-600" size="24" />
            </div>
            <div class="ml-4">
              <h3 class="font-medium text-gray-900">Website</h3>
              <p class="text-gray-700">
                <a href="https://modaprimeusa.com" class="text-blue-600 hover:underline">modaprimeusa.com</a>
              </p>
            </div>
          </div>
          
          <div class="flex items-start">
            <div class="flex-shrink-0 mt-1">
              <Icon name="ion:mail-outline" class="text-blue-600" size="24" />
            </div>
            <div class="ml-4">
              <h3 class="font-medium text-gray-900">Email</h3>
              <p class="text-gray-700">
                <a href="mailto:prime@protonmail.com" class="text-blue-600 hover:underline">prime@protonmail.com</a>
              </p>
            </div>
          </div>
          
          <div class="flex items-start">
            <div class="flex-shrink-0 mt-1">
              <Icon name="ion:paper-plane-outline" class="text-blue-600" size="24" />
            </div>
            <div class="ml-4">
              <h3 class="font-medium text-gray-900">Telegram</h3>
              <p class="text-gray-700">
                <a href="https://t.me/EJ1994" class="text-blue-600 hover:underline">@EJ1994</a>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Send Us a Message</h2>
        
        <form class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input 
              type="text" 
              id="name" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Your name"
            />
          </div>
          
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              id="email" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Your email address"
            />
          </div>
          
          <div>
            <label for="message" class="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea 
              id="message" 
              rows="4" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="How can we help you?"
            ></textarea>
          </div>
          
          <div>
            <button 
              type="submit" 
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
      
      <div class="mt-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div class="flex items-start">
          <div class="flex-shrink-0 mt-1">
            <Icon name="ion:information-circle-outline" class="text-blue-600" size="20" />
          </div>
          <div class="ml-3">
            <p class="text-sm text-gray-700">
              For your security, please verify you're communicating with our official channels only. We will never ask for sensitive information via email or messaging platforms.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
