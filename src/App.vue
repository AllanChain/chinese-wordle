<script setup lang="ts">
import { computed, ref } from 'vue'
import { useIdiomsStore } from './stores/idioms'
import { useGuessStore } from './stores/guess'
import IdiomDispaly from './components/IdiomDispaly.vue'
import FadeTransition from './components/FadeTransition.vue'
import AnswerModal from './components/AnswerModal.vue'
import AboutGame from './components/AboutGame.vue'
import Hints from './components/Hints.vue'
import ExclusionModal from './components/ExclusionModal.vue'
import allIdiomsURL from '@/assets/all-idioms.json?url'
import freqIdiomsURL from '@/assets/freq-idioms.json?url'

const idiomsStore = useIdiomsStore()
const guessStore = useGuessStore()

const guessIdiom = ref('')
const guessError = ref('')
const hideGuessErrorHandle = ref<number|null>(null)

const showAnswer = ref(false)
const showExclusion = ref(false)
const givenUp = ref(false)
const gameEnded = computed(() => {
  return (
    givenUp.value
    || guessStore.guessedIdioms.length >= 10
    || guessStore.won
  )
})

const reDo = () => {
  guessStore.$reset()
  guessStore.initAnswerIdiom(idiomsStore.randomIdiom())
  givenUp.value = false
}

const showError = (message: string) => {
  if (hideGuessErrorHandle.value !== null)
    clearTimeout(hideGuessErrorHandle.value)
  guessError.value = message
  hideGuessErrorHandle.value = window.setTimeout(() => {
    guessError.value = ''
    hideGuessErrorHandle.value = null
  }, 3000)
}

const doGuess = () => {
  if (!guessStore.guessIdiom(guessIdiom.value))
    showError('不是一个有效的四字成语')

  guessIdiom.value = ''
}

fetch(freqIdiomsURL)
  .then(res => res.json())
  .then((data) => {
    idiomsStore.setFreqIdioms(data)
    guessStore.initAnswerIdiom(idiomsStore.randomIdiom())
  })
  .catch(err => showError(`无法获取数据，请刷新\n${err.message.slice(0, 50)}`))

fetch(allIdiomsURL)
  .then(res => res.json())
  .then(data => idiomsStore.setAllIdioms(data))
  .catch(err => showError(`无法获取数据，请刷新\n${err.message.slice(0, 50)}`))

</script>

<template>
  <AnswerModal
    v-if="guessStore.answerIdiom && guessStore.answerOrigPinyin"
    v-model="showAnswer"
    :answer="guessStore.answerIdiom"
    :answer-pinyin="guessStore.answerOrigPinyin"
  />
  <ExclusionModal
    v-model="showExclusion"
    :excluded="guessStore.excludeList"
    :included="guessStore.includeList"
  />
  <div class="p-4 mx-auto max-w-2xl">
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
      <div class="flex">
        <Hints :hints="guessStore.hints" />
        <button
          class="bg-teal-500 text-white rounded-md px-2 my-1"
          @click="showExclusion = true"
        >
          查看排除
        </button>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2">
        <IdiomDispaly
          v-for="(guess, i) in guessStore.guesses"
          :key="i"
          :idiom="guess.idiom"
          :pinyin="guess.pinyin"
          :guess-results="guess.result"
        />
      </div>
    </div>
    <AboutGame v-else />
    <div class="h-10" />
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
          maxlength="4"
          :disabled="gameEnded"
          class="rounded-l px-2 w-48"
          w:border="1 solid gray-300"
          w:focus="ring ring-blue-400 border-blue-400"
          w:disabled="bg-gray-100"
          @keyup.enter="doGuess"
        >
        <button
          class="rounded-r w-16"
          :disabled="gameEnded"
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
