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
export type CombinationResult = boolean
export type CharGuessResult = [GuessResult, GuessResult, CombinationResult]
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
    guessedIdioms: [] as Idiom[],
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
        const answerSyllables = this.answerPinyin.map(
          ([initial, final]) => initial + final,
        )
        return guess.map(([initial, final], charIndex) => {
          const [initialResult, finalResult] = [initial, final].map(
            (part, partIndex) => {
              if (this.answerPinyin![charIndex][partIndex] === part)
                return GuessResult.CorrectPosition
              if (answerFlatten.includes(part))
                return GuessResult.Exists
              return GuessResult.NotExists
            })
          const combinationResult = answerSyllables.includes(initial + final)
          return [initialResult, finalResult, combinationResult]
        })
      }
    },
    guesses(): Guess[] {
      const idioms = useIdiomsStore()
      return this.guessedIdioms.map((idiom) => {
        const origPinyin = idioms.allIdioms[idiom]
        const pinyin = splitIdiomPinyin(origPinyin)
        return {
          idiom,
          pinyin,
          origPinyin,
          result: this.compareIdiomPinyin(pinyin),
        }
      })
    },
    won(): boolean {
      return (
        this.guesses.length !== 0
        && this.guesses[this.guesses.length - 1].result.every(
          result => (
            result[0] === GuessResult.CorrectPosition
            && result[1] === GuessResult.CorrectPosition
          ),
        )
      )
    },
    hints(): string[] {
      const hints: string[] = []
      const guessFlatten = this.guesses.flatMap(({ pinyin }) => {
        return pinyin.flatMap(([initial, final]) => [initial, final])
      })
      const guessSyllables = this.guesses.flatMap(({ pinyin }) => {
        return pinyin.map(([initial, final]) => initial + final)
      })
      for (const pinyin of this.answerPinyin!) {
        const [initial, final] = pinyin
        if (
          guessFlatten.includes(initial)
           && guessFlatten.includes(final)
           && !guessSyllables.includes(initial + final)
        )
          hints.push(`${initial}+${final}`)
      }
      return hints
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
      this.guessedIdioms.push(guess)
      return true
    },
  },
})
