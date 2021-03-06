import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, test } from 'vitest'
import { HintCondition, HintTarget, useGuessStore } from '../src/stores/guess'
import { useIdiomsStore } from '../src/stores/idioms'
import ALL_IDIOMS from '../src/assets/all-idioms.json'
import FREQ_IDIOMS from '../src/assets/freq-idioms.json'
import { splitIdiomPinyin } from '../src/pinyin'

describe('Guess Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    const guessStore = useGuessStore()
    const idioms = useIdiomsStore()
    idioms.setAllIdioms({ 和衷共济: 'hé zhōng gòng jì' })
    idioms.setFreqIdioms(['和衷共济'])
    guessStore.initAnswerIdiom('和衷共济')
  })

  test('answer pinyin', () => {
    const guessStore = useGuessStore()
    expect(guessStore.answerIdiom).toBe('和衷共济')
    expect(guessStore.answerOrigPinyin).toBe('hé zhōng gòng jì')
    expect(guessStore.answerPinyin)
      .toEqual([['h', 'e', 2], ['zh', 'ong', 1], ['g', 'ong', 4], ['j', 'i', 4]])
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

  test('compare pinyin with 无缘无故', () => {
    const guessStore = useGuessStore()
    const idioms = useIdiomsStore()
    guessStore.initAnswerIdiom('无缘无故')
    const compare = (idiom: string) => guessStore.compareIdiomPinyin(
      splitIdiomPinyin(idioms.allIdioms[idiom]),
    )
    expect(compare('欢欣鼓舞')).toEqual(
      [[0, 0, false], [0, 0, false], [1, 2, true], [1, 2, true]],
    )
    expect(compare('故步自封')).toEqual(
      [[1, 2, true], [0, 1, false], [0, 0, false], [0, 0, false]],
    )
    expect(compare('五光十色')).toEqual(
      [[2, 2, true], [1, 0, false], [0, 0, false], [0, 0, false]],
    )
  })

  test('compare pinyin with 喜出望外', () => {
    const guessStore = useGuessStore()
    const idioms = useIdiomsStore()
    guessStore.initAnswerIdiom('喜出望外')
    const compare = (idiom: string) => guessStore.compareIdiomPinyin(
      splitIdiomPinyin(idioms.allIdioms[idiom]),
    )
    expect(compare('呼之欲出')).toEqual(
      [[0, 0, false], [0, 1, false], [2, 0, false], [1, 1, true]],
    )
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
      .toEqual([[1, 0, false], [1, 0, false], [0, 2, false], [0, 0, false]])
    guessStore.guessIdiom('左右逢源')
    expect(guessStore.guesses[2].result)
      .toEqual([[1, 1, true], [1, 0, false], [0, 0, false], [0, 0, false]])
  })

  test('invalid guess', () => {
    const guessStore = useGuessStore()
    expect(guessStore.guessIdiom('东施效颦')).toBe(true)
    expect(guessStore.guessIdiom('我勒个去')).toBe(false)
  })

  test('hint give combination if both ever guessed', () => {
    const guessStore = useGuessStore()
    guessStore.difficulty = {
      name: 'test',
      enabledHints: [{
        on: HintCondition.BothEverGuessed,
        give: HintTarget.Combination,
      }],
    }
    guessStore.guessIdiom('沉鱼落雁')
    expect(guessStore.hints).toEqual({})
    guessStore.guessIdiom('张灯结彩')
    expect(guessStore.hints).toEqual({
      3: {
        content: 'chang',
        level: HintTarget.Combination,
      },
    })
  })
  test('hint give combination if both exists in one guess', () => {
    const guessStore = useGuessStore()
    guessStore.difficulty = {
      name: 'test',
      enabledHints: [{
        on: HintCondition.BothExistsInOneGuess,
        give: HintTarget.Combination,
      }],
    }
    guessStore.guessIdiom('沉鱼落雁')
    guessStore.guessIdiom('张灯结彩')
    expect(guessStore.hints).toEqual({})
    guessStore.guessIdiom('如鱼得水')
    expect(guessStore.hints).toEqual({
      0: {
        content: 'wei',
        level: HintTarget.Combination,
      },
    })
  })
  test('hint give tone if combination correct', () => {
    const guessStore = useGuessStore()
    guessStore.difficulty = {
      name: 'test',
      enabledHints: [{
        on: HintCondition.CombinationCorrect,
        give: HintTarget.CombinationAndTone,
      }],
    }
    guessStore.guessIdiom('怅然若失')
    expect(guessStore.hints).toEqual({
      3: {
        content: 'chāng',
        level: HintTarget.CombinationAndTone,
      },
    })
  })
  test('hint give character if both position and tone correct', () => {
    const guessStore = useGuessStore()
    guessStore.difficulty = {
      name: 'test',
      enabledHints: [{
        on: HintCondition.PositionAndToneCorrect,
        give: HintTarget.Char,
      }],
    }
    guessStore.guessIdiom('怅然若失')
    expect(guessStore.hints).toEqual({})
    guessStore.guessIdiom('五湖四海')
    expect(guessStore.hints).toEqual({})
    guessStore.guessIdiom('调虎离山')
    expect(guessStore.hints).toEqual({
      1: {
        content: '虎',
        level: HintTarget.Char,
      },
    })
    guessStore.guessIdiom('为虎作伥')
    expect(guessStore.won).toBe(true)
    expect(guessStore.hints).to.have.all.keys(1)
    expect(guessStore.hints).not.to.have.any.keys(0, 2, 3)
  })
  test('hint race', () => {
    const guessStore = useGuessStore()
    guessStore.difficulty = {
      name: 'test',
      enabledHints: [
        { on: HintCondition.BothEverGuessed, give: HintTarget.Combination },
        { on: HintCondition.PositionAndToneCorrect, give: HintTarget.Char },
      ],
    }
    guessStore.guessIdiom('调虎离山')
    expect(guessStore.hints).toEqual({
      1: {
        content: '虎',
        level: HintTarget.Char,
      },
    })
    guessStore.guessIdiom('风花雪月')
    expect(guessStore.hints).to.have.all.keys(1)
  })
})

describe('Special hint cases', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    const idioms = useIdiomsStore()
    idioms.setAllIdioms(ALL_IDIOMS)
    idioms.setFreqIdioms(FREQ_IDIOMS)
  })

  test('a', () => {
    const guessStore = useGuessStore()
    guessStore.difficulty = {
      name: 'test',
      enabledHints: [
        { on: HintCondition.BothEverGuessed, give: HintTarget.Combination },
        { on: HintCondition.CombinationCorrect, give: HintTarget.CombinationAndTone },
        { on: HintCondition.PositionAndToneCorrect, give: HintTarget.Char },
      ],
    }
    guessStore.initAnswerIdiom('蛛丝马迹')
    guessStore.guessIdiom('视死如归')
    expect(guessStore.hints).to.have.all.keys(1)
    expect(guessStore.hints[1].content).toBe('sī')
  })
})
