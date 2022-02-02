import { Cell } from './Cell'

type Props = {
  solution: string
  guess: string
}

export const SolutionRow = ({ solution, guess }: Props) => {
  return (
    <div className="flex justify-center mb-1 pb-5 italic">
      {guess.split('').map((letter, i) => (
        <Cell key={i} value={letter} status={'solution'} />
      ))}
    </div>
  )
}
