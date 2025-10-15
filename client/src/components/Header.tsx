import NavBar from "./NavBar.tsx"
import '../styling/header.css'
import newlogo from '../img/newlogo.jpg'
import { Button } from '@mui/material';
import * as React from "react";
import { User } from "../types"

interface HeaderProps {
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
}

function Header({ user, setUser }: HeaderProps) {

  async function handleLogout() {
    const response = await fetch('/logout', {
      method: 'DELETE'
    })
    if (response.ok) {
      setUser(null)
    }
  }


  return (
    <div>
      <NavBar />
      <div>
        {user ? <Button variant='contained' onClick={handleLogout} id='logout-button'>Logout</Button> : null}
        {user ? <p className="user-info"><b>Welcome: {user.username}</b></p> : null}
      </div>
      <div className='logo-container'>
        <img id="header-img" src={newlogo} alt="pickup pal logo" />
      </div>
    </div>
  )
}

export default Header