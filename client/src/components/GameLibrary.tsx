import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import GameCard from "./GameCard.tsx"
import Footer from "./Footer.tsx";
import { PickupGame, User } from "../types"
import MapView from "./MapView.tsx"

interface OutletContext {
    allGames: PickupGame[]
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

    let sortedGames: PickupGame[] = [...allGames]

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

    const searchWords = searchInput.toLowerCase().split(' ').filter(word => word !== '')

    const filteredGames = sortedGames.filter(gameObj => {
        const searchable = `${gameObj.location} ${gameObj.city} ${gameObj.state}`.toLowerCase()
        return searchWords.every(word => searchable.includes(word))
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
                            placeholder="Venue, city or state"
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

                <MapView games={filteredGames} />

                {gameCards}
                <Footer />
            </div>
            :
            <h1 className="required-login-message">Login required to access this page </h1>
    )
}

export default GameLibrary