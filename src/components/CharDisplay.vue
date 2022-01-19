<script setup lang="ts">
import { computed } from 'vue'
import { GuessResult } from '@/stores/guess'
import type { CharGuessResult } from '@/stores/guess'
import type { CharPinyin } from '@/pinyin'

const props = defineProps<{
  char: string
  pinyin: CharPinyin
  guessResults: CharGuessResult
}>()

const guessColors = {
  [GuessResult.NotExists]: 'gray-500',
  [GuessResult.Exists]: 'yellow-500',
  [GuessResult.CorrectPosition]: 'green-500',
}

</script>

<template>
  <div
    class="m-2 p-1 w-16 h-16"
    w:border="2 yellow-300 rounded-md dashed"
  >
    <div class="flex justify-center items-center text-sm font-mono">
      <div :class="`text-${guessColors[guessResults[0]]}`">
        {{ pinyin[0] || '□' }}
      </div>
      <div class="text-blue-500 text-xs">
        +
      </div>
      <div :class="`text-${guessColors[guessResults[1]]}`">
        {{ pinyin[1] }}
      </div>
    </div>
    <div class="mt-1 text-center">
      {{ char }}
    </div>
  </div>
</template>
