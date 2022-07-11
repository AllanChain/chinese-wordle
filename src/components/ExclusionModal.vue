<script setup lang="ts">
import { computed, ref } from 'vue'
import sampleSize from 'lodash.samplesize'
import AbsoluteModal from './AbsoluteModal.vue'
import { finals, initials, splitIdiomPinyin } from '@/pinyin'
import { useIdiomsStore } from '@/stores/idioms'
import { useGuessStore } from '@/stores/guess'

const props = defineProps<{
  excluded: string[]
  included: string[]
}>()
const show = ref(false)
const idiomsStore = useIdiomsStore()
const guessStore = useGuessStore()

const getColor = (p: string) => {
  return props.excluded.includes(p)
    ? 'bg-gray-300 dark:bg-gray-700'
    : props.included.includes(p)
      ? 'bg-green-500 dark:bg-green-600'
      : 'bg-blue-400 dark:bg-blue-600'
}

const suggestion = computed(() => {
  let bestIdiom = null
  let bestRecord = 0
  const idiomsPool = [
    ...sampleSize(idiomsStore.freqIdioms, 100),
    ...sampleSize(Object.keys(idiomsStore.allIdioms), 500),
  ]
  for (const idiom of idiomsPool) {
    const pinyinFlatten = splitIdiomPinyin(idiomsStore.allIdioms[idiom]).flatMap(
      ([i, f]) => [i, f],
    )
    const possibleParts = Array.from(new Set(pinyinFlatten)).filter(
      part => !props.included.includes(part) && !props.excluded.includes(part),
    )
    if (possibleParts.length > bestRecord) {
      bestRecord = possibleParts.length
      bestIdiom = idiom
    }
  }
  return bestIdiom
})
</script>

<template>
  <AbsoluteModal v-model="show">
    <h1 class="text-lg text-center mb-2">
      声母表
    </h1>
    <div class="flex flex-wrap max-w-full">
      <div
        v-for="initial in [...initials, '']"
        :key="initial"
        class="*badge text-white font-mono"
        :class="getColor(initial)"
      >
        {{ initial || 'Ø' }}
      </div>
    </div>
    <h1 class="text-lg text-center mb-2">
      韵母表
    </h1>
    <div class="flex flex-wrap max-w-full">
      <div
        v-for="final in finals"
        :key="final"
        class="*badge text-white"
        :class="getColor(final)"
      >
        {{ final }}
      </div>
    </div>
    <div class="flex ml-4 mt-2">
      图例：
      <div class="flex text-white">
        <div class="*badge bg-gray-300 dark:bg-gray-700">
          排除
        </div>
        <div class="*badge bg-green-500 dark:bg-green-600">
          包含
        </div>
        <div class="*badge bg-blue-400 dark:bg-blue-600">
          可能
        </div>
      </div>
    </div>
    <div class="text-sm ml-4 text-gray-800 dark:text-gray-300">
      <p> 注：韵母表中未包含个别过于少见的韵母</p>
      <p v-if="suggestion && !guessStore.won && !guessStore.lost">
        想要排除更多？试试 {{ suggestion }} 吧！
      </p>
    </div>
  </AbsoluteModal>
</template>
