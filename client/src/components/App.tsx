import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header.tsx";
import { User, PlayerSignup, PickupGame } from "../types"


function App() {
  const [user, setUser] = useState<User | null>(null)
  const [allGames, setAllGames] = useState<PickupGame[]>([])
  const [currentGame, setCurrentGame] = useState<PickupGame | null>(null)
  const [allSignups, setAllSignups] = useState<PlayerSignup[]>([])
  const [createdGames, setCreatedGames] = useState<PickupGame[]>([])

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch('/authorized')
        if (response.ok) {
          const user: User = await response.json()
          setUser(user)
        } else {
          console.log('No user logged in')
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    })()
  }, [])

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch('/pickup_games')
        if (response.ok) {
          const games: PickupGame[] = await response.json()
          setAllGames(games)
        } else {
          console.log(`Failed to retrieve games. Status: ${response.status}`)
        }
      } catch (error) {
        console.error('Error fetching pickup games:', error)
      }
    })()
  }, [])

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch('/player_signups')
        if (response.ok) {
          const signups: PlayerSignup[] = await response.json()
          setAllSignups(signups)
        } else {
          console.log(`Failed to retrieve signups. Status: ${response.status}`)
        }
      } catch (error) {
        console.error('Error fetching all signups', error)
      }
    })()
  }, [])

  let userSignups: PlayerSignup[] | null = []

  if (user) {
    if (user.player_signups) {
      userSignups = allSignups.filter(signup => {
        if (signup.user.id === user.id) {
          return true
        } else {
          return false
        }
      })
    }
  }


  function updateGameAttendees(newGame: PickupGame) {
    const updatedGamesList = allGames.map(gameObj => {
      if (gameObj.id === newGame.id) {
        return newGame
      } else {
        return gameObj
      }
    })
    setAllGames(updatedGamesList)
  }

  function addNewSignup(newSignup: PlayerSignup) {
    setAllSignups(current => [...current, newSignup])
  }

  function removeSignup(id: number) {
    const updatedSignupList = allSignups.filter(signup => {
      return signup.id !== id
    })
    setAllSignups(updatedSignupList)
  }

  function addNewGame(newGame: PickupGame) {
    setAllGames(current => [...current, newGame])
    setCreatedGames(current => [...current, newGame])
  }

  function deleteNewGame(id: number) {
    const updatedGamesList = allGames.filter(gameObj => {
      return gameObj.id !== id
    })
    const updatedCreatedList = createdGames.filter(gameObj => {
      return gameObj.id !== id
    })
    setAllGames(updatedGamesList)
    setCreatedGames(updatedCreatedList)
  }

  function updateNewGame(newGame: PickupGame) {
    const updatedGameList = allGames.map(gameObj => {
      if (gameObj.id === newGame.id) {
        return newGame
      } else {
        return gameObj
      }
    })
    const updatedCreatedList = createdGames.map(gameObj => {
      if (gameObj.id === newGame.id) {
        return newGame
      } else {
        return gameObj
      }
    })
    setAllGames(updatedGameList)
    setCreatedGames(updatedCreatedList)
  }

  const context = {
    user,
    setUser,
    allGames,
    setAllGames,
    currentGame,
    setCurrentGame,
    updateGameAttendees,
    userSignups,
    addNewSignup,
    removeSignup,
    addNewGame,
    createdGames,
    deleteNewGame,
    updateNewGame
  }

  return (
    <div>
      <Header user={user} setUser={setUser} />
      <Outlet context={context} />
    </div>
  )


}

export default App;
