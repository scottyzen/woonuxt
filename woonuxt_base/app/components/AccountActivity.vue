<script setup lang="ts">
const { formatDate } = useHelpers();

// Mock activity data - in production this would come from backend
const activities = ref([
  {
    id: 1,
    type: 'order',
    title: 'Order placed',
    description: 'Order #10245 for $156.99',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    icon: 'ion:cart-outline',
    iconColor: 'text-green-600',
    iconBg: 'bg-green-50',
  },
  {
    id: 2,
    type: 'login',
    title: 'Successful login',
    description: 'Chrome on macOS • New York, US',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    icon: 'ion:log-in-outline',
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-50',
  },
  {
    id: 3,
    type: 'address',
    title: 'Shipping address updated',
    description: '123 Main Street, New York, NY 10001',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    icon: 'ion:location-outline',
    iconColor: 'text-purple-600',
    iconBg: 'bg-purple-50',
  },
  {
    id: 4,
    type: 'wishlist',
    title: 'Added to wishlist',
    description: 'Vintage Leather Jacket',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    icon: 'ion:heart-outline',
    iconColor: 'text-red-600',
    iconBg: 'bg-red-50',
  },
  {
    id: 5,
    type: 'password',
    title: 'Password changed',
    description: 'Account security updated',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    icon: 'ion:shield-checkmark-outline',
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-50',
  },
  {
    id: 6,
    type: 'order',
    title: 'Order delivered',
    description: 'Order #10198 successfully delivered',
    timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    icon: 'ion:checkmark-circle-outline',
    iconColor: 'text-green-600',
    iconBg: 'bg-green-50',
  },
  {
    id: 7,
    type: 'login',
    title: 'Successful login',
    description: 'Safari on iPhone • San Francisco, US',
    timestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days ago
    icon: 'ion:log-in-outline',
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-50',
  },
  {
    id: 8,
    type: 'profile',
    title: 'Profile updated',
    description: 'Personal information changed',
    timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
    icon: 'ion:person-outline',
    iconColor: 'text-indigo-600',
    iconBg: 'bg-indigo-50',
  },
]);

const selectedFilter = ref('all');
const filters = [
  { value: 'all', label: 'All Activity' },
  { value: 'order', label: 'Orders' },
  { value: 'login', label: 'Security' },
  { value: 'profile', label: 'Profile' },
  { value: 'wishlist', label: 'Wishlist' },
];

const filteredActivities = computed(() => {
  if (selectedFilter.value === 'all') return activities.value;
  return activities.value.filter((activity) => activity.type === selectedFilter.value);
});

const getRelativeTime = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
  return formatDate(timestamp);
};
</script>

<template>
  <div>
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Account Activity</h1>
      <p class="text-gray-600 dark:text-gray-400">Track your account activity, logins, and important events</p>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6">
      <div class="flex flex-wrap gap-2">
        <button
          v-for="filter in filters"
          :key="filter.value"
          @click="selectedFilter = filter.value"
          class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
          :class="
            selectedFilter === filter.value
              ? 'bg-primary text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          ">
          {{ filter.label }}
        </button>
      </div>
    </div>

    <!-- Activity Timeline -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
      <div class="p-6 md:px-8 pb-4 border-b border-gray-100 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
      </div>

      <div class="p-6 md:p-8">
        <div v-if="filteredActivities.length" class="space-y-6">
          <div v-for="(activity, index) in filteredActivities" :key="activity.id" class="flex gap-4 relative">
            <!-- Timeline Line -->
            <div
              v-if="index !== filteredActivities.length - 1"
              class="absolute left-5 top-12 w-0.5 h-full bg-gray-200 dark:bg-gray-600"
              style="transform: translateX(-50%)"></div>

            <!-- Icon -->
            <div class="shrink-0">
              <div class="w-10 h-10 rounded-full flex items-center justify-center" :class="activity.iconBg">
                <Icon :name="activity.icon" size="20" :class="activity.iconColor" />
              </div>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0 pt-0.5">
              <div class="flex items-start justify-between gap-4 mb-1">
                <h4 class="font-semibold text-gray-900 dark:text-white">{{ activity.title }}</h4>
                <time class="text-sm text-gray-500 dark:text-gray-400 shrink-0">{{ getRelativeTime(activity.timestamp) }}</time>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ activity.description }}</p>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-12 text-gray-500 dark:text-gray-400">No activity found for this filter</div>
      </div>

      <!-- Footer with export option -->
      <div class="p-6 pt-4 bg-gray-50 dark:bg-gray-800 rounded-b-lg border-t border-gray-100 dark:border-gray-700">
        <button class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 flex items-center gap-2 transition-colors">
          <Icon name="ion:download-outline" size="18" />
          <span>Export activity log</span>
        </button>
      </div>
    </div>
  </div>
</template>
