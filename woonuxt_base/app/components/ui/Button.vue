<script setup lang="ts">
import { twMerge } from 'tailwind-merge';

interface Props {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  to?: string;
  icon?: string;
  iconPosition?: 'left' | 'right';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  iconPosition: 'left',
});

// Get custom classes from attrs
const attrs = useAttrs();

// Computed component type based on props and attrs
const componentType = computed(() => {
  if (props.to) return resolveComponent('NuxtLink');
  if (attrs.href) return 'a';
  return 'button';
});

// Base classes that apply to all buttons
const baseClasses =
  'inline-flex items-center justify-center cursor-pointer gap-2 font-semibold transition-all rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none';

// Variant-specific classes
const variantClasses = computed(() => {
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark/90 focus:ring-primary/50 shadow-sm active:bg-primary-dark active:focus:ring-primary-dark',
    secondary: 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 focus:ring-gray-400',
    danger: 'bg-red-600 dark:bg-red-700 text-white hover:bg-red-700 dark:hover:bg-red-800 focus:ring-red-500 shadow-sm',
    ghost: 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-400',
    outline:
      'bg-transparent border-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 focus:ring-gray-400',
  };
  return variants[props.variant];
});

// Size-specific classes
const sizeClasses = computed(() => {
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2 text-base',
    lg: 'px-8 py-3 text-lg',
  };
  return sizes[props.size];
});

// Icon size based on button size
const iconSize = computed(() => {
  const sizes = {
    sm: '16',
    md: '18',
    lg: '20',
  };
  return sizes[props.size];
});

// All button classes combined with tailwind-merge to handle custom class overrides
const buttonClasses = computed(() => twMerge(baseClasses, variantClasses.value, sizeClasses.value, (attrs.class as string) || ''));

// Component attrs - merge $attrs with our custom attrs, excluding class (handled separately)
const componentAttrs = computed(() => {
  const { class: _, ...restAttrs } = attrs;
  const componentAttrs: Record<string, any> = { ...restAttrs };

  if (componentType.value === 'button') {
    // Default type to 'button' if not provided
    componentAttrs.type = attrs.type || 'button';
    // Disable if loading or if disabled attr is passed
    componentAttrs.disabled = props.loading || attrs.disabled;
  } else if (props.to) {
    componentAttrs.to = props.to;
  }

  return componentAttrs;
});
</script>

<template>
  <component :is="componentType" v-bind="componentAttrs" :class="buttonClasses">
    <!-- Loading Icon -->
    <LoadingIcon v-if="loading" :size="iconSize" color="currentColor" stroke="4" />

    <!-- Left Icon -->
    <Icon v-if="icon && iconPosition === 'left' && !loading" :name="icon" :size="iconSize" />

    <!-- Default Slot for button content -->
    <slot />

    <!-- Right Icon -->
    <Icon v-if="icon && iconPosition === 'right' && !loading" :name="icon" :size="iconSize" />
  </component>
</template>
