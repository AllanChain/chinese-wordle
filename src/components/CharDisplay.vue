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
    class="m-2 p-1 w-14 h-14"
    w:border="2 yellow-300 rounded-md dashed"
  >
    <div class="flex justify-center text-sm font-mono">
      <div
        v-for="i in [0, 1]"
        :key="i"
        :class="`text-${guessColors[guessResults[i]]}`"
      >
        {{ pinyin[i] || '□' }}
      </div>
    </div>
    <div class="text-center">
      {{ char }}
    </div>
  </div>
</template>
