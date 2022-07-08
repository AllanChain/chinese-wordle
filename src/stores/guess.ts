import { defineStore } from 'pinia'
import type { Idiom } from './idioms'
import { useIdiomsStore } from './idioms'
import type { IdiomPinyin } from '@/pinyin'
import { charEqual, splitIdiomPinyin, splitTone } from '@/pinyin'

export enum GuessResult {
  NotExists = 0,
  Exists = 1,
  CorrectPosition = 2,
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
export enum HintCondition {
  BothEverGuessed,
  BothExistsInOneGuess,
  CombinationCorrect,
  PositionAndToneCorrect,
}
export enum HintTarget {
  Combination,
  CombinationAndTone,
  Char,
}
export interface HintType {
  on: HintCondition
  give: HintTarget
}
export interface Hint {
  content: string
  level: HintTarget
}
export interface Difficulty {
  name: string
  enabledHints: HintType[]
}

export const difficulties: Record<string, Difficulty> = {
  easy: {
    name: '简单',
    enabledHints: [
      { on: HintCondition.BothEverGuessed, give: HintTarget.Combination },
      { on: HintCondition.CombinationCorrect, give: HintTarget.CombinationAndTone },
      { on: HintCondition.PositionAndToneCorrect, give: HintTarget.Char },
    ],
  },
  normal: {
    name: '正常',
    enabledHints: [
      { on: HintCondition.BothEverGuessed, give: HintTarget.Combination },
      { on: HintCondition.CombinationCorrect, give: HintTarget.CombinationAndTone },
    ],
  },
  medium: {
    name: '中等',
    enabledHints: [
      { on: HintCondition.BothExistsInOneGuess, give: HintTarget.Combination },
      { on: HintCondition.CombinationCorrect, give: HintTarget.CombinationAndTone },
    ],
  },
  hard: {
    name: '困难',
    enabledHints: [
      { on: HintCondition.BothExistsInOneGuess, give: HintTarget.Combination },
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
    hints: {} as Record<number, Hint>,
    totalChances: 8,
    difficulty: difficulties.easy,
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

        // Matched parts will be marked as null
        const pinyinFlatten: (string|null)[] = [...this.answerPinyinFlatten]
        const syllables: (string|null)[] = [...this.answerSyllables]
        const result: IdiomGuessResult = []
        for (let i = 0; i < 4; i++) result.push([0, 0, false])

        guess.forEach(([initial, final], charIndex) => {
          [initial, final].forEach((part, partIndex) => {
            if (this.answerPinyin![charIndex][partIndex] === part) {
              pinyinFlatten[charIndex * 2 + partIndex] = null
              result[charIndex][partIndex] = GuessResult.CorrectPosition
            }
          })
          if (syllables[charIndex] === initial + final) {
            syllables[charIndex] = null
            result[charIndex][2] = true
          }
        })

        guess.forEach(([initial, final], charIndex) => {
          [initial, final].forEach((part, partIndex) => {
            if (result[charIndex][partIndex] !== GuessResult.NotExists) return
            if (pinyinFlatten.includes(part)) {
              pinyinFlatten[pinyinFlatten.indexOf(part)] = null
              result[charIndex][partIndex] = GuessResult.Exists
            }
          })
          const syllable = initial + final
          if (syllables.includes(syllable)) {
            syllables[syllables.indexOf(syllable)] = null
            result[charIndex][2] = true
          }
        })

        return result
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
    // guessesSyllables(): string[][] {
    //   return this.guessesPinyin.map((pinyin) => {
    //     return pinyin.map(([initial, final]) => initial + final)
    //   })
    // },
    // guessesSyllablesFlatten(): string[] {
    //   return this.guessesSyllables.flat()
    // },
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
    // enabledHints(): HintType[] {
    //   return this.difficulty.enabledHints.sort((a, b) => a.give - b.give)
    // },
    difficultyName(): string {
      return this.difficulty.name
    },
    // give() {
    //   return (index: number, target: HintTarget) => {
    //     switch (target) {
    //       case HintTarget.Char:
    //         return this.answerIdiom?.charAt(index)
    //       case HintTarget.Combination:
    //         return this.answerPinyin?.[index]?.[0]
    //     }
    //   }
    // },
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
      const lastGuess = this.guesses[this.guesses.length - 1]
      const lastGuessSyllables = lastGuess.pinyin.map(([initial, final]) => initial + final)
      const lastGuessPinyinFlatten = lastGuess.pinyin.flatMap(([initial, final]) => [initial, final])
      for (const [index, pinyin] of this.answerPinyin!.entries()) {
        const [initial, final] = pinyin
        const syllable = initial + final
        const origPinyin = this.answerOrigPinyin.split(' ')[index]
        const previousLevelThisChar = this.hints[index]?.level || -Infinity
        const hintTypes = this.difficulty.enabledHints.filter(
          hint => hint.give > previousLevelThisChar,
        )
        let give: HintTarget | -1 = -1
        for (const hintType of hintTypes) {
          if (hintType.give <= give) continue
          if (
            hintType.on === HintCondition.BothEverGuessed
            && this.guessesPinyinFlatten.includes(initial)
            && this.guessesPinyinFlatten.includes(final)
            && (
              lastGuessPinyinFlatten.includes(initial)
              || lastGuessPinyinFlatten.includes(final)
            )
          )
            give = hintType.give
          else if (
            hintType.on === HintCondition.BothExistsInOneGuess
            && lastGuessPinyinFlatten.includes(initial)
            && lastGuessPinyinFlatten.includes(final)
          )
            give = hintType.give
          else if (
            hintType.on === HintCondition.CombinationCorrect
            && lastGuessSyllables.includes(syllable)
          )
            give = hintType.give
          else if (
            hintType.on === HintCondition.PositionAndToneCorrect
            && charEqual(pinyin, lastGuess.pinyin[index])
          )
            give = hintType.give
        }

        if (give === -1) continue
        let hintContent: string
        switch (give) {
          case HintTarget.Char:
            hintContent = this.answerIdiom.charAt(index)
            break
          case HintTarget.Combination:
            hintContent = splitTone(origPinyin)[0]
            break
          case HintTarget.CombinationAndTone:
            hintContent = origPinyin
            break
        }
        this.hints[index] = {
          content: hintContent,
          level: give,
        }
      }
    },
  },
})
