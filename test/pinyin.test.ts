import { describe, expect, test } from 'vitest'
import { removePinyinTone, removeTone, splitCharPinyin, splitIdiomPinyin } from '../src/judge'

describe('Pinyin processing', () => {
  test('Split single char', () => {
    expect(splitCharPinyin('zuò')).toEqual(['z', 'uò'])
    expect(splitCharPinyin('shén')).toEqual(['sh', 'én'])
    expect(splitCharPinyin('yú')).toEqual(['', 'ú'])
  })
  test('Split idiom', () => {
    expect(splitIdiomPinyin('zuò wú xū xí'))
      .toEqual([['z', 'uò'], ['', 'ú'], ['x', 'ū'], ['x', 'í']])
    expect(splitIdiomPinyin('ē yú fèng chéng'))
      .toEqual([['', 'ē'], ['', 'ú'], ['f', 'èng'], ['ch', 'éng']])
  })
  test('Remove tone', () => {
    expect(removeTone('én')).toEqual('en')
    expect(removeTone('í')).toEqual('i')
  })
  test('Remove CharPinyin tone', () => {
    expect(removePinyinTone(['z', 'uò'])).toEqual(['z', 'uo'])
    expect(removePinyinTone(['', 'ú'])).toEqual(['', 'u'])
  })
  test('Remove IdiomPinyin tone', () => {
    expect(removePinyinTone([['z', 'uò'], ['', 'ú'], ['x', 'ū'], ['x', 'í']]))
      .toEqual([['z', 'uo'], ['', 'u'], ['x', 'u'], ['x', 'i']])
  })
})
