<script setup lang="ts">
const props = defineProps<{ hints: string[] }>()
</script>

<template>
  <div class="flex flex-1">
    <div class="text-green-800 mt-1">
      提示：
    </div>
    <div v-if="hints.length === 0" class="text-gray-400 mt-1">
      暂无
    </div>
    <div class="flex flex-1 flex-wrap">
      <div
        v-for="hint in hints"
        :key="hint"
        class="*badge bg-green-500 text-gray-100"
      >
        {{ hint }}
      </div>
    </div>
  </div>
</template>
