import { defineStore } from 'pinia'
import type { Idiom } from './idioms'
import { useIdiomsStore } from './idioms'
import type { IdiomPinyin } from '@/pinyin'
import { splitIdiomPinyin } from '@/pinyin'

export enum GuessResult {
  NotExists,
  Exists,
  CorrectPosition,
}
export type CharGuessResult = [GuessResult, GuessResult]
export type IdiomGuessResult = CharGuessResult[]
export interface Guess {
  idiom: Idiom
  pinyin: IdiomPinyin
  origPinyin: string
  result: IdiomGuessResult
}

export const useGuessStore = defineStore('guess', {
  state: () => ({
    answerIdiom: null as Idiom | null,
    guesses: [] as Guess[],
  }),
  getters: {
    answerOrigPinyin(state): string | null {
      if (state.answerIdiom === null) return null
      const idioms = useIdiomsStore()
      return idioms.allIdioms[state.answerIdiom]
    },
    answerPinyin(): IdiomPinyin | null {
      if (this.answerOrigPinyin === null) return null
      return splitIdiomPinyin(this.answerOrigPinyin)
    },
    compareIdiomPinyin() {
      return (guess: IdiomPinyin): IdiomGuessResult => {
        if (this.answerPinyin === null)
          throw new Error('answer is not set')
        const answerFlatten = this.answerPinyin.flatMap(
          ([initial, final]) => [initial, final],
        )
        return guess.map(([initial, final], charIndex) => {
          return [initial, final].map((part, partIndex) => {
            if (this.answerPinyin![charIndex][partIndex] === part)
              return GuessResult.CorrectPosition
            if (answerFlatten.includes(part))
              return GuessResult.Exists
            return GuessResult.NotExists
          }) as CharGuessResult
        })
      }
    },
  },
  actions: {
    initAnswerIdiom(idiom: Idiom) {
      this.answerIdiom = idiom
    },
    /**
     * Try to add a guess.
     * @param guess Idiom to guess
     * @returns Success or not
     */
    guessIdiom(guess: Idiom): boolean {
      const idioms = useIdiomsStore()
      if (!idioms.isValidIdiom(guess)) return false
      const origPinyin = idioms.allIdioms[guess]
      const pinyin = splitIdiomPinyin(origPinyin)
      this.guesses.push({
        idiom: guess,
        pinyin,
        origPinyin,
        result: this.compareIdiomPinyin(pinyin),
      })
      return true
    },
  },
})
