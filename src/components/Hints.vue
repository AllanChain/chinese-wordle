<script setup lang="ts">
const props = defineProps<{ hints: string[] }>()
</script>

<template>
  <div class="flex flex-1 my-2">
    <div>提示</div>
    <div
      v-for="hint in hints"
      :key="hint"
      class="*badge bg-green-500 text-gray-100"
    >
      {{ hint }}
    </div>
  </div>
</template>
