export type CharPinyin = [string, string, number]
export type IdiomPinyin = CharPinyin[]

const oneCharInitials = [...'bpmfdtnlgkhjqxzcsr']
const twoCharInitials = ['zh', 'ch', 'sh']
export const initials = [...oneCharInitials, ...twoCharInitials]
export const finals = [
  'a', 'o', 'e', 'ai', 'ei', 'ao', 'ou', 'an', 'en', 'ang', 'eng', 'er', 'i', 'ia',
  'io', 'ie', 'iai', 'iao', 'iou', 'ian', 'in', 'iang', 'ing', 'iong', 'u', 'ua',
  'uo', 'uai', 'uei', 'uan', 'uen', 'uang', 'ueng', 'ü', 'üe', 'üan', 'ün', 'ong',
]

export const toneMarks = ['\u0304', '\u0301', '\u030C', '\u0300']

export const splitTone = (pinyin: string): [string, number] => {
  let tone = 0
  for (let i = 0; i < toneMarks.length; i++)
    if (pinyin.normalize('NFD').includes(toneMarks[i])) tone = i + 1

  const replaced = pinyin
    .normalize('NFD')
    .replace(/\u0304|\u0301|\u030C|\u0300/, '')
    .normalize()
  return [replaced, tone]
}

export const handleRule5 = (finals: string): string => {
  switch (finals) {
    case 'iu': return 'iou'
    case 'ui': return 'uei'
    case 'un': return 'uen'
    default: return finals
  }
}

export const splitCharPinyin = (pinyin: string): CharPinyin => {
  // eslint-disable-next-line prefer-const
  let [untoned, tone] = splitTone(pinyin)
  if ('jqx'.includes(untoned[0]) && untoned[1] === 'u')
    untoned = untoned.replace('u', 'ü')

  if (untoned.startsWith('y')) {
    switch (untoned[1]) {
      case 'i': untoned = untoned.slice(1); break
      case 'u': untoned = `ü${untoned.slice(2)}`; break
      default: untoned = `i${untoned.slice(1)}`; break
    }
  }
  else if (untoned.startsWith('w')) {
    untoned = untoned[1] === 'u' ? untoned.slice(1) : `u${untoned.slice(1)}`
  }

  if (twoCharInitials.includes(untoned.slice(0, 2)))
    return [untoned.slice(0, 2), handleRule5(untoned.slice(2)), tone]
  else if (oneCharInitials.includes(untoned.charAt(0)))
    return [untoned.charAt(0), handleRule5(untoned.slice(1)), tone]
  else
    return ['', handleRule5(untoned), tone]
}

export const splitIdiomPinyin = (pinyin: string): IdiomPinyin => {
  return pinyin.split(' ').map(splitCharPinyin)
}

// export function removePinyinTone (pinyin: CharPinyin): CharPinyin
// export function removePinyinTone (pinyin: IdiomPinyin): IdiomPinyin
// export function removePinyinTone(pinyin: CharPinyin | IdiomPinyin) {
//   return pinyin.map((p) => {
//     if (Array.isArray(p))
//       return [p[0], removeTone(p[1])]
//     return removeTone(p)
//   })
// }
