import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import GameCard from "./GameCard.tsx"
import Footer from "./Footer.tsx";
import MapView from "./MapView.tsx"
import { distanceMiles } from "../geo.ts"
import { PickupGame, User } from "../types"

interface OutletContext {
    allGames: PickupGame[]
    user: User | null
}

interface UserLocation {
    latitude: number
    longitude: number
}

function GameLibrary() {

    const { allGames, user } = useOutletContext<OutletContext>()
    const [searchInput, setSearchInput] = useState<string>('')
    const [sort, setSort] = useState<string>('')
    const [userLocation, setUserLocation] = useState<UserLocation | null>(null)
    const [locationStatus, setLocationStatus] = useState<string>('')

    function handleSearchInput(e: React.ChangeEvent<HTMLInputElement>) {
        setSearchInput(e.target.value)
    }

    function handleSort(e: React.ChangeEvent<HTMLSelectElement>) {
        const choice = e.target.value

        // Every sort except distance, or distance when we already know where the user is
        if (choice !== 'distance' || userLocation !== null) {
            setLocationStatus('')
            setSort(choice)
            return
        }

        // Distance was chosen and we don't have the location yet: ask the browser
        if (!navigator.geolocation) {
            setLocationStatus('Your browser does not support location.')
            return
        }

        setLocationStatus('Getting your location...')
        navigator.geolocation.getCurrentPosition(
            position => {
                setUserLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                })
                setSort('distance')
                setLocationStatus('')
            },
            () => {
                setLocationStatus('Could not get your location. Allow location access for this site and try again.')
            },
            { timeout: 10000 }
        )
    }

    // Miles from the user to a game, or null if we can't tell
    function distanceFor(game: PickupGame): number | null {
        if (userLocation === null || game.latitude === null || game.longitude === null) {
            return null
        }
        return distanceMiles(userLocation.latitude, userLocation.longitude, game.latitude, game.longitude)
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
            break
        case 'distance':
            // Games with no pin get a huge distance so they land at the end
            sortedGames.sort((a, b) => (distanceFor(a) ?? 1e9) - (distanceFor(b) ?? 1e9))
            break
    }

    const searchWords = searchInput.toLowerCase().split(' ').filter(word => word !== '')

    const filteredGames = sortedGames.filter(gameObj => {
        const searchable = `${gameObj.location} ${gameObj.city} ${gameObj.state}`.toLowerCase()
        return searchWords.every(word => searchable.includes(word))
    })

    const gameCards = filteredGames.map((gameObj) => {
        return <GameCard key={gameObj.id} gameObj={gameObj} distanceMiles={distanceFor(gameObj)} />
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
                        <select name="sort" value={sort} onChange={handleSort} id='sort-box'>
                            <option value=''></option>
                            <option value='date'>Date</option>
                            <option value='time'>Time</option>
                            <option value='state'>State</option>
                            <option value='attendance'>Attendance</option>
                            <option value='distance'>Distance (Near Me)</option>
                        </select>
                        {locationStatus ? <p>{locationStatus}</p> : null}
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