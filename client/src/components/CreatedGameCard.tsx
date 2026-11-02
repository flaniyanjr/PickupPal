import { useState } from "react"
import { useOutletContext } from "react-router-dom"
import {
    Alert, Box, Button, Card, CardActions, CardContent, CardMedia, Chip, Dialog, DialogActions,
    DialogContent, DialogContentText, DialogTitle, Stack, TextField, Typography
} from "@mui/material"
import { PlayerSignup, PickupGame } from "../types"
import { formatDate, formatTime, isPast } from "../dateTime.ts"

interface OutletContext {
    deleteNewGame: (id: number) => void
    updateNewGame: (game: PickupGame) => void
    userSignups: PlayerSignup[]
    removeSignup: (id: number) => void
}

interface CreatedGameCardProps {
    gameObj: PickupGame
}

function CreatedGameCard({ gameObj }: CreatedGameCardProps) {

    const { location, city, state, date, time, format, max_players, image, total_attendees, id } = gameObj

    const { deleteNewGame, updateNewGame, userSignups, removeSignup } = useOutletContext<OutletContext>()

    const [newDate, setNewDate] = useState<string>(date)
    const [newTime, setNewTime] = useState<string>(time)
    const [editing, setEditing] = useState<boolean>(false)
    const [saved, setSaved] = useState<boolean>(false)
    const [error, setError] = useState<string>('')
    const [confirmingDelete, setConfirmingDelete] = useState<boolean>(false)
    const [imageFailed, setImageFailed] = useState<boolean>(false)

    const currentGameSignup = userSignups.find(signup => signup.pickup_game_id === id)

    const past = isPast(date, time)
    const showImage = Boolean(image) && !imageFailed

    const now = new Date()
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

    function handleDateChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setNewDate(e.target.value)
    }

    function handleTimeChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setNewTime(e.target.value)
    }

    function handleStartEdit() {
        setNewDate(date)
        setNewTime(time)
        setError('')
        setSaved(false)
        setEditing(true)
    }

    function handleCancelEdit() {
        setEditing(false)
        setError('')
    }

    async function handleSave(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError('')
        try {
            const response = await fetch(`/pickup_games/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date: newDate,
                    time: newTime
                })
            })
            const data = await response.json()
            if (!response.ok) {
                setError(data.error || `Update failed (status ${response.status})`)
                return
            }
            updateNewGame(data)
            setSaved(true)
            setEditing(false)
        } catch (err) {
            console.error('Error updating game:', err)
            setError('Could not reach the server. Please try again.')
        }
    }

    async function handleDelete() {
        try {
            const response = await fetch(`/pickup_games/${id}`, {
                method: 'DELETE',
            })
            if (!response.ok) {
                throw new Error(`Failed to delete game. Status Code: ${response.status}`)
            }
            deleteNewGame(id)
            if (currentGameSignup) {
                removeSignup(currentGameSignup.id)
            }
        } catch (err) {
            console.error('Error deleting game:', err)
            setConfirmingDelete(false)
            setError('Could not delete the game. Please try again.')
        }
    }

    return (
        <Card variant="outlined" sx={{ display: 'flex', flexDirection: 'column', opacity: past ? 0.6 : 1 }}>
            {showImage ? (
                <CardMedia
                    component="img"
                    image={image}
                    alt={location}
                    onError={() => setImageFailed(true)}
                    sx={{ height: 180, objectFit: 'cover' }}
                />
            ) : (
                <Box
                    role="img"
                    aria-label="Soccer ball"
                    sx={{
                        height: 180,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 64,
                        background: 'linear-gradient(135deg, #8E1B23, #161214)'
                    }}
                >
                    ⚽
                </Box>
            )}

            <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                    {location}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {city}, {state}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                    {formatDate(date)} at {formatTime(time)}
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1.5 }}>
                    <Chip size="small" label={format} />
                    <Chip
                        size="small"
                        variant="outlined"
                        color="primary"
                        label={`${total_attendees} of ${max_players} going`}
                    />
                    {past ? <Chip size="small" label="Past" /> : null}
                </Box>

                {saved ? <Alert severity="success" sx={{ mt: 2 }}>Game updated</Alert> : null}
                {error ? <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert> : null}

                {editing ?
                    <Stack component="form" spacing={2} onSubmit={handleSave} noValidate sx={{ mt: 2 }}>
                        <TextField
                            label="Date"
                            type="date"
                            value={newDate}
                            onChange={handleDateChange}
                            size="small"
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ min: today }}
                        />
                        <TextField
                            label="Time"
                            type="time"
                            value={newTime}
                            onChange={handleTimeChange}
                            size="small"
                            InputLabelProps={{ shrink: true }}
                        />
                        <Stack direction="row" spacing={1}>
                            <Button type="submit" variant="contained" size="small">Save</Button>
                            <Button size="small" onClick={handleCancelEdit}>Cancel</Button>
                        </Stack>
                    </Stack>
                    : null}
            </CardContent>

            <CardActions sx={{ p: 2, pt: 0 }}>
                {!editing ?
                    <Button variant="outlined" onClick={handleStartEdit}>Edit date and time</Button>
                    : null}
                <Button color="error" onClick={() => setConfirmingDelete(true)}>Delete</Button>
            </CardActions>

            <Dialog open={confirmingDelete} onClose={() => setConfirmingDelete(false)}>
                <DialogTitle>Delete this game?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {location} on {formatDate(date)} will be removed, along with everyone's signups for it. This cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmingDelete(false)}>Cancel</Button>
                    <Button color="error" onClick={handleDelete}>Delete</Button>
                </DialogActions>
            </Dialog>
        </Card>
    )
}

export default CreatedGameCard