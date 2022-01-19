<script setup lang="ts">
import { computed } from 'vue'
import CharDisplay from './CharDisplay.vue'
import type { IdiomGuessResult } from '@/stores/guess'
import type { IdiomPinyin } from '@/pinyin'

const props = defineProps<{
  idiom: string
  pinyin: IdiomPinyin
  guessResults: IdiomGuessResult
}>()

const chars = computed(
  () => props.pinyin.map((pinyin, i) => ({
    char: props.idiom.charAt(i),
    pinyin,
    guessResults: props.guessResults[i],
  })),
)
</script>

<template>
  <div class="flex justify-center">
    <CharDisplay
      v-for="(char, i) in chars"
      :key="i"
      :char="char.char"
      :pinyin="char.pinyin"
      :guess-results="char.guessResults"
    />
  </div>
</template>
