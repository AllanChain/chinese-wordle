import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, test } from 'vitest'
import { useGuessStore } from '../src/stores/guess'
import { useIdiomsStore } from '../src/stores/idioms'
import ALL_IDIOMS from '../public/idioms.json'

describe('Guess Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  test('answer pinyin', () => {
    const guessStore = useGuessStore()
    const idioms = useIdiomsStore()
    idioms.setAllIdioms({ 为虎作伥: 'wèi hǔ zuò chāng' })
    guessStore.initAnswerIdiom('为虎作伥')
    expect(guessStore.answerIdiom).toBe('为虎作伥')
    expect(guessStore.answerOrigPinyin).toBe('wèi hǔ zuò chāng')
    expect(guessStore.answerPinyin)
      .toEqual([['', 'uei', 4], ['h', 'u', 3], ['z', 'uo', 4], ['ch', 'ang', 1]])
  })
})

describe('Real Test', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    const guessStore = useGuessStore()
    const idioms = useIdiomsStore()
    idioms.setAllIdioms(ALL_IDIOMS)
    guessStore.initAnswerIdiom('为虎作伥')
  })

  test('add guess', () => {
    const guessStore = useGuessStore()
    guessStore.guessIdiom('东施效颦')
    expect(guessStore.guesses[0]).toEqual({
      idiom: '东施效颦',
      pinyin: [['d', 'ong', 1], ['sh', 'i', 1], ['x', 'iao', 4], ['p', 'in', 2]],
      origPinyin: 'dōng shī xiào pín',
      result: [[0, 0], [0, 0], [0, 0], [0, 0]],
    })
    guessStore.guessIdiom('沉鱼落雁')
    expect(guessStore.guesses[1].result)
      .toEqual([[1, 0], [1, 0], [0, 2], [1, 0]])
  })
})
