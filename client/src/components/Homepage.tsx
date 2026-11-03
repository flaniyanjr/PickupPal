import { Link as RouterLink } from "react-router-dom"
import { Box, Button, Container, Paper, Stack, Typography } from "@mui/material"
import Footer from "./Footer.tsx"

const STEPS = [
    {
        title: 'Find a game',
        text: 'Search by venue, city or state, sort by distance, and see every field on the map.'
    },
    {
        title: 'Sign up',
        text: 'Pick your preferred position and see how many spots are left.'
    },
    {
        title: 'Host your own',
        text: 'Create a game, pin the field on the map, and set the format and player limit.'
    }
]

function Homepage() {
    return (
        <div>
            <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 }, textAlign: 'center' }}>
                <Typography variant="h2" component="h1" sx={{ fontSize: { xs: '2.75rem', md: '4rem' } }}>
                    PickupPal
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 2, fontSize: '1.25rem' }}>
                    Find and organize pickup soccer games near you.
                </Typography>

                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    justifyContent="center"
                    sx={{ mt: 4 }}
                >
                    <Button component={RouterLink} to="/game-library" variant="contained" size="large">
                        Find a game
                    </Button>
                    <Button component={RouterLink} to="/create-game" variant="outlined" size="large">
                        Create a game
                    </Button>
                </Stack>

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                        gap: 3,
                        mt: 8,
                        textAlign: 'left'
                    }}
                >
                    {STEPS.map(step => (
                        <Paper key={step.title} variant="outlined" sx={{ p: 3 }}>
                            <Typography variant="h6" component="h2" gutterBottom>
                                {step.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {step.text}
                            </Typography>
                        </Paper>
                    ))}
                </Box>
            </Container>
            <Footer />
        </div>
    )
}

export default Homepage