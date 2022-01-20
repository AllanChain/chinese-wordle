import { defineStore } from 'pinia'
import type { Idiom } from './idioms'
import { useIdiomsStore } from './idioms'
import type { IdiomPinyin } from '@/pinyin'
import { splitIdiomPinyin, splitTone } from '@/pinyin'

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
export enum HintType {
  GiveCombination_IfBothEverGuessed,
  GiveCombination_IfBothExistsInOneGuess,
  GiveTone_IfCombinationCorrect,
  GiveCharacter_IfBothPositionCorrect,
}

export const useGuessStore = defineStore('guess', {
  state: () => ({
    answerIdiom: null as Idiom | null,
    guessedIdioms: [] as Idiom[],
    enabledHints: [] as HintType[],
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
    hints(state): string[] {
      if (!state.answerIdiom || !this.answerOrigPinyin) return []
      const hints: string[] = []
      const guessesPinyin = this.guesses.map(guess => guess.pinyin)
      const guessesFlatten = guessesPinyin.flatMap((pinyin) => {
        return pinyin.flatMap(([initial, final]) => [initial, final])
      })
      const guessesSyllables = guessesPinyin.map((pinyin) => {
        return pinyin.map(([initial, final]) => initial + final)
      })
      const guessesSyllablesFlatten = guessesSyllables.flat()
      for (const [index, pinyin] of this.answerPinyin!.entries()) {
        const [initial, final] = pinyin
        const syllable = initial + final
        const origPinyin = this.answerOrigPinyin.split(' ')[index]
        if (state.enabledHints.includes(HintType.GiveCharacter_IfBothPositionCorrect)) {
          if (guessesSyllables.findIndex(pinyin => pinyin.includes(syllable)) !== -1) {
            hints.push(state.answerIdiom.charAt(index))
            continue
          }
        }
        if (state.enabledHints.includes(HintType.GiveTone_IfCombinationCorrect)) {
          if (guessesSyllablesFlatten.includes(syllable)) {
            hints.push(origPinyin)
            continue
          }
        }
        if (state.enabledHints.includes(HintType.GiveCombination_IfBothEverGuessed)) {
          if (guessesFlatten.includes(initial) && guessesFlatten.includes(final)) {
            hints.push(splitTone(origPinyin)[0])
            continue
          }
        }
        if (state.enabledHints.includes(HintType.GiveCombination_IfBothExistsInOneGuess)) {
          if (guessesPinyin.findIndex((pinyin) => {
            const pinyinFlatten = pinyin.flatMap(([initial, final]) => [initial, final])
            return pinyinFlatten.includes(initial) && pinyinFlatten.includes(final)
          }) !== -1) {
            hints.push(splitTone(origPinyin)[0])
            continue
          }
        }
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
