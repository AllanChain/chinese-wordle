<script setup lang="ts">
import { GuessResult } from '@/stores/guess'
import type { CharGuessResult } from '@/stores/guess'
import type { CharPinyin } from '@/pinyin'

const props = defineProps<{
  char: string
  pinyin: CharPinyin | string
  guessResults?: CharGuessResult
}>()

const guessColors = {
  [GuessResult.NotExists]: 'gray-500',
  [GuessResult.Exists]: 'yellow-500',
  [GuessResult.CorrectPosition]: 'green-500',
}

</script>

<template>
  <div class="p-0.5 w-16 h-16">
    <div class="text-sm font-mono font-semibold">
      <div
        v-if="Array.isArray(pinyin) && guessResults"
        class="flex justify-center items-baseline decoration-green-500"
        w:underline="offset-1 double"
        :class="guessResults[2] ? [ 'underline' ] : []"
      >
        <div :class="`text-${guessColors[guessResults[0]]}`">
          {{ pinyin[0] || 'Ø' }}
        </div>
        <div class="text-blue-500 text-xs">
          +
        </div>
        <div :class="`text-${guessColors[guessResults[1]]}`">
          {{ pinyin[1] }}
        </div>
      </div>
      <div v-else class="text-center">
        {{ pinyin }}
      </div>
    </div>
    <div class="mt-1 text-center">
      {{ char }}
    </div>
  </div>
</template>
