<script setup lang="ts">
import { useHead } from '#app';

useHead({
  title: 'Security Information - ModaPrime USA',
  meta: [
    { name: 'description', content: 'Learn about secure shopping practices and how to protect yourself when shopping with ModaPrime USA.' }
  ]
});
</script>

<template>
  <div class="container my-12 md:my-16">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Security Information</h1>
      
      <div class="bg-blue-50 border-l-4 border-blue-600 p-4 mb-8">
        <div class="flex">
          <div class="flex-shrink-0">
            <Icon name="ion:information-circle" class="text-blue-600" size="24" />
          </div>
          <div class="ml-3">
            <p class="text-sm text-blue-800 font-medium">
              Important Security Notice
            </p>
            <p class="text-sm text-blue-700 mt-1">
              We've received reports of unauthorized websites impersonating ModaPrime USA. Please verify you're on our official website and review our security guidelines below.
            </p>
          </div>
        </div>
      </div>
      
      <section class="mb-10">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Official ModaPrime USA Channels</h2>
        <p class="text-gray-700 mb-4">
          To ensure you're dealing with the authentic ModaPrime USA, please verify our official communication channels:
        </p>
        
        <div class="bg-white p-5 rounded-lg shadow-sm border border-gray-100 mb-6">
          <div class="flex items-center mb-3">
            <Icon name="ion:checkmark-circle" class="text-green-600 mr-2" size="20" />
            <h3 class="font-medium text-gray-900">Our Official Channels</h3>
          </div>
          <ul class="space-y-3 text-sm text-gray-700">
            <li class="flex items-start">
              <span class="text-green-500 mr-2 mt-0.5">✓</span>
              <div>
                <p class="font-medium">Official website:</p>
                <p class="font-bold text-blue-700">modaprimeusa.com</p>
                <p class="text-xs text-gray-500 mt-1">Always check the URL in your browser's address bar before making any payments</p>
              </div>
            </li>
            <li class="flex items-start">
              <span class="text-green-500 mr-2 mt-0.5">✓</span>
              <div>
                <p class="font-medium">Official email address:</p>
                <p class="font-bold text-blue-700">modaprime@protonmail.com</p>
                <p class="text-xs text-gray-500 mt-1">We will only communicate with you from this email address</p>
              </div>
            </li>
            <li class="flex items-start">
              <span class="text-green-500 mr-2 mt-0.5">✓</span>
              <div>
                <p class="font-medium">Official Telegram:</p>
                <p class="font-bold text-blue-700">@EJ1994</p>
                <p class="text-xs text-gray-500 mt-1">Our only official Telegram account for customer communications</p>
              </div>
            </li>
          </ul>
        </div>
        
        <div class="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
          <div class="flex items-center mb-3">
            <Icon name="ion:alert-circle-outline" class="text-amber-600 mr-2" size="20" />
            <h3 class="font-medium text-gray-900">Be Cautious Of</h3>
          </div>
          <ul class="space-y-2 text-sm text-gray-700">
            <li class="flex items-start">
              <span class="text-amber-500 mr-2">•</span>
              <span>Websites with URLs that look similar but are not exactly <strong>modaprimeusa.com</strong></span>
            </li>
            <li class="flex items-start">
              <span class="text-amber-500 mr-2">•</span>
              <span>Communications from email addresses that are not <strong>modaprime@protonmail.com</strong></span>
            </li>
            <li class="flex items-start">
              <span class="text-amber-500 mr-2">•</span>
              <span>Telegram accounts that are not <strong>@EJ1994</strong> claiming to represent us</span>
            </li>
            <li class="flex items-start">
              <span class="text-amber-500 mr-2">•</span>
              <span>Websites with designs that differ from our official site</span>
            </li>
            <li class="flex items-start">
              <span class="text-amber-500 mr-2">•</span>
              <span>Individuals claiming to be sales representatives handling "closing sales"</span>
            </li>
            <li class="flex items-start">
              <span class="text-amber-500 mr-2">•</span>
              <span>Requests for rushed Bitcoin or cryptocurrency payments</span>
            </li>
          </ul>
        </div>
      </section>
      
      <section class="mb-10">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Secure Shopping Practices</h2>
        
        <div class="space-y-4">
          <div class="bg-white p-4 rounded-lg border border-gray-200">
            <h3 class="font-medium text-gray-900 mb-2 flex items-center">
              <Icon name="ion:eye" class="text-blue-600 mr-2" size="18" />
              Verify Website Authenticity
            </h3>
            <p class="text-sm text-gray-700">
              Before making any payments, always check that you're on <strong>https://modaprimeusa.com</strong>. Look for the padlock icon in your browser's address bar indicating a secure connection.
            </p>
          </div>
          
          <div class="bg-white p-4 rounded-lg border border-gray-200">
            <h3 class="font-medium text-gray-900 mb-2 flex items-center">
              <Icon name="ion:mail" class="text-blue-600 mr-2" size="18" />
              Confirm Email Addresses
            </h3>
            <p class="text-sm text-gray-700">
              Our official email address is <strong>modaprimeusa@protonmail.com</strong>. Be cautious of emails from addresses that look similar but aren't exactly the same.
            </p>
          </div>
          
          <div class="bg-white p-4 rounded-lg border border-gray-200">
            <h3 class="font-medium text-gray-900 mb-2 flex items-center">
              <Icon name="ion:time" class="text-blue-600 mr-2" size="18" />
              Take Your Time
            </h3>
            <p class="text-sm text-gray-700">
              Never rush into making payments. Take your time to verify all details. Legitimate businesses understand the importance of security and won't pressure you to act immediately.
            </p>
          </div>
          
          <div class="bg-white p-4 rounded-lg border border-gray-200">
            <h3 class="font-medium text-gray-900 mb-2 flex items-center">
              <Icon name="ion:call" class="text-blue-600 mr-2" size="18" />
              Contact Us If Uncertain
            </h3>
            <p class="text-sm text-gray-700">
              If you receive communications that seem suspicious, contact us directly through our official channels to verify before taking any action.
            </p>
          </div>
        </div>
      </section>
      
      <section class="mb-10">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">If You Have Security Concerns</h2>
        <p class="text-gray-700 mb-6">
          If you believe you've encountered a website or individual impersonating ModaPrime USA:
        </p>
        
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <ol class="space-y-4 text-gray-700">
            <li class="flex items-start">
              <span class="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 flex-shrink-0">1</span>
              <div>
                <p class="font-medium">Pause any transaction</p>
                <p class="text-sm text-gray-600 mt-1">Do not send payments if you have any doubts about the authenticity of the website or communication.</p>
              </div>
            </li>
            <li class="flex items-start">
              <span class="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 flex-shrink-0">2</span>
              <div>
                <p class="font-medium">Report it to us at <a href="mailto:modaprime@protonmail.com" class="text-blue-600 hover:underline">modaprime@protonmail.com</a></p>
                <p class="text-sm text-gray-600 mt-1">Include screenshots of communications and the website if possible.</p>
              </div>
            </li>
            <li class="flex items-start">
              <span class="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 flex-shrink-0">3</span>
              <div>
                <p class="font-medium">Document the incident</p>
                <p class="text-sm text-gray-600 mt-1">Keep records of any suspicious communications or websites for your reference.</p>
              </div>
            </li>
            <li class="flex items-start">
              <span class="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 flex-shrink-0">4</span>
              <div>
                <p class="font-medium">Contact our support team</p>
                <p class="text-sm text-gray-600 mt-1">We can verify if communications were legitimate and provide guidance on next steps.</p>
              </div>
            </li>
          </ol>
        </div>
      </section>
      
      <div class="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
        <h2 class="text-lg font-medium text-gray-900 mb-2">Need Additional Help?</h2>
        <p class="text-gray-700 mb-4">Our customer support team is available to assist with any security concerns or to verify legitimate communications.</p>
        <NuxtLink to="/contact-us" class="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Contact Support
        </NuxtLink>
      </div>
    </div>
  </div>
</template> 
