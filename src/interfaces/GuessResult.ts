export enum GuessResult {
  CorrectPosition,
  Exists,
  NotExists,
}
export type CharGuessResult = [GuessResult, GuessResult]
export type IdiomGuessResult = CharGuessResult[]
