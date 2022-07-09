<script setup lang="ts">
import { ref } from 'vue'
import AbsoluteModal from './AbsoluteModal.vue'
import { finals, initials } from '@/pinyin'

const props = defineProps<{
  excluded: string[]
  included: string[]
}>()
const show = ref(false)

const getColor = (p: string) => {
  return props.excluded.includes(p)
    ? 'bg-gray-300'
    : props.included.includes(p)
      ? 'bg-green-500'
      : 'bg-blue-400'
}
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
        <div class="*badge bg-gray-300">
          排除
        </div>
        <div class="*badge bg-green-500">
          包含
        </div>
        <div class="*badge bg-blue-400">
          可能
        </div>
      </div>
    </div>
    <div class="text-sm ml-4 text-gray-800">
      注：韵母表中未包含个别过于少见的韵母
    </div>
  </AbsoluteModal>
</template>
