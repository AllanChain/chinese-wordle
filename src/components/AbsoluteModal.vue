<script setup lang="ts">
import FadeTransition from './FadeTransition.vue'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits(['update:modelValue'])
</script>
<template>
  <FadeTransition>
    <div
      v-if="modelValue"
      class="absolute w-full h-full flex justify-center items-center z-10"
      w:bg="opacity-25 black"
      @click="emit('update:modelValue', !modelValue)"
    >
      <slot />
    </div>
  </FadeTransition>
</template>
