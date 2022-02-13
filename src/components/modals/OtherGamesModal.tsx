import { BaseModal } from './BaseModal'
import { Games } from '../../App';
import { v4 as uuidv4 } from 'uuid'
import { useNavigate } from 'react-router-dom'

type Props = {
  isOpen: boolean
  myGames: Games[],
  handleClose: () => void
}

export const OtherGamesModal = ({ isOpen, myGames, handleClose }: Props) => {
  const navigate = useNavigate();
  return (
    <BaseModal title="Other Games" isOpen={isOpen} handleClose={handleClose}>
        <div>
            {myGames.length === 0 &&
              <p className="text-l grow text-center font-bold  text-orange-400">
                  You have no other games right now!
              </p>
            }
            {myGames.map((_, i) => (
              <p key={i}
                  onClick={() => {navigate(`/${_.gameId}`)}}
                  className={`${_.myTurn ? 'animate-pulse' : ''} cursor-pointer text-l grow text-center font-bold  text-orange-400`}
              >
                {_.myName}{' '}
                <small>
                <small>vs</small>
                </small>{' '}
                {_.friendName || <span className="italic">???</span>}
              </p>
            ))}
        <button
            type="button"
            className="mt-4 rounded-md border border-transparent shadow-sm px-4 py-1 bg-orange-600 text-base font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            onClick={() => {
                window.open(`${window.location.origin}/${uuidv4()}`, '_blank');
            }}
        >
            Open a new game!
        </button>
      </div>
    </BaseModal>
  )
}
