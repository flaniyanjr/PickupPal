import NavBar from "./NavBar"
import header from '../styling/header.css'
import newlogo from '../img/newlogo.jpg'
import { Button } from '@mui/material';

import Signup from "./Signup";

function Header({ user, setUser }) {

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
        {user ? <Button varient='contained' onClick={handleLogout} id='logout-button'>Logout</Button> : null}
        {user ? <p className="user-info"><b>Welcome: {user.username}</b></p> : null}
      </div>
      <div className='logo-container'>
        <img id="header-img" src={newlogo} alt="pickup pal logo" />
      </div>
    </div>
  )
}

export default Header