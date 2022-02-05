import { useState, useEffect } from 'react'
import {
  getFirestore,
  query,
  collection,
  where,
  onSnapshot,
  orderBy,
} from 'firebase/firestore'
import { Games } from './App'
import { JoinGameModal } from './components/modals/JoinGameModal'

import { v4 as uuidv4 } from 'uuid'

export function LandingApp() {
  document.documentElement.classList.add('dark')
  const db = getFirestore()
  const [me] = useState<string>(() => {
    let id = localStorage.getItem('id')
    if (!id) {
      id = uuidv4()
      localStorage.setItem('id', id)
    }
    return id
  })
  const [myName] = useState<string>(() => {
    let name = localStorage.getItem('name')
    return name || ''
  })

  const [myGames, setMyGames] = useState<Games[]>([])
  useEffect(() => {
    console.log('PLAYER GAMES UPDATE')
    const q = query(
      collection(db, 'games'),
      where('playerIds', 'array-contains', me),
      orderBy('lastModified', 'desc')
    )
    const myGamesShapshot = onSnapshot(q, (querySnapshot) => {
      let _myGames: Games[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        const friend =
          data.players.find((p: { id: string; name: string }) => p.id !== me) ||
          {}
        const _myTurn = data.isCreatingSolution
          ? data.guesser !== me
            ? true
            : false
          : data.guesser === me
          ? true
          : false
        _myGames.push({
          myName: myName,
          friendName: friend.name,
          myTurn: _myTurn,
          gameId: doc.id,
          lastModified: data.lastModified,
          // figure out my name, my opponents name, and whose turn it is
        })
      })
      _myGames.sort((a, b) => (a.lastModified < b.lastModified ? 1 : -1))
      setMyGames(_myGames)
    })
    return () => {
      myGamesShapshot()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me])
  return (
    <div>
      <JoinGameModal myGames={myGames}></JoinGameModal>
    </div>
  )
}
