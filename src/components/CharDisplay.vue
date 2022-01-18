<script setup lang="ts">
import type { CharGuessResult } from '@/interfaces/GuessResult'
import type { CharPinyin } from '@/interfaces/Pinyin'

const props = defineProps<{
  char: string
  pinyin: CharPinyin
  guessResults: CharGuessResult
}>()

</script>

<template>
  <div w-4>
    <div class="flex" w:text="blue-400">
      <div>{{ pinyin[0] }}</div>
      <div>{{ pinyin[1] }}</div>
    </div>
    <div>{{ char }}</div>
  </div>
</template>
