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
        className="mt-2 w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
        onClick={() => {
          newGame()
        }}
      >
        Yes Please!
      </button>
    </BaseModal>
  )
}
