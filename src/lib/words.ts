// import { WORDS } from '../constants/wordlist'
// import { VALIDGUESSES } from '../constants/validGuesses'
import { VALIDWORDS } from '../constants/validWords'

export type WordLength = 5 | 6 | 7

export const isWordInWordList = (word: string, wordLength: WordLength) => {
  return (
    VALIDWORDS[wordLength].includes(word.toLowerCase())
  )
}

export const isWinningWord = (solution: string, word: string) => {
  return solution === word
}

export const getWordOfDay = () => {
  // January 1, 2022 Game Epoch
  const epochMs = new Date('January 1, 2022 00:00:00').valueOf()
  const now = Date.now()
  const msInDay = 86400000
  const index = Math.floor((now - epochMs) / msInDay)
  const nextday = (index + 1) * msInDay + epochMs

  return {
    solutionIndex: index,
    tomorrow: nextday,
  }
}

export const { solutionIndex, tomorrow } = getWordOfDay()
