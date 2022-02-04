import { BaseModal } from './BaseModal'

type Props = {
  isOpen: boolean
  handleClose: () => void
  newGame: () => void
}

export const NewGameModal = ({ isOpen, handleClose, newGame }: Props) => {
  return (
    <BaseModal title="New game?" isOpen={isOpen} handleClose={handleClose}>
      <button
        type="button"
        className="mt-2 rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-600 text-base font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        onClick={() => {
          newGame()
        }}
      >
        Don't mind if I do!
      </button>
    </BaseModal>
  )
}
