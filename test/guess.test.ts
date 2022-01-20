import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, test } from 'vitest'
import { HintType, useGuessStore } from '../src/stores/guess'
import { useIdiomsStore } from '../src/stores/idioms'
import ALL_IDIOMS from '../src/assets/all-idioms.json'
import FREQ_IDIOMS from '../src/assets/freq-idioms.json'

describe('Guess Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  test('answer pinyin', () => {
    const guessStore = useGuessStore()
    const idioms = useIdiomsStore()
    idioms.setAllIdioms({ 为虎作伥: 'wèi hǔ zuò chāng' })
    idioms.setFreqIdioms(['为虎作伥'])
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
    idioms.setFreqIdioms(FREQ_IDIOMS)
    guessStore.initAnswerIdiom('为虎作伥')
  })

  test('add guess', () => {
    const guessStore = useGuessStore()
    guessStore.guessIdiom('东施效颦')
    expect(guessStore.guesses[0]).toEqual({
      idiom: '东施效颦',
      pinyin: [['d', 'ong', 1], ['sh', 'i', 1], ['x', 'iao', 4], ['p', 'in', 2]],
      origPinyin: 'dōng shī xiào pín',
      result: [[0, 0, false], [0, 0, false], [0, 0, false], [0, 0, false]],
    })
    guessStore.guessIdiom('沉鱼落雁')
    expect(guessStore.guesses[1].result)
      .toEqual([[1, 0, false], [1, 0, false], [0, 2, false], [1, 0, false]])
    guessStore.guessIdiom('左右逢源')
    expect(guessStore.guesses[2].result)
      .toEqual([[1, 1, true], [1, 0, false], [0, 0, false], [1, 0, false]])
  })

  test('hint give combination if both ever guessed', () => {
    const guessStore = useGuessStore()
    guessStore.enabledHints = [HintType.GiveCombination_IfBothEverGuessed]
    guessStore.guessIdiom('沉鱼落雁')
    expect(guessStore.hints).toHaveLength(0)
    guessStore.guessIdiom('张灯结彩')
    expect(guessStore.hints).toEqual(['chang'])
  })
  test('hint give combination if both exists in one guess', () => {
    const guessStore = useGuessStore()
    guessStore.enabledHints = [HintType.GiveCombination_IfBothExistsInOneGuess]
    guessStore.guessIdiom('沉鱼落雁')
    guessStore.guessIdiom('张灯结彩')
    expect(guessStore.hints).toHaveLength(0)
    guessStore.guessIdiom('如鱼得水')
    expect(guessStore.hints).toEqual(['wei'])
  })
  test('hint give tone if combination correct', () => {
    const guessStore = useGuessStore()
    guessStore.enabledHints = [HintType.GiveTone_IfCombinationCorrect]
    guessStore.guessIdiom('怅然若失')
    expect(guessStore.hints).toEqual(['chāng'])
  })
  test('hint give character if both position correct', () => {
    const guessStore = useGuessStore()
    guessStore.enabledHints = [HintType.GiveCharacter_IfBothPositionCorrect]
    guessStore.guessIdiom('五湖四海')
    expect(guessStore.hints).toEqual(['虎'])
  })
})
