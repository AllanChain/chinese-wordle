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
  <div class="flex justify-center my-1 *full-border">
    <CharDisplay
      v-for="(char, i) in chars"
      :key="i"
      :char="char.char"
      :pinyin="char.pinyin"
      :guess-results="char.guessResults"
    />
  </div>
</template>

<style>
.full-divide > :not([hidden]) {
  border-width: 2px;
  border-left-width: 0px;
  border-color: yellow;
}
.full-divide > :not([hidden]):first-child {
  border-left-width: 2px;
}
</style>
