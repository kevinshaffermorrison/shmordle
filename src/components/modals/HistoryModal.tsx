import { Grid } from '../grid/Grid'
import { BaseModal } from './BaseModal'
import { PreviousGame } from '../../App'


type Props = {
  isOpen: boolean
  previousGame: PreviousGame
  handleClose: () => void
}

export const HistoryModal = ({ isOpen, previousGame, handleClose }: Props) => {
  return (
    <BaseModal title="Previous Game" isOpen={isOpen} handleClose={handleClose}>
      <h2 className={`${previousGame.success ? 'text-green-600' : 'text-red-600'} my-4`}>
        {previousGame.guesserName} 
        {previousGame.success ? ` guessed ${previousGame.solution}!` : ` didn't guess ${previousGame.solution}...`}
      </h2>
      <Grid
        resetGame={()=>{}}
        allowedGuesses={previousGame.allowedGuesses!}
        isCreatingSolution={false}
        guesses={previousGame.guesses!}
        currentGuess={''}
        solution={previousGame.solution!}
        isGuesser={false}
        friendName={previousGame.guesserName!}
        wordLength={previousGame.wordLength!}
      ></Grid>
      
    </BaseModal>
  )
}
