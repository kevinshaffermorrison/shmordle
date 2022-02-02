import { Cell } from '../grid/Cell'
import { BaseModal } from './BaseModal'

type Props = {
  isOpen: boolean
  allowedGuesses: number
  handleClose: () => void
}

export const InfoModal = ({ isOpen, allowedGuesses, handleClose }: Props) => {
  return (
    <BaseModal title="How to play" isOpen={isOpen} handleClose={handleClose}>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        One player will submit a 5 letter word.
      </p>

      <div className="italic flex justify-center mb-1 mt-4">
        <Cell value="W" status="solution" />
        <Cell value="E" status="solution" />
        <Cell value="L" status="solution" />
        <Cell value="L" status="solution" />
        <Cell value="S" status="solution" />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        The other player then guesses the word in {allowedGuesses} tries. After
        each guess, the color of the tiles will change to show how close your
        guess was to the word.
      </p>

      <div className="flex justify-center mb-1 mt-4">
        <Cell value="W" status="correct" />
        <Cell value="E" />
        <Cell value="A" />
        <Cell value="R" />
        <Cell value="Y" />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        The letter W is in the word and in the correct spot.
      </p>

      <div className="flex justify-center mb-1 mt-4">
        <Cell value="P" />
        <Cell value="I" />
        <Cell value="L" status="present" />
        <Cell value="O" />
        <Cell value="T" />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        The letter L is in the word but in the wrong spot.
      </p>

      <div className="flex justify-center mb-1 mt-4">
        <Cell value="V" />
        <Cell value="A" />
        <Cell value="G" />
        <Cell value="U" status="absent" />
        <Cell value="E" />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-300">
        The letter U is not in the word in any spot.
      </p>
    </BaseModal>
  )
}
