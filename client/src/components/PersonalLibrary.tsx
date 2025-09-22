import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import PersonalCard from "./PersonalCard";
import Footer from "./Footer.tsx";

interface User { }

interface PickupGame {
    id: number
    location: string
    city: string
    state: string
    date: string
    time: string
    sport: string
    image: string
    total_attendees: number
}

interface UserSignup {
    id: number
    name: string
    preferred_position: string
    user_id: number
    pickup_game_id: number
    user: User
    pickup_game: PickupGame
}

interface OutletContext {
    user: User | null
    userSignups: UserSignup[]
}

function PersonalLibrary() {

    const { userSignups, user } = useOutletContext<OutletContext>()
    const [searchInput, setSearchInput] = useState<string>('')

    function handleSearchInput(e: React.ChangeEvent<HTMLInputElement>) {
        setSearchInput(e.target.value)
    }

    let gameCards

    if (userSignups) {
        const userGames = userSignups.map(signup => {
            return signup.pickup_game
        })
        const filteredGames = userGames.filter(gameObj => {
            return gameObj.sport.toLowerCase().includes(searchInput.toLowerCase())
        })
        gameCards = filteredGames.map(gameObj => {
            return <PersonalCard key={gameObj.id} gameObj={gameObj} />
        })
    }

    const totalSignups = userSignups.length

    return (
        user ?
            <div>
                <div className='personal-search-container'>
                    <div className="container">
                        <input
                            type='text'
                            value={searchInput}
                            placeholder="Search by sport..."
                            onChange={handleSearchInput}
                            className="search"
                        />
                    </div>
                </div>
                <div className="container">
                    <h4 id='signup-total'>Total Games: {totalSignups}</h4>
                </div>
                {userSignups ? gameCards : null}
                <Footer />
            </div>
            :
            <h1 className="required-login-message">Login required to access this page </h1>
    )
}

export default PersonalLibrary