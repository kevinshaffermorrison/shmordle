import { BaseModal } from './BaseModal'
import { useState } from 'react'

import { v4 as uuidv4 } from 'uuid'


export const JoinGameModal = () => {
  const [gameId, setGameId] = useState('')
  return (
    <BaseModal title="Welcome to Shmordle!" isOpen={true} noClose={true} handleClose={()=>{}}>
      <div className="items-center justify-center ">
        <button
                type="button"
                className="mt-4 rounded-md border border-transparent shadow-sm px-4 py-1 bg-orange-600 text-base font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                onClick={() => {
                    window.location.href = `${window.location.origin}/${uuidv4()}`;
                }}
            >
                New Game?
            </button>

            <h2 className="my-4 text-xl grow font-bold items-center justify-center flex text-orange-400  ">
                - Or -
            </h2>
            <div></div>
            <input
                className="
                    w-full
                    form-select 
                    appearance-none
                    block
                    py-2
                    my-2
                    text-center
                    dark:text-black
                    rounded
                    cursor-pointer
                "
                placeholder="Enter game name here..."
                type="text"
                value={gameId}
                onChange={(event) => {
                    setGameId(event.target.value)
                }}
            />
            <button
                type="button"
                className="mt-2 rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-600 text-base font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                onClick={() => {
                    window.location.href = `${window.location.origin}/${gameId}`;
                }}
                >
                Join Game!
            </button>
      </div>
    </BaseModal>
  )
}
