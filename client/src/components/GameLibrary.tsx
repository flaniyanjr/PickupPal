import { useOutletContext } from "react-router-dom";
import { useState } from "react";

import GameCard from "./GameCard.tsx"
import Footer from "./Footer.tsx";

interface Game {
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

interface User { }

interface OutletContext {
    allGames: Game[]
    user: User | null
}

function GameLibrary() {

    const { allGames, user } = useOutletContext<OutletContext>()
    const [searchInput, setSearchInput] = useState<string>('')
    const [sort, setSort] = useState<string>('')

    function handleSearchInput(e: React.ChangeEvent<HTMLInputElement>) {
        setSearchInput(e.target.value)
    }

    function handleSort(e: React.ChangeEvent<HTMLSelectElement>) {
        setSort(e.target.value)
    }

    let sortedGames: Game[] = [...allGames]

    switch (sort) {
        case '':
            sortedGames.sort((a, b) => a.id - b.id)
            break
        case 'date':
            sortedGames.sort((a, b) => a.date.localeCompare(b.date))
            break
        case 'time':
            sortedGames.sort((a, b) => a.time.localeCompare(b.time))
            break
        case 'state':
            sortedGames.sort((a, b) => a.state.localeCompare(b.state))
            break
        case 'attendance':
            sortedGames.sort((a, b) => a.total_attendees - b.total_attendees)
    }

    const filteredGames = sortedGames.filter(gameObj => {
        return gameObj.sport.toLowerCase().includes(searchInput.toLowerCase())
    })


    const gameCards = filteredGames.map((gameObj) => {
        return <GameCard key={gameObj.id} gameObj={gameObj} />
    })

    return (
        user ?
            <div>
                <div className='search-sort-container'>
                    <div className="container">
                        <input
                            type="text"
                            className="search"
                            placeholder="Search by sport..."
                            value={searchInput}
                            onChange={handleSearchInput}
                        />
                    </div>
                    <div className='container'>
                        <label id='sort-text'>Sort:</label>
                        <select name="sort" onChange={handleSort} id='sort-box'>
                            <option value=''></option>
                            <option value='date'>date</option>
                            <option value='time'>time</option>
                            <option value='state'>state</option>
                            <option value='attendance'>attendance</option>
                        </select>
                    </div>
                </div>

                {gameCards}
                <Footer />
            </div>
            :
            <h1 className="required-login-message">Login required to access this page </h1>
    )
}

export default GameLibrary