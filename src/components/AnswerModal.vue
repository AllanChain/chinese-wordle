<script setup lang="ts">
import { computed, ref } from 'vue'
import AbsoluteModal from './AbsoluteModal.vue'
import CharDisplay from './CharDisplay.vue'

const props = defineProps<{ answer: string; answerPinyin: string }>()
const show = ref(true)

const chars = computed(() => {
  return props.answerPinyin.split(' ').map((pinyin, i) => ({
    char: props.answer.charAt(i),
    pinyin,
  }))
})
</script>

<template>
  <AbsoluteModal v-model="show">
    <div
      class="bg-white rounded-lg mx-auto max-w-md p-2"
      w:border="t-9 teal-600"
    >
      <h1 class="text-lg text-center mb-2">
        待猜成语
      </h1>
      <div class="flex justify-center">
        <CharDisplay
          v-for="(char, i) in chars"
          :key="i"
          :char="char.char"
          :pinyin="char.pinyin"
        />
      </div>
    </div>
  </AbsoluteModal>
</template>