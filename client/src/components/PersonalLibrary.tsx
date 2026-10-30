import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import PersonalCard from "./PersonalCard.tsx";
import Footer from "./Footer.tsx";
import { User, PlayerSignup } from "../types"
import { Box, CircularProgress, TextField, Typography } from "@mui/material"

interface OutletContext {
    user: User | null
    userSignups: PlayerSignup[]
    signupsLoaded: boolean
}

function PersonalLibrary() {

    const { userSignups, user, signupsLoaded } = useOutletContext<OutletContext>()
    const [searchInput, setSearchInput] = useState<string>('')

    function handleSearchInput(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setSearchInput(e.target.value)
    }

    const searchWords = searchInput.toLowerCase().split(' ').filter(word => word !== '')

    const filteredGames = userSignups
        .map(signup => signup.pickup_game)
        .filter(gameObj => {
            const searchable = `${gameObj.location} ${gameObj.city} ${gameObj.state}`.toLowerCase()
            return searchWords.every(word => searchable.includes(word))
        })

    const gameCards = filteredGames.map(gameObj => {
        return <PersonalCard key={gameObj.id} gameObj={gameObj} />
    })

    return (
        user ?
            <div>
                <Box sx={{ px: 3, pt: 3 }}>
                    <TextField
                        size="small"
                        label="Search"
                        placeholder="Venue, city or state"
                        value={searchInput}
                        onChange={handleSearchInput}
                        InputLabelProps={{ shrink: true }}
                        sx={{ width: '100%', maxWidth: 520 }}
                    />
                </Box>

                {signupsLoaded ?
                    <Typography variant="body2" color="text.secondary" sx={{ px: 3, pt: 1 }}>
                        {filteredGames.length} {filteredGames.length === 1 ? 'game' : 'games'}
                    </Typography>
                    : null}

                {!signupsLoaded ?
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <CircularProgress />
                    </Box>
                    : filteredGames.length === 0 ?
                        <Typography color="text.secondary" sx={{ p: 3 }}>
                            {searchWords.length > 0
                                ? 'None of your games match your search.'
                                : "You haven't signed up for any games yet. Find one on the Pickup Games page."}
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