import { describe, expect, test } from 'vitest'
import sampleSize from 'lodash.samplesize'
import { finals, splitCharPinyin, splitIdiomPinyin, splitTone } from '../src/pinyin'
import ALL_IDIOMS from '../src/assets/all-idioms.json'
import syllables from './syllables.json'

describe('Pinyin Processing', () => {
  test('split tone', () => {
    expect(splitTone('zi')).toEqual(['zi', 0])
    expect(splitTone('ēn')).toEqual(['en', 1])
    expect(splitTone('í')).toEqual(['i', 2])
    expect(splitTone('zuò')).toEqual(['zuo', 4])
    expect(splitTone('qǔ')).toEqual(['qu', 3])
  })

  test('split single char', () => {
    expect(splitCharPinyin('zuò')).toEqual(['z', 'uo', 4])
    expect(splitCharPinyin('shén')).toEqual(['sh', 'en', 2])
    expect(splitCharPinyin('yú')).toEqual(['', 'ü', 2])
    Object.entries(syllables).forEach(([syl, split]) => expect(splitCharPinyin(syl)).toEqual(split))
  })

  test('split idiom', () => {
    expect(splitIdiomPinyin('zuò wú xū xí'))
      .toEqual([['z', 'uo', 4], ['', 'u', 2], ['x', 'ü', 1], ['x', 'i', 2]])
    expect(splitIdiomPinyin('ē yú fèng chéng'))
      .toEqual([['', 'e', 1], ['', 'ü', 2], ['f', 'eng', 4], ['ch', 'eng', 2]])
    sampleSize(Object.values(ALL_IDIOMS), 1000).forEach((pinyin) => {
      const splitedPinyin = splitIdiomPinyin(pinyin)
      expect(splitedPinyin).toHaveLength(4)
      splitedPinyin.forEach((split) => {
        expect(split).toHaveLength(3)
      })
    })
  })

  test('finals list', () => {
    const dataFinals = [...new Set(Object.values(syllables).map(pinyin => pinyin[1]))]
    expect(dataFinals).toEqual(finals)
  })
})
