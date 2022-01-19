<script setup lang="ts">
const props = defineProps<{ hints: string[] }>()
</script>

<template>
  <div class="flex my-2">
    <div>提示</div>
    <div
      v-for="hint in hints"
      :key="hint"
      class="rounded-full bg-green-500 px-2 mx-1 text-gray-100"
    >
      {{ hint }}
    </div>
  </div>
</template>
