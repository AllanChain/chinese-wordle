import { defineStore } from 'pinia'
import type { Idiom } from './idioms'
import { useIdiomsStore } from './idioms'
import type { IdiomPinyin } from '@/pinyin'
import { charEqual, splitIdiomPinyin, splitTone } from '@/pinyin'

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
  GiveCharacter_IfPositionToneCorrect,
}
export interface Difficulty {
  name: string
  enabledHints: HintType[]
}

export const difficulties: Record<string, Difficulty> = {
  easy: {
    name: '简单',
    enabledHints: [
      HintType.GiveCombination_IfBothEverGuessed,
      HintType.GiveTone_IfCombinationCorrect,
      HintType.GiveCharacter_IfPositionToneCorrect,
    ],
  },
  normal: {
    name: '正常',
    enabledHints: [
      HintType.GiveCombination_IfBothEverGuessed,
      HintType.GiveTone_IfCombinationCorrect,
    ],
  },
  medium: {
    name: '中等',
    enabledHints: [
      HintType.GiveCombination_IfBothExistsInOneGuess,
      HintType.GiveTone_IfCombinationCorrect,
    ],
  },
  hard: {
    name: '困难',
    enabledHints: [
      HintType.GiveCombination_IfBothExistsInOneGuess,
    ],
  },
  insane: {
    name: '神仙',
    enabledHints: [],
  },
}

export const useGuessStore = defineStore('guess', {
  state: () => ({
    answerIdiom: null as Idiom | null,
    guessedIdioms: [] as Idiom[],
    hints: [] as string[],
    totalChances: 8,
    difficulty: 'easy',
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
    answerPinyinFlatten(): string[] | null {
      if (this.answerPinyin === null) return null
      return this.answerPinyin.flatMap(([initial, final]) => [initial, final])
    },
    answerSyllables(): string[]|null {
      if (this.answerPinyin === null) return null
      return this.answerPinyin.map(
        ([initial, final]) => initial + final,
      )
    },
    compareIdiomPinyin() {
      return (guess: IdiomPinyin): IdiomGuessResult => {
        if (this.answerPinyinFlatten === null || this.answerSyllables === null)
          throw new Error('answer is not set')
        return guess.map(([initial, final], charIndex) => {
          const [initialResult, finalResult] = [initial, final].map(
            (part, partIndex) => {
              if (this.answerPinyin![charIndex][partIndex] === part)
                return GuessResult.CorrectPosition
              if (this.answerPinyinFlatten!.includes(part))
                return GuessResult.Exists
              return GuessResult.NotExists
            })
          const combinationResult = this.answerSyllables!.includes(initial + final)
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
    guessesPinyin(): IdiomPinyin[] {
      return this.guesses.map(guess => guess.pinyin)
    },
    guessesPinyinFlatten(): string[] {
      return this.guessesPinyin.flatMap((pinyin) => {
        return pinyin.flatMap(([initial, final]) => [initial, final])
      })
    },
    guessesSyllables(): string[][] {
      return this.guessesPinyin.map((pinyin) => {
        return pinyin.map(([initial, final]) => initial + final)
      })
    },
    guessesSyllablesFlatten(): string[] {
      return this.guessesSyllables.flat()
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
    lost(): boolean {
      return this.guessedIdioms.length >= this.totalChances && !this.won
    },
    includeList(): string[] {
      if (this.answerPinyinFlatten === null) return []
      return this.answerPinyinFlatten.filter(p => this.guessesPinyinFlatten.includes(p))
    },
    excludeList(): string[] {
      if (this.answerPinyinFlatten === null) return []
      return this.guessesPinyinFlatten.filter(p => !this.answerPinyinFlatten!.includes(p))
    },
    enabledHints(): HintType[] {
      return difficulties[this.difficulty].enabledHints
    },
    difficultyName(): string {
      return difficulties[this.difficulty].name
    },
  },
  actions: {
    reset() {
      this.answerIdiom = null
      this.guessedIdioms = []
      this.hints = []
    },
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
      if (!this.won) this.updateHints()
      return true
    },
    updateHints() {
      if (!this.answerIdiom || !this.answerOrigPinyin) return []
      const hints: string[] = []
      for (const [index, pinyin] of this.answerPinyin!.entries()) {
        const [initial, final] = pinyin
        const syllable = initial + final
        const origPinyin = this.answerOrigPinyin.split(' ')[index]
        if (this.enabledHints.includes(HintType.GiveCharacter_IfPositionToneCorrect)) {
          if (charEqual(pinyin, this.guesses[this.guesses.length - 1].pinyin[index])) {
            hints.push(this.answerIdiom.charAt(index))
            continue
          }
        }
        if (this.enabledHints.includes(HintType.GiveTone_IfCombinationCorrect)) {
          if (this.guessesSyllablesFlatten.includes(syllable)) {
            hints.push(origPinyin)
            continue
          }
        }
        if (this.enabledHints.includes(HintType.GiveCombination_IfBothEverGuessed)) {
          if (
            this.guessesPinyinFlatten.includes(initial)
            && this.guessesPinyinFlatten.includes(final)
          ) {
            hints.push(splitTone(origPinyin)[0])
            continue
          }
        }
        if (this.enabledHints.includes(HintType.GiveCombination_IfBothExistsInOneGuess)) {
          if (this.guessesPinyin.findIndex((pinyin) => {
            const pinyinFlatten = pinyin.flatMap(([initial, final]) => [initial, final])
            return pinyinFlatten.includes(initial) && pinyinFlatten.includes(final)
          }) !== -1) {
            hints.push(splitTone(origPinyin)[0])
            continue
          }
        }
      }
      this.hints.push(...hints.filter(hint => !this.hints.includes(hint)))
    },
  },
})
