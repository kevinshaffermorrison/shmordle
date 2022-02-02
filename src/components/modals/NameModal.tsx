import { BaseModal } from './BaseModal'
import { useState } from 'react'

type Props = {
  isOpen: boolean
  updateMyName: (myNewName: string) => void
  handleClose: () => void
}

export const NameModal = ({ isOpen, updateMyName, handleClose }: Props) => {
  const [myNewName, updateMyNewName] = useState('')
  return (
    <BaseModal title="Welcome!" isOpen={isOpen} handleClose={handleClose}>
      <div className="items-center justify-center ">
        <p className="text-sm text-gray-500 dark:text-gray-300">
          Let's get to know eachother better, what's your name?
        </p>
        <input
          className="
            w-full
            form-select 
            appearance-none
            block
            py-2
            mt-2
            text-center
            dark:text-black
            rounded
            cursor-pointer
        "
          type="text"
          value={myNewName}
          onChange={(event) => {
            updateMyNewName(event.target.value)
          }}
        />
        <button
          type="button"
          className="mt-2 rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() => {
            updateMyName(myNewName)
          }}
        >
          Save!
        </button>
      </div>
    </BaseModal>
  )
}
