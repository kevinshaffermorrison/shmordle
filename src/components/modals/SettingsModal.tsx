import {
  SunIcon,
  BookOpenIcon
} from '@heroicons/react/outline'
import { Dispatch, SetStateAction } from 'react'
import { BaseModal } from './BaseModal'

type Props = {
  isOpen: boolean
  allowedGuesses: number
  updateAllowedGuesses: (event: any) => void
  guesses: string[]
  wordLength: number
  updateWordLength: (event: any) => void
  useDictionary: boolean
  isDarkMode: boolean
  updateFirebaseDoc: (parameters: any) => void
  setIsDarkMode: Dispatch<SetStateAction<boolean>>
  handleClose: () => void
}

export const SettingsModal = ({ 
    isOpen, 
    allowedGuesses, 
    updateAllowedGuesses,
    guesses,
    wordLength, 
    updateWordLength,
    useDictionary, 
    isDarkMode, 
    updateFirebaseDoc,
    setIsDarkMode,
    handleClose 
  }: Props) => {
    const handleDarkMode = (isDark: boolean) => {
        setIsDarkMode(isDark)
        localStorage.setItem('theme', isDark ? 'dark' : 'light')
      }

    return (
    <BaseModal title="Settings" isOpen={isOpen} handleClose={handleClose}>

    <div className="grid grid-cols-2 gap-4 content-center" onClick={() => handleDarkMode(!isDarkMode)}>
      <div className="dark:text-white">Turn on {isDarkMode ? 'Light Mode' : 'Dark Mode'}</div>
      <div className="m-auto">
        <SunIcon
          className={`${isDarkMode ? 'dark:stroke-white': 'text-gray-700'}  h-6 w-6 cursor-pointer dark:stroke-white`}
        />
      </div>
    </div>

    <div className="mt-2 grid grid-cols-2 gap-4 content-center" >
      <div className="dark:text-white">Number of Guesses</div>
      <div className="m-auto">
        <select
            title="Allowed number of guesses"
            value={allowedGuesses}
            onChange={updateAllowedGuesses}
            className="
              form-select 
              appearance-none
              block
              px-1.5
              py-.5
              dark:text-white
              bg-transparent
              rounded
              cursor-pointer
            "
          >
            {guesses.length < 3 && <option value="3">3</option>}
            {guesses.length < 4 && <option value="4">4</option>}
            {guesses.length < 5 && <option value="5">5</option>}
            {guesses.length < 6 && <option value="6">6</option>}
            {guesses.length < 7 && <option value="7">7</option>}
            {guesses.length < 8 && <option value="8">8</option>}
          </select>
      </div>
    </div>


    <div className="mt-2 grid grid-cols-2 gap-4 content-center" >
    <div className="dark:text-white">Word Length</div>
      <div className="m-auto">
        <select
              title="Word Length"
              value={wordLength}
              onChange={updateWordLength}
              className="
                form-select 
                appearance-none
                block
                px-1.5
                py-.5
                dark:text-white
                bg-transparent
                rounded
                cursor-pointer
              "
            >
              {guesses.length < 5 && <option value="5">5</option>}
              {guesses.length < 6 && <option value="6">6</option>}
              {guesses.length < 7 && <option value="7">7</option>}
            </select>
       </div>
    </div>

    <div className="mt-2 grid grid-cols-2 gap-4 content-center"
      onClick={() => {
        console.log('Updating useDictionary')
        updateFirebaseDoc({
          useDictionary: !useDictionary,
          lastModified: new Date().toISOString(),
        })
      }} >
      <div className="dark:text-white">Turn {useDictionary ? 'off' : 'on'} Dictionary</div>
      <div className="m-auto" title="Toggle Dictionary">
        <BookOpenIcon
          className={
            !useDictionary
              ? 'h-6 w-6 cursor-pointer text-gray-400'
              : 'h-6 w-6 cursor-pointer dark:stroke-white'
          }
        />
      </div>
    </div>

    </BaseModal>
  )
}
