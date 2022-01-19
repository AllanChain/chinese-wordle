import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, test } from 'vitest'
import { useIdiomsStore } from '../src/stores/idioms'
import ALL_IDIOMS from '../public/idioms.json'

describe('Idioms Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  test('get correct pinyin', () => {
    const idioms = useIdiomsStore()
    idioms.setAllIdioms(ALL_IDIOMS)
    expect(idioms.isValidIdiom('做贼心虚')).toBe(true)
    expect(idioms.allIdioms['做贼心虚']).toBe('zuò zéi xīn xū')
  })

  test('get known random idiom', () => {
    const idioms = useIdiomsStore()
    idioms.setAllIdioms({ 做贼心虚: 'zuò zéi xīn xū' })
    expect(idioms.randomIdiom()).toBe('做贼心虚')
  })

  test('get random idiom', () => {
    const idioms = useIdiomsStore()
    idioms.setAllIdioms(ALL_IDIOMS)
    const idiom = idioms.randomIdiom()
    expect(idiom).toHaveLength(4)
    expect(idiom).not.toEqual(idioms.randomIdiom())
  })
})
