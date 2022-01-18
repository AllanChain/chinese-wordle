<script setup lang="ts">
import type { IdiomGuessResult } from '@/interfaces/GuessResult'
import type { IdiomPinyin } from '@/interfaces/Pinyin'

const props = defineProps<{
  idiom: string
  pinyin: IdiomPinyin
  guessResults: IdiomGuessResult
}>()
</script>
