import { useOutletContext } from "react-router-dom";
import { useState } from "react";

import GameCard from "./GameCard"
import Footer from "./Footer.tsx";

function GameLibrary() {

    const { allGames, user } = useOutletContext()
    const [searchInput, setSearchInput] = useState('')
    const [sort, setSort] = useState('')

    function handleSearchInput(e) {
        setSearchInput(e.target.value)
    }

    function handleSort(e) {
        setSort(e.target.value)
    }

    let sortedGames = []

    switch (sort) {
        case '':
            sortedGames = allGames.sort((a, b) => a.id > b.id ? 1 : -1)
            break
        case 'date':
            sortedGames = allGames.sort((a, b) => a.date > b.date ? 1 : -1)
            break
        case 'time':
            sortedGames = allGames.sort((a, b) => a.time > b.time ? 1 : -1)
            break
        case 'state':
            sortedGames = allGames.sort((a, b) => a.state > b.state ? 1 : -1)
            break
        case 'attendance':
            sortedGames = allGames.sort((a, b) => a.total_attendees - b.total_attendees)
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