import { useState } from "react"
import { useOutletContext } from "react-router-dom"
import { Card, CardMedia, CardContent, CardActions, Box, Button, Chip, Typography } from "@mui/material"
import { PlayerSignup, PickupGame } from "../types"
import { formatDate, formatTime, isPast } from "../dateTime.ts"

interface PersonalCardProps {
    gameObj: PickupGame
}

interface OutletContext {
    userSignups: PlayerSignup[]
    removeSignup: (id: number) => void
    allGames: PickupGame[]
    updateGameAttendees: (newGame: PickupGame) => void
}

function PersonalCard({ gameObj }: PersonalCardProps) {

    const { userSignups, removeSignup, allGames, updateGameAttendees } = useOutletContext<OutletContext>()

    const { location, city, state, date, time, format, image, id } = gameObj

    const [imageFailed, setImageFailed] = useState<boolean>(false)

    const targetSignup = userSignups.find(signup => signup.pickup_game.id === id)
    const targetAttendeeTotal = allGames.find(game => game.id === id)?.total_attendees ?? 0

    const past = isPast(date, time)
    const showImage = Boolean(image) && !imageFailed

    async function handleDelete() {
        if (!targetSignup) return
        try {
            const response = await fetch(`/player_signups/${targetSignup.id}`, {
                method: 'DELETE'
            })
            if (!response.ok) {
                throw new Error(`Failed to delete signup. Status: ${response.status}`)
            }
            removeSignup(targetSignup.id)

            const gameResponse = await fetch(`/pickup_games/${id}`)
            if (gameResponse.ok) {
                const updatedGame = await gameResponse.json()
                updateGameAttendees(updatedGame)
            }
        } catch (error) {
            console.error('Error:', error)
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
                    {format ? <Chip size="small" label={format} /> : null}
                    <Chip size="small" variant="outlined" color="primary" label={`${targetAttendeeTotal} going`} />
                    {past ? <Chip size="small" label="Past" /> : null}
                </Box>
            </CardContent>

            <CardActions sx={{ p: 2, pt: 0 }}>
                <Button fullWidth variant="outlined" color="inherit" onClick={handleDelete}>
                    Unregister
                </Button>
            </CardActions>
        </Card>
    )
}

export default PersonalCard