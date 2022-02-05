import { Cell } from './Cell'

type Props = {
  guess: string
  wordLength: number
}

export const CurrentRow = ({ guess, wordLength }: Props) => {
  const splitGuess = guess.split('')
  let emptyCells: any[];
  emptyCells = Array.from(Array(Number(wordLength) - splitGuess.length))

  return (
    <div className="flex justify-center mb-1">
      {splitGuess.map((letter, i) => (
        <Cell key={i} value={letter} />
      ))}
      {emptyCells.map((_, i) => (
        <Cell key={i} />
      ))}
    </div>
  )
}
