<script setup lang="ts">
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
        class="bg-white rounded-lg mx-3 max-w-md p-2"
        w:border="t-9 teal-600"
        w:shadow="lg gray-500"
      >
        <slot />
      </div>
    </div>
  </FadeTransition>
</template>
