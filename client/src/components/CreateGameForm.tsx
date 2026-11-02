import { useOutletContext } from "react-router-dom";
import { useState } from 'react'
import CreatedGameCard from "./CreatedGameCard.tsx";
import { User, PickupGame } from "../types"
import { FORMATS, DEFAULT_FORMAT, MAX_PLAYERS, minPlayers, STATES } from "../constants.ts"
import LocationPicker, { FocusTarget } from "./LocationPicker.tsx"
import { Alert, Box, Button, MenuItem, Paper, Stack, TextField, Typography } from "@mui/material"

interface GameFormData {
    location: string
    city: string
    state: string
    date: string
    time: string
    format: string
    max_players: string
    image: string
    latitude: number | null
    longitude: number | null
}

interface OutletContext {
    addNewGame: (game: PickupGame) => void
    createdGames: PickupGame[]
    user: User | null
}

interface GeocodeResult {
    lat: string
    lon: string
    display_name: string
}

function CreateGame() {

    const initialState: GameFormData = {
        location: '',
        city: '',
        state: '',
        date: '',
        time: '',
        format: DEFAULT_FORMAT,
        max_players: String(minPlayers(DEFAULT_FORMAT)),
        image: '',
        latitude: null,
        longitude: null
    }

    const [gameData, setGameData] = useState<GameFormData>(initialState)
    const [error, setError] = useState<string>('')
    const { addNewGame, createdGames, user } = useOutletContext<OutletContext>()
    const [address, setAddress] = useState<string>('')
    const [lookupStatus, setLookupStatus] = useState<string>('')
    const [looking, setLooking] = useState<boolean>(false)
    const [focusTarget, setFocusTarget] = useState<FocusTarget | null>(null)

    const currentDate = new Date()
    let day = currentDate.getDate().toString().padStart(2, '0')
    let month = (currentDate.getMonth() + 1).toString().padStart(2, '0')
    const year = currentDate.getFullYear()

    const today = `${year}-${month}-${day}`

    let createdGameCards

    if (createdGames) {
        createdGameCards = createdGames.map(gameObj => {
            return <CreatedGameCard key={gameObj.id} gameObj={gameObj} />
        })
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setGameData(current => {
            return { ...current, [e.target.name]: e.target.value }
        })
    }

    function handleFormatChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const newFormat = e.target.value
        setGameData(current => {
            return {
                ...current,
                format: newFormat,
                max_players: String(minPlayers(newFormat))
            }
        })
    }

    function handlePickLocation(latitude: number, longitude: number) {
        setGameData(current => {
            return {
                ...current,
                latitude: Number(latitude.toFixed(6)),
                longitude: Number(longitude.toFixed(6))
            }
        })
    }

    function handleClearPin() {
        setGameData(current => {
            return { ...current, latitude: null, longitude: null }
        })
    }

    async function handleFindOnMap() {
        const place = address.trim() !== '' ? address.trim() : gameData.location.trim()
        if (place === '') {
            setLookupStatus('Enter an address or a venue name first')
            return
        }

        const query = [place, gameData.city.trim(), gameData.state]
            .filter(part => part !== '')
            .join(', ')

        setLooking(true)
        setLookupStatus('')

        try {
            const params = new URLSearchParams({
                q: query,
                format: 'jsonv2',
                limit: '1',
                countrycodes: 'us'
            })
            const response = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`)
            if (!response.ok) {
                setLookupStatus(`Address search failed (status ${response.status}). You can still click the map.`)
                return
            }

            const results: GeocodeResult[] = await response.json()
            const first = results[0]
            if (!first) {
                setLookupStatus('No match found. Try a street address, or click the map.')
                return
            }

            const lat = Number(first.lat)
            const lon = Number(first.lon)
            if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
                setLookupStatus('The search returned a bad location. Click the map instead.')
                return
            }

            handlePickLocation(lat, lon)
            setFocusTarget({ latitude: lat, longitude: lon })
            setLookupStatus(`Found: ${first.display_name}. If the pin is off, click the map to move it.`)
        } catch (err) {
            console.error('Error looking up address:', err)
            setLookupStatus('Could not reach the address search. You can still click the map.')
        } finally {
            setLooking(false)
        }
    }

    function handleAddressKeyDown(e: React.KeyboardEvent<HTMLElement>) {
        // Enter in a form input would submit the whole form, so run the lookup instead
        if (e.key === 'Enter') {
            e.preventDefault()
            handleFindOnMap()
        }
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError('')

        if (
            gameData.location === '' ||
            gameData.city === '' ||
            gameData.state === '' ||
            gameData.date === '' ||
            gameData.time === ''
        ) {
            setError('Venue, city, state, date and time are required')
            return
        }

        const maxPlayers = Number(gameData.max_players)
        const minAllowed = minPlayers(gameData.format)
        if (!Number.isInteger(maxPlayers) || maxPlayers < minAllowed) {
            setError(`A ${gameData.format} game needs at least ${minAllowed} players`)
            return
        }

        try {
            const response = await fetch('/pickup_games', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...gameData,
                    max_players: maxPlayers,
                    sport: 'Soccer',
                    total_attendees: 0
                })
            })
            const data = await response.json()
            if (!response.ok) {
                setError(data.error || `Game creation failed (status ${response.status})`)
                return
            }
            addNewGame(data)
            setGameData(initialState)
            setAddress('')
            setLookupStatus('')
            setFocusTarget(null)
        } catch (err) {
            console.error('Error submitting new game:', err)
            setError('Could not reach the server. Please try again.')
        }
    }

    return (
        user ?
            <Box sx={{ px: 2, pb: 4 }}>
                <Paper variant="outlined" sx={{ maxWidth: 640, mx: 'auto', mt: 4, p: 3, borderColor: 'primary.dark' }}>
                    <Typography variant="h5" component="h1">Create a game</Typography>

                    <Stack component="form" spacing={2} onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
                        <TextField
                            label="Venue"
                            name="location"
                            value={gameData.location}
                            onChange={handleChange}
                            required
                        />

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <TextField
                                label="City"
                                name="city"
                                value={gameData.city}
                                onChange={handleChange}
                                required
                                sx={{ flex: 1 }}
                            />
                            <TextField
                                select
                                label="State"
                                name="state"
                                value={gameData.state}
                                onChange={handleChange}
                                required
                                InputLabelProps={{ shrink: true }}
                                SelectProps={{ displayEmpty: true }}
                                sx={{ flex: 1 }}
                            >
                                <MenuItem value=''>Select a state</MenuItem>
                                {STATES.map(s => <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>)}
                            </TextField>
                        </Stack>

                        <Typography variant="subtitle1" sx={{ pt: 1 }}>Pin the field on the map (optional)</Typography>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <TextField
                                label="Address"
                                placeholder="Street address, then press Find on map"
                                value={address}
                                onChange={e => setAddress(e.target.value)}
                                onKeyDown={handleAddressKeyDown}
                                InputLabelProps={{ shrink: true }}
                                sx={{ flex: 1 }}
                            />
                            <Button variant="outlined" onClick={handleFindOnMap} disabled={looking}>
                                {looking ? 'Searching...' : 'Find on map'}
                            </Button>
                        </Stack>
                        {lookupStatus ? <Alert severity="info">{lookupStatus}</Alert> : null}

                        <Box sx={{ borderRadius: 1, overflow: 'hidden', border: 1, borderColor: 'divider' }}>
                            <LocationPicker
                                latitude={gameData.latitude}
                                longitude={gameData.longitude}
                                focusTarget={focusTarget}
                                onPick={handlePickLocation}
                            />
                        </Box>
                        {gameData.latitude !== null && gameData.longitude !== null
                            ? <Stack direction="row" spacing={1} alignItems="center">
                                <Typography variant="body2" color="text.secondary">
                                    Pin set at {gameData.latitude}, {gameData.longitude}
                                </Typography>
                                <Button size="small" onClick={handleClearPin}>Clear pin</Button>
                            </Stack>
                            : <Typography variant="body2" color="text.secondary">
                                Or click the map to drop a pin. Zoom in first for an exact spot.
                            </Typography>}

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pt: 1 }}>
                            <TextField
                                label="Date"
                                name="date"
                                type="date"
                                value={gameData.date}
                                onChange={handleChange}
                                required
                                InputLabelProps={{ shrink: true }}
                                inputProps={{ min: today }}
                                sx={{ flex: 1 }}
                            />
                            <TextField
                                label="Time"
                                name="time"
                                type="time"
                                value={gameData.time}
                                onChange={handleChange}
                                required
                                InputLabelProps={{ shrink: true }}
                                sx={{ flex: 1 }}
                            />
                        </Stack>

                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <TextField
                                select
                                label="Format"
                                name="format"
                                value={gameData.format}
                                onChange={handleFormatChange}
                                sx={{ flex: 1 }}
                            >
                                {FORMATS.map(f => <MenuItem key={f} value={f}>{f}</MenuItem>)}
                            </TextField>
                            <TextField
                                label="Max players"
                                name="max_players"
                                type="number"
                                value={gameData.max_players}
                                onChange={handleChange}
                                inputProps={{ min: minPlayers(gameData.format), max: MAX_PLAYERS }}
                                sx={{ flex: 1 }}
                            />
                        </Stack>

                        <TextField
                            label="Image URL (optional)"
                            name="image"
                            value={gameData.image}
                            onChange={handleChange}
                        />

                        {error ? <Alert severity="error">{error}</Alert> : null}

                        <Button type="submit" variant="contained" size="large">Create game</Button>
                    </Stack>
                </Paper>

                {createdGames.length > 0 ?
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h6" component="h2" sx={{ textAlign: 'center' }}>
                            Your created games
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', mt: 1 }}>
                            {createdGameCards}
                        </Box>
                    </Box>
                    : null}
            </Box>
            :
            <h1 className="required-login-message">Login required to access this page </h1>
    )
}

export default CreateGame