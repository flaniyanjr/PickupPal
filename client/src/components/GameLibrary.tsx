import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import GameCard from "./GameCard.tsx"
import Footer from "./Footer.tsx";
import MapView from "./MapView.tsx"
import { distanceMiles } from "../geo.ts"
import { isPast } from "../dateTime.ts"
import { PickupGame, User } from "../types"
import { Box, CircularProgress, FormControlLabel, MenuItem, Switch, TextField, Typography } from "@mui/material"

interface OutletContext {
    allGames: PickupGame[]
    gamesLoaded: boolean
    user: User | null
}

interface UserLocation {
    latitude: number
    longitude: number
}

function GameLibrary() {

    const { allGames, user, gamesLoaded } = useOutletContext<OutletContext>()
    const [searchInput, setSearchInput] = useState<string>('')
    const [sort, setSort] = useState<string>('')
    const [userLocation, setUserLocation] = useState<UserLocation | null>(null)
    const [locationStatus, setLocationStatus] = useState<string>('')
    const [showPast, setShowPast] = useState<boolean>(false)

    function handleSearchInput(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setSearchInput(e.target.value)
    }

    function handleShowPast(e: React.ChangeEvent<HTMLInputElement>) {
        setShowPast(e.target.checked)
    }

    function handleSort(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
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

    const matchingGames = sortedGames.filter(gameObj => {
        const searchable = `${gameObj.location} ${gameObj.city} ${gameObj.state}`.toLowerCase()
        return searchWords.every(word => searchable.includes(word))
    })

    const filteredGames = showPast
        ? matchingGames
        : matchingGames.filter(gameObj => !isPast(gameObj.date, gameObj.time))

    const hiddenPastCount = matchingGames.length - filteredGames.length

    let emptyMessage = 'No games yet. Create one on the Created Games page.'
    if (hiddenPastCount > 0) {
        emptyMessage = `No upcoming games${searchWords.length > 0 ? ' match your search' : ''}. Turn on "Show past games" to see ${hiddenPastCount} past ${hiddenPastCount === 1 ? 'game' : 'games'}.`
    } else if (searchWords.length > 0) {
        emptyMessage = 'No games match your search.'
    }

    const gameCards = filteredGames.map((gameObj) => {
        return <GameCard key={gameObj.id} gameObj={gameObj} distanceMiles={distanceFor(gameObj)} />
    })

    return (
        user ?
            <div>
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'flex-start',
                        gap: 2,
                        px: 3,
                        pt: 3
                    }}
                >
                    <TextField
                        size="small"
                        label="Search"
                        placeholder="Venue, city or state"
                        value={searchInput}
                        onChange={handleSearchInput}
                        InputLabelProps={{ shrink: true }}
                        sx={{ flex: '1 1 280px', maxWidth: 520 }}
                    />
                    <TextField
                        select
                        name="sort"
                        size="small"
                        label="Sort by"
                        value={sort}
                        onChange={handleSort}
                        InputLabelProps={{ shrink: true }}
                        SelectProps={{ displayEmpty: true }}
                        sx={{ minWidth: 220 }}
                    >
                        <MenuItem value=''>Default</MenuItem>
                        <MenuItem value='date'>Date</MenuItem>
                        <MenuItem value='time'>Time</MenuItem>
                        <MenuItem value='state'>State</MenuItem>
                        <MenuItem value='attendance'>Attendance</MenuItem>
                        <MenuItem value='distance'>Distance (near me)</MenuItem>
                    </TextField>
                    <FormControlLabel
                        control={<Switch checked={showPast} onChange={handleShowPast} />}
                        label="Show past games"
                        sx={{ m: 0, alignSelf: 'center' }}
                    />
                </Box>

                {locationStatus ?
                    <Typography variant="body2" color="text.secondary" sx={{ px: 3, pt: 1 }}>
                        {locationStatus}
                    </Typography>
                    : null}

                {gamesLoaded ?
                    <Typography variant="body2" color="text.secondary" sx={{ px: 3, pt: 1 }}>
                        {filteredGames.length} {filteredGames.length === 1 ? 'game' : 'games'}
                        {hiddenPastCount > 0 ? ` (${hiddenPastCount} past hidden)` : ''}
                    </Typography>
                    : null}

                <MapView games={filteredGames} />

                {!gamesLoaded ?
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <CircularProgress />
                    </Box>
                    : filteredGames.length === 0 ?
                        <Typography color="text.secondary" sx={{ p: 3 }}>
                            {emptyMessage}
                        </Typography>
                        :
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                                gap: 3,
                                p: 3
                            }}
                        >
                            {gameCards}
                        </Box>
                }
                <Footer />
            </div>
            :
            <h1 className="required-login-message">Login required to access this page </h1>
    )
}

export default GameLibrary