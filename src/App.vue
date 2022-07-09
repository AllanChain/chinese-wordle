<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { Base64 } from 'js-base64'
import { useIdiomsStore } from './stores/idioms'
import { useGuessStore } from './stores/guess'
import IdiomDispaly from './components/IdiomDispaly.vue'
import FadeTransition from './components/FadeTransition.vue'
import AnswerModal from './components/AnswerModal.vue'
import Hints from './components/Hints.vue'
import ExclusionModal from './components/ExclusionModal.vue'
import EmptyIdiomDisplay from './components/EmptyIdiomDisplay.vue'
import AboutModal from './components/AboutModal.vue'
import DifficultyManager from './components/DifficultyManager.vue'
import StatsModal from './components/StatsModal.vue'
import { xorStrings } from './xor-crypt'
import allIdiomsURL from '@/assets/all-idioms.json?url'
import freqIdiomsURL from '@/assets/freq-idioms.json?url'

const idiomsStore = useIdiomsStore()
const guessStore = useGuessStore()

const idiomInput = ref<HTMLInputElement | null>(null)
const idiomDisplayContainer = ref<HTMLDivElement | null>(null)

const guessIdiom = ref('')
const guessError = ref('')
const hideGuessErrorHandle = ref<number | null>(null)

const loadingIdiom = ref(true)
const loadingError = ref('')

const showAbout = ref(localStorage.getItem('played-wordle') !== 'true')
const showAnswer = ref(false)
const showStats = ref(false)
const showExclusion = ref(false)
const givenUp = ref(false)
const gameEnded = computed(() => {
  return givenUp.value || guessStore.lost || guessStore.won
})

const guessRecord = ref(JSON.parse(localStorage.getItem('wordle-guess-record') ?? '[]'))
const addGuessRecord = (guessCount: number) => {
  guessRecord.value.push(guessCount)
  localStorage.setItem('wordle-guess-record', JSON.stringify(guessRecord.value))
}

watch(
  () => guessStore.lost,
  () => {
    if (guessStore.lost) {
      showAnswer.value = true
      addGuessRecord(-1)
    }
  },
  { immediate: false },
)
watch(
  () => guessStore.won,
  () => {
    if (guessStore.won) {
      showAnswer.value = true
      addGuessRecord(guessStore.guessedIdioms.length)
    }
  },
  { immediate: false },
)

onMounted(() => localStorage.setItem('played-wordle', 'true'))

const reDo = () => {
  guessStore.reset()
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
    showError('它不在我们的词库里...')

  guessIdiom.value = ''
  if (idiomDisplayContainer.value) {
    idiomDisplayContainer.value
      .children[guessStore.guesses.length - 1]
      .scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
  }
}

onMounted(async () => {
  try {
    const allIdiomsRes = await fetch(allIdiomsURL)
    const allIdioms = await allIdiomsRes.json()

    idiomsStore.setAllIdioms(allIdioms)
    const freqIdiomsRes = await fetch(freqIdiomsURL)
    const freqIdioms = await freqIdiomsRes.json()
    idiomsStore.setFreqIdioms(freqIdioms)
    const idiom = new URL(location.href).searchParams.get('idiom')

    if (idiom) {
      let decodedIdiom: string
      if (idiom.length === 4) // old version
        decodedIdiom = xorStrings('cnwordle', idiom)
      else // new version
        decodedIdiom = xorStrings('cnwordle', Base64.decode(idiom))
      if (freqIdioms.includes(decodedIdiom)) {
        guessStore.initAnswerIdiom(decodedIdiom)
      }
      else {
        loadingError.value = '分享无效，刷新重开'
        guessStore.initAnswerIdiom(idiomsStore.randomIdiom())
      }
    }
    else {
      guessStore.initAnswerIdiom(idiomsStore.randomIdiom())
    }

    history.pushState(null, '', location.href.split('?')[0])
    loadingIdiom.value = false
  }
  catch (err) {
    loadingError.value = '获取失败，请刷新'
  }
})
</script>

<template>
  <AboutModal v-model="showAbout" />
  <StatsModal v-model="showStats" :guess-record="guessRecord" />
  <AnswerModal
    v-if="guessStore.answerIdiom && guessStore.answerOrigPinyin"
    v-model="showAnswer"
    :answer="guessStore.answerIdiom"
    :answer-pinyin="guessStore.answerOrigPinyin"
    :won="guessStore.won"
  />
  <ExclusionModal
    v-model="showExclusion"
    :excluded="guessStore.excludeList"
    :included="guessStore.includeList"
  />
  <div class="p-4 mx-auto max-w-2xl">
    <div class="flex" w:border="b-1 solid gray-300" w:p="b-2">
      <div class="flex justify-center w-18">
        <button
          class="bg-red-400 dark:bg-red-500 text-white rounded-md px-2 py-1"
          @click="showAnswer = true; givenUp = true; addGuessRecord(-1)"
        >
          答案
        </button>
      </div>
      <h1
        class="flex-1"
        w:text="3xl center blue-900 dark:blue-400"
      >
        拼成语
      </h1>
      <div class="flex justify-center w-18">
        <button
          class="text-emerald-700 dark:text-emerald-500 text-xl mx-2"
          @click="showStats = true"
        >
          <Icon icon="ion:ios-stats" />
        </button>
        <button
          class="text-emerald-700 dark:text-emerald-500 text-xl mx-2"
          @click="showAbout = true"
        >
          <Icon icon="ph:info-bold" />
        </button>
      </div>
    </div>
    <div class="flex sticky top-0 my-1 py-1 bg-white dark:bg-gray-900">
      <DifficultyManager
        :disabled="guessStore.guessedIdioms.length > 0 && !gameEnded"
      />
      <Hints :hints="Object.values(guessStore.hints).map(hint => hint.content)" />
      <button
        class="bg-teal-500 dark:bg-teal-600 text-white rounded-md h-8 w-22"
        @click="showExclusion = true"
      >
        查看排除
      </button>
    </div>
    <div ref="idiomDisplayContainer" class="grid grid-cols-1 sm:grid-cols-2">
      <IdiomDispaly
        v-for="(guess, i) in guessStore.guesses"
        :key="i"
        :idiom="guess.idiom"
        :pinyin="guess.pinyin"
        :guess-results="guess.result"
        :class="
          guessStore.won && i === guessStore.guesses.length - 1
            ? ['!children:border-green-400', '!children:border-double']
            : []
        "
      />
      <EmptyIdiomDisplay
        v-for="i in guessStore.totalChances - guessStore.guesses.length"
        :key="i"
        :class="guessStore.won ? ['!children:border-red-50 !dark:children:border-stone-800'] : []"
        @click="idiomInput?.focus()"
      />
    </div>
    <div class="h-10" />
    <div class="fixed bottom-2 left-1/2 transform -translate-x-1/2">
      <FadeTransition>
        <div
          v-if="guessError"
          class="px-2 py-1 mb-1 rounded-md bg-red-500 text-white"
        >
          {{ guessError }}
        </div>
      </FadeTransition>
      <FadeTransition>
        <div
          v-if="loadingIdiom || loadingError"
          class="text-center rounded mx-auto px-4 py-2 w-50 bg-yellow-100 text-yellow-800"
        >
          {{ loadingError || '加载中...' }}
        </div>
        <div v-else-if="!gameEnded" class="flex justify-center">
          <input
            ref="idiomInput"
            v-model="guessIdiom"
            maxlength="4"
            class="rounded-l px-2 w-32"
            w:border="1 solid gray-300 dark:gray-600"
            w:focus="ring ring-blue-400 border-blue-400"
            w:bg="white dark:gray-700 disabled:gray-100 dark:disabled:gray-600"
            w:disabled="bg-gray-100"
            @keyup.enter="doGuess"
          >
          <button
            class="rounded-r w-18"
            w:p="x-4 y-2"
            w:bg="blue-500 dark:blue-600"
            w:hover="bg-blue-600 dark:bg-blue:700"
            w:active="bg-blue-700 dark:bg-blue-800"
            w:disabled="bg-gray-400 dark:bg-gray-700"
            w:text="white"
            @click="doGuess"
          >
            确认
          </button>
        </div>
        <div v-else class="flex">
          <div
            class="flex px-2 w-28 rounded-l bg-gray-100 items-center justify-center"
            :class="guessStore.won
              ? 'bg-green-100 dark:bg-green-200 text-green-900'
              : 'bg-red-100 dark:bg-red-200 text-red-900'"
          >
            <div>{{ guessStore.won ? '恭喜你' : '很遗憾' }}</div>
          </div>
          <button
            class="rounded-r w-18"
            w:p="x-4 y-2"
            w:bg="indigo-500 hover:indigo-600 dark:indigo-600 dark:hover:indigo-700"
            w:text="white"
            @click="reDo"
          >
            重开
          </button>
        </div>
      </FadeTransition>
    </div>
  </div>
</template>
