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
  [GuessResult.NotExists]: 'grey-500',
  [GuessResult.Exists]: 'yellow-500',
  [GuessResult.CorrectPosition]: 'green-500',
}

</script>

<template>
  <div class="m-2 p-1 w-16" w:border="1 yellow-200 dashed">
    <div class="flex justify-center">
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
