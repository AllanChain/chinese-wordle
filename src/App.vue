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

const doGuess = () => {
  guessStore.guessIdiom(guessIdiom.value)
  guessIdiom.value = ''
}

fetch('idioms.json')
  .then(res => res.json())
  .then((data) => {
    idiomsStore.setAllIdioms(data)
    guessStore.initAnswerIdiom(idiomsStore.randomIdiom())
  })
  .catch(err => loadError.value = err.message)

</script>

<template>
  <div class="p-4 mx-auto max-w-lg">
    <h1
      w:text="3xl center blue-900"
      w:border="b-1 solid gray-300"
      w:p="b-2"
    >
      猜成语
    </h1>
    <div>
      <IdiomDispaly
        v-for="(guess, i) in guessStore.guesses"
        :key="i"
        :idiom="guess.idiom"
        :pinyin="guess.pinyin"
        :guess-results="guess.result"
      />
    </div>
    <div class="flex justify-center mt-3 fixed bottom-2 left-1/2 transform -translate-x-1/2">
      <input
        v-model="guessIdiom"
        class="rounded-l px-2 w-48"
        w:border="1 solid gray-300"
        w:focus="ring ring-blue-400 border-blue-400"
        @keyup.enter="doGuess"
      >
      <button
        class="rounded-r w-16"
        w:p="x-4 y-2"
        w:bg="blue-500 hover:blue-600 active:blue-700"
        w:text="white"
        @click="doGuess"
      >
        确认
      </button>
    </div>
  </div>
</template>
