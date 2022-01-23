<script setup lang="ts">
import { ref, watch } from 'vue'
import { difficulties, useGuessStore } from '@/stores/guess'

const selectedDifficulty = ref(localStorage.getItem('wordle-difficulty') ?? 'easy')
const guessStore = useGuessStore()
watch(
  selectedDifficulty,
  () => {
    if (selectedDifficulty.value in difficulties) {
      guessStore.difficulty = difficulties[selectedDifficulty.value]
      localStorage.setItem('wordle-difficulty', selectedDifficulty.value)
    }
  },
)
</script>

<template>
  <select
    v-model="selectedDifficulty"
    class="rounded-lg px-1 m-2"
    w:border="1 blue-400 disabled:gray-400"
    w:bg="white disabled:gray-100"
    w:text="blue-900 disabled:gray-500"
    :disabled="guessStore.guessedIdioms.length > 0"
  >
    <option
      v-for="(difficulty, key) in difficulties"
      :key="key" :value="key"
    >
      {{ difficulty.name }}
    </option>
  </select>
</template>
