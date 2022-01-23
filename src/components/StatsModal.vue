<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import AbsoluteModal from './AbsoluteModal.vue'

const props = defineProps<{ guessRecord: number[] }>()
const show = ref(false)

const winRate = computed(() => {
  if (props.guessRecord.length === 0)
    return 0
  const winCount = props.guessRecord.filter(count => count > 0).length
  return winCount / props.guessRecord.length * 100
})

const countDistribution = computed(() => {
  const counts = props.guessRecord.reduce((acc, count) => {
    if (count < 1) return acc
    acc[count] = (acc[count] ?? 0) + 1
    return acc
  }, {} as Record<number, number>)
  return Object.entries(counts)
    .map(([count, countGuesses]) => ({ count, countGuesses }))
    .sort((a, b) => parseInt(a.count, 10) - parseInt(b.count, 10))
})
</script>

<template>
  <AbsoluteModal v-model="show">
    <h1 class="text-lg text-center mb-2">
      统计
    </h1>
    <div class="flex justify-center text-sky-900">
      <div class="flex items-center flex-col w-16">
        <div class="text-xl font-bold">
          {{ guessRecord.length }}
        </div>
        <div>局</div>
      </div>
      <div class="flex items-center flex-col w-20">
        <div class="text-xl font-bold">
          {{ winRate.toFixed(1) }}%
        </div>
        <div>胜率</div>
      </div>
    </div>
    <h2 class="text-center my-2">
      猜测次数统计
    </h2>
    <div class="min-w-60 ml-6 font-mono text-yellow-800">
      <div
        v-for="({ count, countGuesses }) in countDistribution"
        :key="count"
        class="flex items-center"
      >
        <div>{{ count }}</div>
        <div
          class="bg-yellow-300 h-4 mx-2 px-2 flex justify-end items-center"
          w:border="rounded-md"
          :style="{ width: `calc(28px + ${countGuesses / guessRecord.length * 80}%)` }"
        >
          {{ countGuesses }}
        </div>
      </div>
    </div>
  </AbsoluteModal>
</template>
