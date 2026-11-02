import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import PersonalCard from "./PersonalCard.tsx";
import Footer from "./Footer.tsx";
import { User, PlayerSignup } from "../types"
import { isPast } from "../dateTime.ts"
import { Box, CircularProgress, FormControlLabel, Switch, TextField, Typography } from "@mui/material"

interface OutletContext {
    user: User | null
    userSignups: PlayerSignup[]
    signupsLoaded: boolean
}

function PersonalLibrary() {

    const { userSignups, user, signupsLoaded } = useOutletContext<OutletContext>()
    const [searchInput, setSearchInput] = useState<string>('')
    const [showPast, setShowPast] = useState<boolean>(true)

    function handleSearchInput(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setSearchInput(e.target.value)
    }

    function handleShowPast(e: React.ChangeEvent<HTMLInputElement>) {
        setShowPast(e.target.checked)
    }

    const searchWords = searchInput.toLowerCase().split(' ').filter(word => word !== '')

    const matchingGames = userSignups
        .map(signup => signup.pickup_game)
        .filter(gameObj => {
            const searchable = `${gameObj.location} ${gameObj.city} ${gameObj.state}`.toLowerCase()
            return searchWords.every(word => searchable.includes(word))
        })

    const filteredGames = showPast
        ? matchingGames
        : matchingGames.filter(gameObj => !isPast(gameObj.date, gameObj.time))

    const hiddenPastCount = matchingGames.length - filteredGames.length

    let emptyMessage = "You haven't signed up for any games yet. Find one on the Pickup Games page."
    if (hiddenPastCount > 0) {
        emptyMessage = `No upcoming games${searchWords.length > 0 ? ' match your search' : ''}. Turn on "Show past games" to see ${hiddenPastCount} past ${hiddenPastCount === 1 ? 'game' : 'games'}.`
    } else if (searchWords.length > 0) {
        emptyMessage = 'None of your games match your search.'
    }

    const gameCards = filteredGames.map(gameObj => {
        return <PersonalCard key={gameObj.id} gameObj={gameObj} />
    })

    return (
        user ?
            <div>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, px: 3, pt: 3 }}>
                    <TextField
                        size="small"
                        label="Search"
                        placeholder="Venue, city or state"
                        value={searchInput}
                        onChange={handleSearchInput}
                        InputLabelProps={{ shrink: true }}
                        sx={{ flex: '1 1 280px', maxWidth: 520 }}
                    />
                    <FormControlLabel
                        control={<Switch checked={showPast} onChange={handleShowPast} />}
                        label="Show past games"
                        sx={{ m: 0 }}
                    />
                </Box>

                {signupsLoaded ?
                    <Typography variant="body2" color="text.secondary" sx={{ px: 3, pt: 1 }}>
                        {filteredGames.length} {filteredGames.length === 1 ? 'game' : 'games'}
                        {hiddenPastCount > 0 ? ` (${hiddenPastCount} past hidden)` : ''}
                    </Typography>
                    : null}

                {!signupsLoaded ?
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <CircularProgress />
                    </Box>
                    : filteredGames.length === 0 ?
                        <Typography color="text.secondary" sx={{ p: 3 }}>
                            {emptyMessage}
                        </Typography>
                        :
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', p: 2 }}>
                            {gameCards}
                        </Box>
                }
                <Footer />
            </div>
            :
            <h1 className="required-login-message">Login required to access this page </h1>
    )
}

export default PersonalLibrary