import { useState } from "react";
import { Link as RouterLink, useOutletContext } from "react-router-dom";
import { User, PlayerSignup, PickupGame } from "../types"
import { POSITIONS } from "../constants.ts"
import { Alert, Box, Button, MenuItem, Paper, Stack, TextField, Typography } from "@mui/material"


interface OutletContext {
    user: User
    currentGame: PickupGame | null
    updateGameAttendees: (newGame: PickupGame) => void
    addNewSignup: (newSignup: PlayerSignup) => void
}

function SignupForm() {
    const { user, currentGame, updateGameAttendees, addNewSignup } = useOutletContext<OutletContext>()

    const [signupName, setSignupName] = useState('')
    const [position, setPosition] = useState('')
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState('')

    function handleSignupName(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setSignupName(e.target.value)
    }

    function handlePosition(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setPosition(e.target.value)
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError('')
        setSubmitted(false)

        if (signupName === '') {
            setError('Name is required')
            return
        }
        if (position === '') {
            setError('Pick a preferred position')
            return
        }
        if (!currentGame) {
            setError('No game selected. Go back to the game list and pick one.')
            return
        }

        try {
            const responseOne = await fetch('/player_signups', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: signupName,
                    preferred_position: position,
                    user_id: user.id,
                    pickup_game_id: currentGame.id
                })
            })
            const data = await responseOne.json()
            if (!responseOne.ok) {
                setError(data.error || `Signup failed (status ${responseOne.status})`)
                return
            }

            addNewSignup(data)
            updateGameAttendees({ ...currentGame, total_attendees: data.pickup_game.total_attendees })
            setSubmitted(true)
            setSignupName('')
            setPosition('')

        } catch (err) {
            console.error('Error:', err)
            setError('Could not reach the server. Please try again.')
        }
    }

    return (
        <Box sx={{ maxWidth: 480, mx: 'auto', mt: 4, px: 2 }}>
            <Paper variant="outlined" sx={{ p: 3, borderColor: 'primary.dark' }}>
                <Typography variant="h5" component="h1">Sign up for a game</Typography>
                {currentGame ?
                    <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                        {currentGame.location}, {currentGame.city}, {currentGame.state}
                    </Typography>
                    : null}

                <Stack component="form" spacing={2} onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
                    {!currentGame ?
                        <Alert
                            severity="info"
                            action={
                                <Button color="inherit" size="small" component={RouterLink} to="/game-library">
                                    Pickup Games
                                </Button>
                            }
                        >
                            No game selected. Pick one from the game list.
                        </Alert>
                        : null}

                    <TextField
                        label="Name"
                        name="name"
                        value={signupName}
                        onChange={handleSignupName}
                    />
                    <TextField
                        select
                        label="Preferred position"
                        name="position"
                        value={position}
                        onChange={handlePosition}
                        InputLabelProps={{ shrink: true }}
                        SelectProps={{ displayEmpty: true }}
                    >
                        <MenuItem value=''>Select a position</MenuItem>
                        {POSITIONS.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                    </TextField>

                    {error ? <Alert severity="error">{error}</Alert> : null}
                    {submitted ?
                        <Alert
                            severity="success"
                            action={
                                <Button color="inherit" size="small" component={RouterLink} to="/personal-page">
                                    My Games
                                </Button>
                            }
                        >
                            Signup complete!
                        </Alert>
                        : null}

                    <Button type="submit" variant="contained" size="large">Register</Button>
                </Stack>
            </Paper>
        </Box>
    )
}

export default SignupForm