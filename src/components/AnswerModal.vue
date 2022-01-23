<script setup lang="ts">
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'
import AbsoluteModal from './AbsoluteModal.vue'
import CharDisplay from './CharDisplay.vue'
import { xorStrings } from '@/xor-crypt'

const props = defineProps<{ answer: string; answerPinyin: string; won: boolean }>()
const show = ref(true)

const chars = computed(() => {
  return props.answerPinyin.split(' ').map((pinyin, i) => ({
    char: props.answer.charAt(i),
    pinyin,
  }))
})

const shareLink = computed(() => {
  const url = new URL(location.href)
  url.searchParams.set('idiom', xorStrings('cnwordle', props.answer))
  return url.href
})

const isWechat = navigator.userAgent.includes('MicroMessenger')

const share = () => {
  if (!isWechat)
    navigator.clipboard.writeText(shareLink.value)
  else
    history.pushState(null, '', shareLink.value)
}
</script>

<template>
  <AbsoluteModal v-model="show">
    <h1
      class="text-lg font-bold text-center mb-2"
      :class="won ? 'text-green-700' : 'text-yellow-700'"
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
    <button
      w:text="red-700"
      w:m="t-2"
      w:p="x-4 y-2"
      w:shadow="lg"
      w:border="2 red-200 rounded-lg"
      w:bg="hover:red-100 active:red-200"
      @click="share"
    >
      <Icon v-if="!isWechat" icon="mdi:link-variant" />
      {{ isWechat ? '点击后复制网址向他人发起挑战' : '复制成语链接向他人发起挑战' }}
    </button>
  </AbsoluteModal>
</template>
