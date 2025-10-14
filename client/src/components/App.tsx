import React, { useEffect, useState } from "react";
import { Switch, Route, Outlet } from "react-router-dom";

import Header from "./Header.tsx";

interface User {
  id: number
  username: string
  email: string
  created_at: string
  updated_at: string
  player_signups: PlayerSignup[]
}

interface PlayerSignup {
  id: number
  name: string
  preferred_position: string
  user_id: number
  pickup_game_id: number
  user: User
  pickup_game: PickupGame
}

function App() {
  const [user, setUser] = useState(null)
  const [allGames, setAllGames] = useState([])
  const [currentGame, setCurrentGame] = useState(null)
  const [allSignups, setAllSignups] = useState([])
  const [createdGames, setCreatedGames] = useState([])

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch('/authorized')
        if (response.ok) {
          const user = await response.json()
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
          const games = await response.json()
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
          const signups = await response.json()
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


  function updateGameAttendees(newGame) {
    const updatedGamesList = allGames.map(gameObj => {
      if (gameObj.id === newGame.id) {
        return newGame
      } else {
        return gameObj
      }
    })
    setAllGames(updatedGamesList)
  }

  function addNewSignup(newSignup) {
    setAllSignups(current => [...current, newSignup])
  }

  function removeSignup(id) {
    const updatedSignupList = allSignups.filter(signup => {
      return signup.id !== id
    })
    setAllSignups(updatedSignupList)
  }

  function addNewGame(newGame) {
    setAllGames(current => [...current, newGame])
    setCreatedGames(current => [...current, newGame])
  }

  function deleteNewGame(id) {
    const updatedGamesList = allGames.filter(gameObj => {
      return gameObj.id !== id
    })
    const updatedCreatedList = createdGames.filter(gameObj => {
      return gameObj.id !== id
    })
    setAllGames(updatedGamesList)
    setCreatedGames(updatedCreatedList)
  }

  function updateNewGame(newGame) {
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
