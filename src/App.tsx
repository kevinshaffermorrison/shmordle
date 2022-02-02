import {
  InformationCircleIcon,
  // ChartBarIcon,
  SunIcon,
  // AcademicCapIcon,
} from '@heroicons/react/outline'
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  getFirestore,
  doc,
  onSnapshot,
  updateDoc,
  getDoc,
  setDoc,
} from 'firebase/firestore'
import { Alert } from './components/alerts/Alert'
import { Grid } from './components/grid/Grid'
import { Keyboard } from './components/keyboard/Keyboard'
import { NewGameModal } from './components/modals/NewGameModal'
import { AboutModal } from './components/modals/AboutModal'
import { InfoModal } from './components/modals/InfoModal'
import { StatsModal } from './components/modals/StatsModal'
import {
  GAME_TITLE,
  WIN_MESSAGES,
  GAME_COPIED_MESSAGE,
  ABOUT_GAME_MESSAGE,
  NOT_ENOUGH_LETTERS_MESSAGE,
  WORD_NOT_FOUND_MESSAGE,
  CORRECT_WORD_MESSAGE,
} from './constants/strings'
// This solution will need to be updated whenever one person types in a word
import { isWordInWordList, isWinningWord } from './lib/words'
import { addStatsForCompletedGame, loadStats } from './lib/stats'
// import {
//   loadGameStateFromLocalStorage,
//   saveGameStateToLocalStorage,
// } from './lib/localStorage'
import { v4 as uuidv4 } from 'uuid'
import './App.css'

const ALERT_TIME_MS = 2000

function App(firebase: any) {
  const params = useParams()
  let gameId: string = params.gameId!
  if (!gameId) {
    gameId = uuidv4()
    window.location.href += gameId
  }

  const db = getFirestore()
  const prefersDarkMode = window.matchMedia(
    '(prefers-color-scheme: dark)'
  ).matches

  const [guesser, setGuesser] = useState('')
  const [players, setPlayers] = useState([])
  const [allowedGuesses] = useState(5)
  const [solution, setSolution] = useState('')
  const [currentGuess, setCurrentGuess] = useState('')
  const [isGameWon, setIsGameWon] = useState(false)
  const [isNewGameModalOpen, setIsNewGameModalOpen] = useState(false)
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false)
  const [isNotEnoughLetters, setIsNotEnoughLetters] = useState(false)
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false)
  const [isWordNotFoundAlertOpen, setIsWordNotFoundAlertOpen] = useState(false)
  const [isGameLost, setIsGameLost] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('theme')
      ? localStorage.getItem('theme') === 'dark'
      : prefersDarkMode
      ? true
      : false
  )
  const [successAlert, setSuccessAlert] = useState('')

  const [me] = useState<string>(() => {
    let id = localStorage.getItem('id')
    if (!id) {
      id = uuidv4()
      localStorage.setItem('id', id)
    }
    return id
  })
  const [isGuesser, setIsGuesser] = useState(false)
  const [isCreatingSolution, setIsCreatingSolution] = useState(false)

  // Initializes guesses based on if we have played yet for this word.
  const [guesses, setGuesses] = useState<string[]>(() => {
    return []
  })

  const [stats, setStats] = useState(() => loadStats())

  // Initialize stuff here.
  useEffect(() => {
    getDoc(doc(db, 'games', gameId)).then((_doc) => {
      if (_doc.exists()) {
        const data = _doc.data()
        const players: string[] = data.players || []

        if (!players.includes(me)) {
          players.push(me)
          console.log('Adding player 2')
          updateDoc(doc(db, 'games', gameId), {
            players,
          })
        }
      } else {
        console.log('Creating Game')
        setDoc(doc(db, 'games', gameId), {
          solution: '',
          isCreatingSolution: true,
          isGameLost: false,
          isGameWon: false,
          isNewGameModalOpen: false,
          guesses: [],
          guesser: me,
          players: [me],
        })
      }
    })

    const game = onSnapshot(doc(db, 'games', gameId), (doc) => {
      const data = doc.data()
      console.log('GAME UPDATE')
      // Some logic would be nice here for if the other person wins.
      if (data) {
        // debugger
        // console.log(data)
        // console.log({
        //   solution,
        //   guesser,
        //   players,
        //   guesses,
        //   isCreatingSolution,
        //   isGameWon,
        //   isGameLost,
        // })
        setSolution(data.solution)
        setGuesser(data.guesser)
        setPlayers(data.players)
        setGuesses(data.guesses)
        setIsCreatingSolution(data.isCreatingSolution)
        setIsGameWon(data.isGameWon)
        setIsGameLost(data.isGameLost)
        setIsNewGameModalOpen(data.isNewGameModalOpen)
      }
    })
    return () => {
      game()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // [] means it will only update when firestore pushes data

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  const handleDarkMode = (isDark: boolean) => {
    setIsDarkMode(isDark)
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }

  useEffect(() => {
    setIsGuesser(guesser === me)
  }, [guesser, me])

  useEffect(() => {
    if (isGameWon) {
      setSuccessAlert(
        WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)]
      )
      setTimeout(() => {
        setSuccessAlert('')
        setIsNewGameModalOpen(true)
      }, ALERT_TIME_MS)
    }
    if (isGameLost) {
      setTimeout(() => {
        setIsNewGameModalOpen(true)
      }, ALERT_TIME_MS)
    }

    // Need to update here to send message!
  }, [isGameWon, isGameLost])

  // Keypress
  const onChar = (value: string) => {
    if (isCreatingSolution && isGuesser) {
      return
    }
    if (isCreatingSolution) {
      if (solution.length < 5) setSolution(`${solution}${value}`)
    } else if (
      isGuesser &&
      currentGuess.length < 5 &&
      guesses.length < 6 &&
      !isGameWon
    ) {
      setCurrentGuess(`${currentGuess}${value}`)
    }
  }

  // Delete button
  const onDelete = () => {
    if (isCreatingSolution && isGuesser) {
      return
    }
    if (isCreatingSolution) setSolution(solution.slice(0, -1))
    else if (isGuesser) setCurrentGuess(currentGuess.slice(0, -1))
  }

  // need to put state changes into firebase
  const onEnter = async () => {
    if (isCreatingSolution && isGuesser) {
      return
    }
    if (isCreatingSolution) {
      if (!(solution.length === 5)) {
        setIsNotEnoughLetters(true)
        setIsNotEnoughLetters(true)
        return setTimeout(() => {
          setIsNotEnoughLetters(false)
        }, ALERT_TIME_MS)
      }

      if (!isWordInWordList(solution)) {
        setIsWordNotFoundAlertOpen(true)
        return setTimeout(() => {
          setIsWordNotFoundAlertOpen(false)
        }, ALERT_TIME_MS)
      }

      setIsCreatingSolution(false)
      const ref = doc(db, 'games', gameId)
      await updateDoc(ref, {
        solution,
        isCreatingSolution: false,
      })
      console.log("Let's start a new game!")
      return
    }

    if (isGameWon || isGameLost) {
      return
    }
    if (!(currentGuess.length === 5)) {
      setIsNotEnoughLetters(true)
      return setTimeout(() => {
        setIsNotEnoughLetters(false)
      }, ALERT_TIME_MS)
    }

    if (!isWordInWordList(currentGuess)) {
      setIsWordNotFoundAlertOpen(true)
      return setTimeout(() => {
        setIsWordNotFoundAlertOpen(false)
      }, ALERT_TIME_MS)
    }

    const winningWord = isWinningWord(solution, currentGuess)

    if (
      currentGuess.length === 5 &&
      guesses.length < allowedGuesses &&
      !isGameWon
    ) {
      const ref = doc(db, 'games', gameId)
      updateDoc(ref, {
        guesses: [...guesses, currentGuess],
      })
      setCurrentGuess('')

      if (winningWord) {
        setStats(addStatsForCompletedGame(stats, guesses.length))
        const ref = doc(db, 'games', gameId)
        updateDoc(ref, {
          isGameWon: true,
        })
      }
      if (guesses.length === allowedGuesses - 1) {
        setStats(addStatsForCompletedGame(stats, guesses.length + 1))
        const ref = doc(db, 'games', gameId)
        updateDoc(ref, {
          isGameLost: true,
        })
      }
    }
  }

  const resetGame = async () => {
    const ref = doc(db, 'games', gameId)
    console.log('Resetting Game')
    await updateDoc(ref, {
      solution: '',
      currentGuess: '',
      guesser: players.find((p) => guesser !== p),
      guesses: [],
      isCreatingSolution: true,
      isGameWon: false,
      isGameLost: false,
      isNewGameModalOpen: false,
    })
  }

  return (
    <div className="py-8 max-w-7xl mx-auto sm:px-6 lg:px-8">
      <div className="flex w-80 mx-auto items-center mb-8 mt-12">
        <h1 className="text-xl grow font-bold dark:text-white">
          {players.length < 2 ? 'Waiting on a friend!' : GAME_TITLE}
        </h1>

        <SunIcon
          className="h-6 w-6 cursor-pointer dark:stroke-white"
          onClick={() => handleDarkMode(!isDarkMode)}
        />
        <InformationCircleIcon
          className="h-6 w-6 cursor-pointer dark:stroke-white"
          onClick={() => setIsInfoModalOpen(true)}
        />
        {/* <ChartBarIcon
          className="h-6 w-6 cursor-pointer dark:stroke-white"
          onClick={() => setIsStatsModalOpen(true)}
        /> */}
      </div>
      {/* <AcademicCapIcon
        className={
          isGuesser ? 'h-6 w-6 text-indigo-700' : 'h-6 w-6 dark:stroke-white'
        }
        // className="h-6 w-6 cursor-pointer dark:stroke-white"
        onClick={() => setIsGuesser(!isGuesser)}
      />
      <p>{me}</p> */}
      {/* <div className="text-white">
        <p>players: {players}</p>
        <p>me: {me}</p>
        <p>isGuesser: {isGuesser.toString()}</p>
        <p>guesser: {guesser}</p>
        <p>solution: {solution}</p>
        <p>isCreatingSolution: {isCreatingSolution.toString()}</p>
        <p>isGameWon: {isGameWon.toString()}</p>
        <p>isGameLost: {isGameLost.toString()}</p>
        <p>guesses: {guesses}</p>
      </div> */}
      <Grid
        allowedGuesses={allowedGuesses}
        isCreatingSolution={isCreatingSolution}
        guesses={guesses}
        currentGuess={currentGuess}
        solution={solution}
        isGuesser={isGuesser}
      />
      <Keyboard
        onChar={onChar}
        onDelete={onDelete}
        onEnter={onEnter}
        guesses={guesses}
        solution={solution}
      />
      <NewGameModal
        isOpen={isNewGameModalOpen}
        handleClose={() => setIsNewGameModalOpen(false)}
        newGame={resetGame}
      />
      <InfoModal
        isOpen={isInfoModalOpen}
        allowedGuesses={allowedGuesses}
        handleClose={() => setIsInfoModalOpen(false)}
      />
      <StatsModal
        solution={solution}
        isOpen={isStatsModalOpen}
        handleClose={() => setIsStatsModalOpen(false)}
        guesses={guesses}
        gameStats={stats}
        isGameLost={isGameLost}
        isGameWon={isGameWon}
        handleShare={() => {
          setSuccessAlert(GAME_COPIED_MESSAGE)
          return setTimeout(() => setSuccessAlert(''), ALERT_TIME_MS)
        }}
      />
      <AboutModal
        isOpen={isAboutModalOpen}
        handleClose={() => setIsAboutModalOpen(false)}
      />
      <button
        type="button"
        className="mx-auto mt-8 flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 select-none"
        onClick={() => setIsAboutModalOpen(true)}
      >
        {ABOUT_GAME_MESSAGE}
      </button>
      <Alert message={NOT_ENOUGH_LETTERS_MESSAGE} isOpen={isNotEnoughLetters} />
      <Alert
        message={WORD_NOT_FOUND_MESSAGE}
        isOpen={isWordNotFoundAlertOpen}
      />
      <Alert
        message={
          guesser === me
            ? CORRECT_WORD_MESSAGE(solution)
            : `Your friend didn't guess ${solution}`
        }
        isOpen={isGameLost}
      />
      <Alert
        message={guesser !== me ? 'Your friend won!' : successAlert}
        isOpen={successAlert !== ''}
        variant={guesser === me ? 'success' : 'info'}
      />
    </div>
  )
}

function Router(firebase: any) {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/:gameId" element={<App />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router
