<script setup lang="ts">
import CharDisplay from './components/CharDisplay.vue'
import { GuessResult } from './interfaces/GuessResult'
</script>

<template>
  <CharDisplay char="我" :pinyin="['w','ǒ']" :guess-results="[GuessResult.CorrectPosition, GuessResult.Exists]" />
</template>
