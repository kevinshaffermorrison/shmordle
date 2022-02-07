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
  wordLength: number
}

export const Grid = ({
  guesses,
  currentGuess,
  allowedGuesses,
  solution,
  isCreatingSolution,
  isGuesser,
  friendName,
  wordLength
}: Props) => {
  if (isCreatingSolution) {
    if (isGuesser) {
      return (
        <div className="pb-6">
          <div className=" mx-0.5 text-lg font-bold text-orange-700 flex items-center  justify-center h-14 mb-1">
            {friendName ? (
              <div className="animate-bounce">
                <span className="italic">{friendName}</span>
                <span> is deciding the next word</span>
              </div>
            ) : (
              <div className="animate-pulse">Waiting for a friend to join!</div>
            )}
          </div>
        </div>
      )
    }
    return (
      <div className="pb-6">
        <div className=" mx-0.5 text-lg font-bold text-orange-700 flex items-center  justify-center h-14 mb-1">
          <div className="animate-bounce">Submit a word for your friend</div>
        </div>
        <CurrentRow wordLength={wordLength} guess={solution} />
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
        {guesses.length < allowedGuesses && <CurrentRow wordLength={wordLength} guess={currentGuess} />}
        {empties.map((_, i) => (
          <EmptyRow wordLength={wordLength} key={i} />
        ))}
      </div>
    )
  }
}
