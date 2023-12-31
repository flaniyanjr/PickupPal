import React, { useEffect, useState } from "react";
import { Switch, Route, Outlet } from "react-router-dom";

import Header from "./Header";

function App() {
  const [user, setUser]= useState(null)
  const [allGames, setAllGames] = useState([])
  const [currentGame, setCurrentGame] = useState('')
  const [allSignups, setAllSignups]= useState([])
  const [createdGames, setCreatedGames]= useState([])

  useEffect(() => {
    fetch('/authorized')
    .then((resp) => {
      if (resp.ok) {
        resp.json().then((user) => setUser(user))
      } else {
        console.log('No user logged in')
      }
    })
  }, [])

  useEffect(() => {
    fetch('/pickup_games')
    .then(r => {
      if (r.ok) {
        r.json().then(games => setAllGames(games))
      } else {
        console.log('Failed to retrieve games')
      }
    })
  }, [])

  useEffect(() => {
    fetch('/player_signups')
    .then(r => {
      if (r.ok) {
        r.json().then(signups => setAllSignups(signups))
      } else {
        console.log('Failed to retrieve signups')
      }
    })
  }, [])

  let userSignups= []

  if (user) {
    if (user.player_signups) {
      userSignups= allSignups.filter(signup => {
        if (signup.user.id === user.id) {
          return true
        } else {
          return false
        }
      })
    }
  }
  

  function updateGameAttendees(newGame) {
    const updatedGamesList= allGames.map(gameObj => {
      if (gameObj.id === newGame.id) {
        return newGame
      } else {
        return gameObj
      }
    })
    setAllGames(updatedGamesList)
  }

  function addNewSignup(newSignup) {
    setAllSignups( current => [...current, newSignup])
  }

  function removeSignup(id) {
    const updatedSignupList= allSignups.filter(signup => {
      return signup.id !== id
    })
    setAllSignups(updatedSignupList)
  }

  function addNewGame(newGame) {
    setAllGames(current => [...current, newGame])
    setCreatedGames(current => [...current, newGame])
  }

  function deleteNewGame(id) {
    const updatedGamesList= allGames.filter(gameObj => {
      return gameObj.id !== id
    })
    const updatedCreatedList= createdGames.filter(gameObj => {
      return gameObj.id !== id
    })
    setAllGames(updatedGamesList)
    setCreatedGames(updatedCreatedList)
  }

  function updateNewGame(newGame) {
    const updatedGameList= allGames.map(gameObj => {
      if (gameObj.id === newGame.id) {
        return newGame
      } else {
        return gameObj
      }
    })
    const updatedCreatedList= createdGames.map(gameObj => {
      if (gameObj.id === newGame.id) {
        return newGame
      } else {
        return gameObj
      }
    })
    setAllGames(updatedGameList)
    setCreatedGames(updatedCreatedList)
  }

  const context= {
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

  return(
    <div>
      <Header user= {user} setUser={setUser}/>
      <Outlet context= {context}/>
    </div>
  )


}

export default App;
