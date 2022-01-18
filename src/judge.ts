import type { CharPinyin, IdiomPinyin } from './interfaces/Pinyin'

const oneCharInitials = [...'bpmfdtnlgkhjqxzcsr']
const twoCharInitials = ['zh', 'ch', 'sh']
const fakeInitials = ['y', 'w']
export const initials = [...oneCharInitials, ...twoCharInitials]

export const splitCharPinyin = (pinyin: string): CharPinyin => {
  if (twoCharInitials.includes(pinyin.slice(0, 2)))
    return [pinyin.slice(0, 2), pinyin.slice(2)]

  if (oneCharInitials.includes(pinyin.charAt(0)))
    return [pinyin.charAt(0), pinyin.slice(1)]

  if (fakeInitials.includes(pinyin.charAt(0)))
    return ['', pinyin.slice(1)]

  return ['', pinyin]
}

export const splitIdiomPinyin = (pinyin: string): IdiomPinyin => {
  return pinyin.split(' ').map(splitCharPinyin)
}

export const removeTone = (pinyin: string): string => {
  return pinyin.normalize('NFD').replace(/\u0304|\u0301|\u030C|\u0300/, '')
}

export function removePinyinTone (pinyin: CharPinyin): CharPinyin
export function removePinyinTone (pinyin: IdiomPinyin): IdiomPinyin
export function removePinyinTone(pinyin: CharPinyin | IdiomPinyin) {
  return pinyin.map((p) => {
    if (Array.isArray(p))
      return [p[0], removeTone(p[1])]
    return removeTone(p)
  })
}
