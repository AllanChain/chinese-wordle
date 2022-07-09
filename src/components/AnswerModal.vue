<script setup lang="ts">
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { Base64 } from 'js-base64'
import AbsoluteModal from './AbsoluteModal.vue'
import CharDisplay from './CharDisplay.vue'
import { xorStrings } from '@/xor-crypt'
import { useGuessStore } from '@/stores/guess'

const props = defineProps<{ answer: string; answerPinyin: string; won: boolean }>()
const show = ref(true)
const guessStore = useGuessStore()

const chars = computed(() => {
  return props.answerPinyin.split(' ').map((pinyin, i) => ({
    char: props.answer.charAt(i),
    pinyin,
  }))
})

const shareLink = computed(() => {
  const url = new URL(location.href)
  const b64String = Base64.encode(xorStrings('cnwordle', props.answer), true)
  url.searchParams.set('idiom', b64String)
  return url.href
})

const clipboardAvailable = !!navigator.clipboard

const emojiMapping = ['🌑', '🌒', '🌓', '🌘', '🌙', '🌔', '🌗', '🌖', '🌕']

const shareText = computed(() => {
  let text = `拼成语 - 本次为${guessStore.difficultyName}难度 - ${
    guessStore.won ? `${guessStore.guesses.length} 次猜中` : '失败'
  }\n${shareLink.value}`
  for (const [i, guess] of guessStore.guesses.entries()) {
    text += i % 2 === 0 ? '\n' : '   |   '
    for (const charResult of guess.result) {
      const encodeNumber = charResult[0] * 3 + charResult[1]
      text += emojiMapping[encodeNumber]
    }
  }
  return text
})

const handleTextClick = (event: MouseEvent) => {
  const target = event.target as HTMLTextAreaElement
  if (target.selectionStart !== target.selectionEnd)
    return
  target.focus()
  target.select()
}

const share = () => {
  navigator.clipboard.writeText(shareText.value)
}
</script>

<template>
  <AbsoluteModal v-model="show">
    <h1
      class="text-lg font-bold text-center mb-2"
      :class="won
        ? 'text-green-700 dark:text-green-600'
        : 'text-yellow-700 dark:text-yellow-600'"
    >
      {{ won ? '你猜对了' : '待猜成语' }}
    </h1>
    <div class="flex justify-center *full-border">
      <CharDisplay
        v-for="(char, i) in chars"
        :key="i"
        :char="char.char"
        :pinyin="char.pinyin"
      />
    </div>
    <textarea
      :value="shareText"
      readonly
      class="block w-64 h-42 p-2"
      w:m="y-2 x-auto"
      :w:bg="won ? 'teal-50 dark:zinc-800' : 'red-50 dark:stone-800'"
      w:border="rounded-lg"
      w:resize="none"
      w:outline="none"
      w:text="sm"
      w:break="all"
      @click="handleTextClick"
    />
    <button
      v-if="clipboardAvailable"
      class="block"
      w:text="teal-700 dark:teal-500"
      w:m="t-2 x-auto"
      w:p="x-4 y-2"
      w:shadow="lg"
      w:border="2 teal-200 dark:teal-900 rounded-lg"
      w:bg="hover:teal-50 active:teal-100 dark:hover:gray-900"
      @click="share"
    >
      <Icon icon="mdi:link-variant" />
      复制以分享成绩
    </button>
    <div
      v-else class="block mx-auto"
      w:text="gray-600 dark:gray-500 sm center"
    >
      复制上方文本以分享成绩
    </div>
  </AbsoluteModal>
</template>
