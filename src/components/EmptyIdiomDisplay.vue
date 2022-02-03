<script lang="ts" setup>
const emit = defineEmits(['click'])
</script>

<template>
  <div class="flex justify-center mt-1 *full-border">
    <div
      v-for="i in 4"
      :key="i"
      class="p-0.5 w-16 h-16"
      @click="emit('click')"
    />
  </div>
</template>
