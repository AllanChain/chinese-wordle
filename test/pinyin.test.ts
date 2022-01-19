import { describe, expect, test } from 'vitest'
import { splitCharPinyin, splitIdiomPinyin, splitTone } from '../src/pinyin'
import syllables from './syllables.json'

describe('Pinyin processing', () => {
  test('Split tone', () => {
    expect(splitTone('zi')).toEqual(['zi', 0])
    expect(splitTone('ēn')).toEqual(['en', 1])
    expect(splitTone('í')).toEqual(['i', 2])
    expect(splitTone('zuò')).toEqual(['zuo', 4])
    expect(splitTone('qǔ')).toEqual(['qu', 3])
  })
  test('Split single char', () => {
    expect(splitCharPinyin('zuò')).toEqual(['z', 'uo', 4])
    expect(splitCharPinyin('shén')).toEqual(['sh', 'en', 2])
    expect(splitCharPinyin('yú')).toEqual(['', 'ü', 2])
    Object.entries(syllables).forEach(([syl, split]) => expect(splitCharPinyin(syl)).toEqual(split))
  })
  test('Split idiom', () => {
    expect(splitIdiomPinyin('zuò wú xū xí'))
      .toEqual([['z', 'uo', 4], ['', 'u', 2], ['x', 'ü', 1], ['x', 'i', 2]])
    expect(splitIdiomPinyin('ē yú fèng chéng'))
      .toEqual([['', 'e', 1], ['', 'ü', 2], ['f', 'eng', 4], ['ch', 'eng', 2]])
  })
})
