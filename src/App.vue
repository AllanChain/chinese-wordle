<script setup lang="ts">
import { onMounted, ref } from 'vue'
import CharDisplay from './components/CharDisplay.vue'
import { useIdiomsStore } from './stores/idioms'
import { useGuessStore } from './stores/guess'
import IdiomDispaly from './components/IdiomDispaly.vue'

const idiomsStore = useIdiomsStore()
const guessStore = useGuessStore()

const loadError = ref<string | null>(null)
const guessIdiom = ref('')

fetch('idioms.json')
  .then(res => res.json())
  .then((data) => {
    idiomsStore.setAllIdioms(data)
    guessStore.initAnswerIdiom(idiomsStore.randomIdiom())
  })
  .catch(err => loadError.value = err.message)

</script>

<template>
  <div>
    <IdiomDispaly
      v-for="(guess, i) in guessStore.guesses"
      :key="i"
      :idiom="guess.idiom"
      :pinyin="guess.pinyin"
      :guess-results="guess.result"
    />
  </div>
  <input v-model="guessIdiom">
  <button
    class="p-4"
    w:bg="blue-500 hover:blue-700"
    w:text="white"
    @click="guessStore.guessIdiom(guessIdiom)"
  >
    Guess
  </button>
</template>
