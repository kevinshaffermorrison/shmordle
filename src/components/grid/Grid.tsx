import { SolutionRow } from './SolutionRow'
import { CompletedRow } from './CompletedRow'
import { CurrentRow } from './CurrentRow'
import { EmptyRow } from './EmptyRow'

type Props = {
  allowedGuesses: number
  guesses: string[]
  currentGuess: string
  isCreatingSolution: boolean
  solution: string
  isGuesser: boolean
  friendName: string
}

export const Grid = ({
  guesses,
  currentGuess,
  allowedGuesses,
  solution,
  isCreatingSolution,
  isGuesser,
  friendName,
}: Props) => {
  if (isCreatingSolution) {
    if (isGuesser) {
      return (
        <div className="pb-6">
          <div className=" mx-0.5 text-lg font-bold text-indigo-700 flex items-center  justify-center h-14 mb-1">
            {friendName ? (
              <div>
                <span className="italic">{friendName}</span>
                <span> is deciding the next word</span>
              </div>
            ) : (
              'Waiting for a friend to join!'
            )}
          </div>
        </div>
      )
    }
    return (
      <div className="pb-6">
        <CurrentRow guess={solution} />
      </div>
    )
  } else {
    const empties =
      guesses.length < allowedGuesses
        ? Array.from(Array(allowedGuesses - guesses.length - 1))
        : []
    return (
      <div className="pb-6">
        {!isGuesser && (
          <SolutionRow solution={solution} key={100} guess={solution} />
        )}
        {guesses.map((guess, i) => (
          <CompletedRow solution={solution} key={i} guess={guess} />
        ))}
        {guesses.length < allowedGuesses && <CurrentRow guess={currentGuess} />}
        {empties.map((_, i) => (
          <EmptyRow key={i} />
        ))}
      </div>
    )
  }
}
