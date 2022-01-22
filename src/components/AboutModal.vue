<script setup lang="ts">
import { ref } from 'vue'
import AbsoluteModal from './AbsoluteModal.vue'

const show = ref(true)

</script>

<template>
  <AbsoluteModal v-model="show">
    <div class="px-4">
      <h1 class="text-lg text-center mb-2">
        关于
      </h1>
      <p>在下方的输入框中输入任意一个四字成语开始游戏。</p>
    </div>
  </AbsoluteModal>
</template>
