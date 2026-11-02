import { useState } from "react"
import { useNavigate, useOutletContext } from "react-router-dom"
import { Card, CardMedia, CardContent, CardActions, Box, Button, Chip, Typography } from "@mui/material"
import { PickupGame } from "../types"
import { formatDate, formatTime, isPast } from "../dateTime.ts"

interface GameCardProps {
    gameObj: PickupGame
    distanceMiles?: number | null
}

interface OutletContext {
    setCurrentGame: (game: PickupGame) => void
}

function GameCard({ gameObj, distanceMiles }: GameCardProps) {
    const { location, city, state, date, time, format, max_players, image, total_attendees } = gameObj

    const { setCurrentGame } = useOutletContext<OutletContext>()
    const navigate = useNavigate()
    const [imageFailed, setImageFailed] = useState<boolean>(false)

    const past = isPast(date, time)
    const spotsLeft = max_players - total_attendees
    const full = spotsLeft <= 0
    const showImage = Boolean(image) && !imageFailed

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
                        color={full ? 'default' : 'primary'}
                        label={full ? 'Full' : `${spotsLeft} ${spotsLeft === 1 ? 'spot' : 'spots'} left`}
                    />
                    {typeof distanceMiles === 'number' ? (
                        <Chip size="small" variant="outlined" label={`${Math.round(distanceMiles)} mi away`} />
                    ) : null}
                    {past ? <Chip size="small" label="Past" /> : null}
                </Box>
            </CardContent>

            <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                    fullWidth
                    variant="contained"
                    disabled={past || full}
                    onClick={() => {
                        setCurrentGame(gameObj)
                        navigate('/signup-form')
                    }}
                >
                    Register
                </Button>
            </CardActions>
        </Card>
    )
}

export default GameCard