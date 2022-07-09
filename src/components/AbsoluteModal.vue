<script setup lang="ts">
import { Icon } from '@iconify/vue'
import FadeTransition from './FadeTransition.vue'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <FadeTransition>
    <div
      v-if="modelValue"
      class="fixed w-full h-full flex justify-center items-center z-10"
      w:bg="opacity-25 black"
      @click.self="emit('update:modelValue', !modelValue)"
    >
      <div
        class="relative bg-white dark:bg-gray-800 rounded-lg mx-3 max-w-md p-2"
        w:border="t-9 teal-600"
        w:shadow="lg gray-500 dark:dark-900"
      >
        <div class="absolute right-4 top-2">
          <Icon
            class="text-xl text-red-900 dark:text-red-500"
            icon="mdi:close-circle-outline"
            @click="emit('update:modelValue', !modelValue)"
          />
        </div>
        <slot />
      </div>
    </div>
  </FadeTransition>
</template>
