<script setup lang="ts">
import { ref } from 'vue'
import AbsoluteModal from './AbsoluteModal.vue'

const show = ref(true)

</script>

<template>
  <AbsoluteModal v-model="show">
    <div class="px-4">
      <h1 class="text-xl text-center mb-2">
        关于
      </h1>
      <p>
        <b>太长不看：</b>
        这是一个根据声母和韵母猜成语的小游戏。必须输入一个合法的成语。
      </p>
      <h2 class="font-bold text-center my-2">
        颜色
      </h2>
      <p>
        如果你猜的成语中某一个声母或韵母：
        <ul class="list-circle list-inside my-1">
          <li>位置与待猜成语相同，它就会被标成绿色</li>
          <li>出现在待猜成语中但位置错误，就是黄色</li>
          <li>韵母组合正确，会加上绿色双下划线</li>
          <li>压根没出现在待猜成语中，就是灰色</li>
        </ul>
      </p>
      <p>在下方的输入框中输入任意一个四字成语开始游戏。</p>
    </div>
  </AbsoluteModal>
</template>
