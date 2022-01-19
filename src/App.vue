<script setup lang="ts">
import { ref } from 'vue'
import { useIdiomsStore } from './stores/idioms'
import { useGuessStore } from './stores/guess'
import IdiomDispaly from './components/IdiomDispaly.vue'
import FadeTransition from './components/FadeTransition.vue'
import AnswerModal from './components/AnswerModal.vue'
import AboutGame from './components/AboutGame.vue'

const idiomsStore = useIdiomsStore()
const guessStore = useGuessStore()

const loadError = ref<string | null>(null)
const guessIdiom = ref('')
const guessError = ref('')
const hideGuessErrorHandle = ref<number|null>(null)

const showAnswer = ref(false)
const givenUp = ref(false)

const reDo = () => {
  guessStore.$reset()
  guessStore.initAnswerIdiom(idiomsStore.randomIdiom())
  givenUp.value = false
}

const doGuess = () => {
  if (hideGuessErrorHandle.value !== null)
    clearTimeout(hideGuessErrorHandle.value)

  if (!guessStore.guessIdiom(guessIdiom.value)) {
    guessError.value = '不是一个有效的四字成语'
    hideGuessErrorHandle.value = window.setTimeout(() => {
      guessError.value = ''
      hideGuessErrorHandle.value = null
    }, 3000)
  }
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
  <AnswerModal
    v-if="guessStore.answerIdiom && guessStore.answerOrigPinyin"
    v-model="showAnswer"
    :answer="guessStore.answerIdiom"
    :answer-pinyin="guessStore.answerOrigPinyin"
  />
  <div class="p-4 mx-auto max-w-lg">
    <div class="flex" w:border="b-1 solid gray-300" w:p="b-2">
      <button
        class="bg-blue-500 text-white rounded-md px-2 py-1"
        @click="reDo"
      >
        重开
      </button>
      <h1
        class="flex-1"
        w:text="3xl center blue-900"
      >
        猜成语
      </h1>
      <button
        class="bg-red-400 text-white rounded-md px-2 py-1"
        @click="showAnswer = true, givenUp = true"
      >
        放弃
      </button>
    </div>
    <div v-if="guessStore.guesses.length">
      <IdiomDispaly
        v-for="(guess, i) in guessStore.guesses"
        :key="i"
        :idiom="guess.idiom"
        :pinyin="guess.pinyin"
        :guess-results="guess.result"
      />
    </div>
    <AboutGame v-else />
    <div class="fixed bottom-2 left-1/2 transform -translate-x-1/2">
      <FadeTransition>
        <div
          v-if="guessError"
          class="px-2 py-1 rounded-md bg-red-500 text-white"
        >
          {{ guessError }}
        </div>
      </FadeTransition>
      <div class="flex justify-center mt-3 ">
        <input
          v-model="guessIdiom"
          :disabled="givenUp"
          class="rounded-l px-2 w-48"
          w:border="1 solid gray-300"
          w:focus="ring ring-blue-400 border-blue-400"
          w:disabled="bg-gray-100"
          @keyup.enter="doGuess"
        >
        <button
          class="rounded-r w-16"
          :disabled="givenUp"
          w:p="x-4 y-2"
          w:bg="blue-500 hover:blue-600 active:blue-700 disabled:blue-gray-400"
          w:text="white"
          @click="doGuess"
        >
          确认
        </button>
      </div>
    </div>
  </div>
</template>
