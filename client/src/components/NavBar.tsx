import {NavLink} from "react-router-dom"

function NavBar() {
    return(
        <nav className="navbar">
            <NavLink
                to="/"
                className="nav-link"
            >
                Home
            </NavLink>
            <NavLink
                to="/game-library"
                className="nav-link"
            >
                Pickup Games
            </NavLink>

            <NavLink
                to="/personal-page"
                className="nav-link"
            >
                My Games
            </NavLink>
            <NavLink
                to="/create-game"
                className="nav-link"
            >
                Created Games
            </NavLink>
        </nav>
    )
}

export default NavBar