/*
    TODO: 
        Settings Modal
        Add in ability to make 6/7 letter words?
*/
import {
  InformationCircleIcon,
  // ChartBarIcon,
  SunIcon,
  BookOpenIcon,
  BookmarkIcon,
} from '@heroicons/react/outline'
import { LandingApp } from './LandingApp'
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  getFirestore,
  doc,
  query,
  collection,
  where,
  onSnapshot,
  updateDoc,
  orderBy,
  getDoc,
  setDoc,
  deleteDoc,
} from 'firebase/firestore'
import { Alert } from './components/alerts/Alert'
import { Grid } from './components/grid/Grid'
import { Keyboard } from './components/keyboard/Keyboard'
import { NameModal } from './components/modals/NameModal'
import { OtherGamesModal } from './components/modals/OtherGamesModal'
import { NewGameModal } from './components/modals/NewGameModal'
import { AboutModal } from './components/modals/AboutModal'
import { InfoModal } from './components/modals/InfoModal'
import { StatsModal } from './components/modals/StatsModal'
import {
  WIN_MESSAGES,
  GAME_COPIED_MESSAGE,
  NOT_ENOUGH_LETTERS_MESSAGE,
  WORD_NOT_FOUND_MESSAGE,
  CORRECT_WORD_MESSAGE,
} from './constants/strings'
import { isWordInWordList, isWinningWord } from './lib/words'
import { addStatsForCompletedGame, loadStats } from './lib/stats'
// import {
//   loadGameStateFromLocalStorage,
//   saveGameStateToLocalStorage,
// } from './lib/localStorage'
import { v4 as uuidv4 } from 'uuid'
import './App.css'
import { WordLength } from './lib/words'

const ALERT_TIME_MS = 2000

interface Player {
  name: string
  id: string
}

export interface Games {
  myName: string
  friendName: string
  myTurn: boolean
  gameId: string
  lastModified: string
}

function App(firebase: any) {
  const params = useParams()

  const [gameId] = useState(params.gameId!)
  if (!gameId) {
    // gameId = uuidv4()
    // window.location.href += gameId
  }
  const db = getFirestore()
  const gameRef = doc(db, 'games', gameId)

  const prefersDarkMode = window.matchMedia(
    '(prefers-color-scheme: dark)'
  ).matches

  const [myTurn, setMyTurn] = useState(false)
  const [myGames, setMyGames] = useState<Games[]>([])
  const [useDictionary, setUseDictionary] = useState(true)
  const [guesser, setGuesser] = useState('')
  const [players, setPlayers] = useState<Player[]>([])
  const [allowedGuesses, setAllowedGuesses] = useState(6)
  const [wordLength, setWordLength] = useState<WordLength>(5)
  const [solution, setSolution] = useState('')
  const [currentGuess, setCurrentGuess] = useState('')
  const [isGameWon, setIsGameWon] = useState(false)
  const [isOtherGamesModalOpen, setIsOtherGamesModalOpen] = useState(false)
  const [isNewGameModalOpen, setIsNewGameModalOpen] = useState(false)
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false)
  const [isNotEnoughLetters, setIsNotEnoughLetters] = useState(false)
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false)
  const [isNameModalOpen, setIsNameModalOpen] = useState(false)
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

  const [friendName, setFriendName] = useState('')
  const [myName, setMyName] = useState<string>(() => {
    let name = localStorage.getItem('name')
    if (!name) {
      setIsNameModalOpen(true)
    }
    return name || ''
  })

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
    if (!myName) {
      return
    }
    getDoc(doc(db, 'games', gameId)).then((_doc) => {
      if (_doc.exists()) {
        console.log('Doc Exists')
        const data = _doc.data()
        const players: Player[] = data.players || []
        const playerIds: string[] = data.playerIds || []

        if (players.length === 0) {
          console.log('0 -> 1 users')
          updateDoc(doc(db, 'games', gameId), {
            players: [{ id: me, name: myName }],
            playerIds: [me],
            lastModified: new Date().toISOString(),
          })
        } else if (players.length === 1) {
          if (!playerIds.includes(me)) {
            players.push({ id: me, name: myName })
            playerIds.push(me)
            console.log('1 -> 2 users')
            updateDoc(doc(db, 'games', gameId), {
              players,
              playerIds,
              lastModified: new Date().toISOString(),
            })
          }
        } else if (players.length >= 2 && !playerIds.includes(me)) {
          // probably don't want to just redirect people to a new game
          // that they aren't expecting...
          // should also have a good way to create a new game
          //   const newGameId = uuidv4()
          window.location.href = window.location.origin
        }
      } else {
        console.log('Creating Game')
        setDoc(doc(db, 'games', gameId), {
          wordLength,
          allowedGuesses,
          solution: '',
          isCreatingSolution: true,
          isGameLost: false,
          isGameWon: false,
          isNewGameModalOpen: false,
          guesses: [],
          guesser: me,
          players: [{ id: me, name: myName }],
          playerIds: [me],
          lastModified: new Date().toISOString(),
        })
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const game = onSnapshot(doc(db, 'games', gameId), (doc) => {
      const data = doc.data()
      console.log('GAME UPDATE')
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
        setUseDictionary(data.useDictionary)
        setAllowedGuesses(data.allowedGuesses)
        setWordLength(data.wordLength)
      }
    })
    return () => {
      game()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // [] means it will only update when firestore pushes data

  useEffect(() => {
    console.log('PLAYER GAMES UPDATE')
    const q = query(
      collection(db, 'games'),
      where('playerIds', 'array-contains', me),
      orderBy('lastModified', 'desc')
    )
    const myGamesShapshot = onSnapshot(q, (querySnapshot) => {
      let _myGames: Games[] = []
      setMyTurn(false)
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        const friend =
          data.players.find((p: { id: string; name: string }) => p.id !== me) ||
          {}
        if (doc.id !== gameId) {
          const _myTurn = data.isCreatingSolution
            ? data.guesser !== me
              ? true
              : false
            : data.guesser === me
            ? true
            : false
          if (_myTurn) {
            setMyTurn(true)
          }
          _myGames.push({
            myName: myName,
            friendName: friend.name,
            myTurn: _myTurn,
            gameId: doc.id,
            lastModified: data.lastModified,
            // figure out my name, my opponents name, and whose turn it is
          })
        }
      })
      _myGames.sort((a, b) => (a.lastModified < b.lastModified ? 1 : -1))
      setMyGames(_myGames)
    })
    return () => {
      myGamesShapshot()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me]) // [] means it will only update when firestore pushes data

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
    const friend = players.find((p) => p.id !== me)
    if (friend) setFriendName(friend.name)
    else setFriendName('')
  }, [players, me])

  useEffect(() => {
    localStorage.setItem('name', myName)
  }, [myName])

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
      if (solution.length < Number(wordLength))
        setSolution(`${solution}${value}`)
    } else if (
      isGuesser &&
      currentGuess.length < Number(wordLength) &&
      guesses.length < allowedGuesses &&
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
    if (isNameModalOpen) {
      return
    }
    if (isCreatingSolution && isGuesser) {
      return
    }
    if (isCreatingSolution) {
      if (!(solution.length === Number(wordLength))) {
        debugger
        setIsNotEnoughLetters(true)
        return setTimeout(() => {
          setIsNotEnoughLetters(false)
        }, ALERT_TIME_MS)
      }

      if (useDictionary) {
        if (!isWordInWordList(solution, wordLength)) {
          setIsWordNotFoundAlertOpen(true)
          return setTimeout(() => {
            setIsWordNotFoundAlertOpen(false)
          }, ALERT_TIME_MS)
        }
      }

      setIsCreatingSolution(false)
      console.log('Done creating')
      await updateDoc(gameRef, {
        solution,
        isCreatingSolution: false,
        lastModified: new Date().toISOString(),
      })
      console.log("Let's start a new game!")
      return
    }

    if (isGameWon || isGameLost) {
      return
    }
    if (!(currentGuess.length === Number(wordLength))) {
      setIsNotEnoughLetters(true)
      return setTimeout(() => {
        setIsNotEnoughLetters(false)
      }, ALERT_TIME_MS)
    }

    if (useDictionary) {
      if (!isWordInWordList(currentGuess, wordLength)) {
        setIsWordNotFoundAlertOpen(true)
        return setTimeout(() => {
          setIsWordNotFoundAlertOpen(false)
        }, ALERT_TIME_MS)
      }
    }

    const winningWord = isWinningWord(solution, currentGuess)

    if (
      currentGuess.length === Number(wordLength) &&
      guesses.length < allowedGuesses &&
      !isGameWon
    ) {
      console.log('Updating guesses')
      updateDoc(gameRef, {
        guesses: [...guesses, currentGuess],
        lastModified: new Date().toISOString(),
      })
      setCurrentGuess('')

      if (winningWord) {
        setStats(addStatsForCompletedGame(stats, guesses.length))

        console.log('Updating gameWon')
        updateDoc(gameRef, {
          isGameWon: true,
          lastModified: new Date().toISOString(),
        })
      }
      if (guesses.length === allowedGuesses - 1) {
        setStats(addStatsForCompletedGame(stats, guesses.length + 1))

        console.log('Updating gameLost')
        updateDoc(gameRef, {
          isGameLost: true,
          lastModified: new Date().toISOString(),
        })
      }
    }
  }

  const resetGame = async () => {
    console.log('Resetting Game')
    await updateDoc(gameRef, {
      solution: '',
      currentGuess: '',
      guesser: players.find((p) => guesser !== p.id)!.id,
      guesses: [],
      isCreatingSolution: true,
      isGameWon: false,
      isGameLost: false,
      isNewGameModalOpen: false,
      lastModified: new Date().toISOString(),
    })
  }

  const updateAllowedGuesses = (event: any) => {
    const newAllowedGuesses = event.target.value
    if (newAllowedGuesses <= guesses.length) {
      return
    }
    console.log('Updating allowedGuesses')
    updateDoc(gameRef, {
      allowedGuesses: newAllowedGuesses,
      lastModified: new Date().toISOString(),
    })
  }

  const updateWordLength = (event: any) => {
    const newWordLength = event.target.value

    console.log('Updating WordLength')
    updateDoc(gameRef, {
      wordLength: newWordLength,
      lastModified: new Date().toISOString(),
    })
  }

  const leaveGame = async () => {
    const _players = players.filter((p) => p.id !== me)
    const _playerIds = _players.map((p) => p.id)

    console.log('leavingGame')

    if (_playerIds.length === 0) {
      await deleteDoc(gameRef)
    } else {
      await updateDoc(gameRef, {
        players: _players,
        playerIds: _playerIds,
        lastModified: new Date().toISOString(),
      })
    }

    window.location.href = window.location.origin
  }

  const share = () => {
    if (navigator.share) {
      navigator
        .share({
          title: 'Shmordle',
          text: 'Play me in Shmordle!',
          url: window.location.href,
        })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error))
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      alert('Game link copied to clipboard')
    }
  }

  return (
    <div className=" max-w-7xl mx-auto sm:px-6 lg:px-8">
      <div
        hidden={!gameId}
        className="flex w-80 mx-auto items-center mb-6 mt-6"
      >
        <h2 className="text-xl grow font-bold  text-orange-400  ">
          {myName}{' '}
          <small>
            <small>vs</small>
          </small>{' '}
          {friendName || <span className="italic">???</span>}
        </h2>
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
        <div title="Toggle Dictionary">
          <BookOpenIcon
            className={
              !useDictionary
                ? 'h-6 w-6 cursor-pointer text-gray-700'
                : 'h-6 w-6 cursor-pointer dark:stroke-white'
            }
            onClick={() => {
              console.log('Updating useDictionary')
              updateDoc(gameRef, {
                useDictionary: !useDictionary,
                lastModified: new Date().toISOString(),
              })
            }}
          />
        </div>
        <SunIcon
          className="h-6 w-6 cursor-pointer dark:stroke-white"
          onClick={() => handleDarkMode(!isDarkMode)}
        />
        <BookmarkIcon
          className={`${
            myTurn && 'animate-pulse'
          } h-6 w-6 cursor-pointer dark:stroke-white`}
          onClick={() => setIsOtherGamesModalOpen(true)}
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
      <Grid
        allowedGuesses={allowedGuesses}
        isCreatingSolution={isCreatingSolution}
        guesses={guesses}
        currentGuess={currentGuess}
        solution={solution}
        isGuesser={isGuesser}
        friendName={friendName}
        wordLength={wordLength}
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
      <NameModal
        isOpen={isNameModalOpen}
        updateMyName={(name) => {
          setMyName(name)
          setIsNameModalOpen(false)
        }}
        handleClose={() => {
          myName && setIsNameModalOpen(false)
        }}
      />
      <OtherGamesModal
        isOpen={isOtherGamesModalOpen}
        myGames={myGames}
        handleClose={() => {
          setIsOtherGamesModalOpen(false)
        }}
      />
      <div className="items-center justify-center flex mx-auto">
        <button
          disabled={!(isGameLost || isGameWon || isNewGameModalOpen)}
          type="button"
          className={`${
            !(isGameLost || isGameWon || isNewGameModalOpen)
              ? 'disabled:opacity-50'
              : ''
          } mx-1 mt-8  px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-orange-700 bg-orange-100 hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 select-none`}
          onClick={resetGame}
        >
          Play Again
        </button>
        {/* <button
          type="button"
          className="mx-1 mt-8  px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-orange-100 bg-orange-700 hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-200 select-none"
          onClick={() => setIsAboutModalOpen(true)}
        >
          {ABOUT_GAME_MESSAGE}
        </button> */}
        <button
          type="button"
          className="mx-1 mt-8  px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-orange-100 bg-orange-700 hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-200 select-none"
          onClick={share}
        >
          Invite a friend
        </button>
        <button
          type="button"
          className="mx-1 mt-8  px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-orange-700 bg-orange-100 hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 select-none"
          onClick={() => leaveGame()}
        >
          Leave Game
        </button>
      </div>
      <Alert message={NOT_ENOUGH_LETTERS_MESSAGE} isOpen={isNotEnoughLetters} />
      <Alert
        message={WORD_NOT_FOUND_MESSAGE}
        isOpen={isWordNotFoundAlertOpen}
      />
      <Alert
        message={
          guesser === me
            ? CORRECT_WORD_MESSAGE(solution)
            : `${friendName} didn't guess ${solution}`
        }
        isOpen={isGameLost}
      />
      <Alert
        message={
          guesser !== me ? `${friendName} figured out the word!` : successAlert
        }
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
        <Route path="/" element={<LandingApp />} />
        <Route path="/:gameId" element={<App />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router
