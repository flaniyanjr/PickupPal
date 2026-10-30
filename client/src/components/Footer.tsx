import { Box, Typography } from "@mui/material"

function Footer() {
    return (
        <Box
            component="footer"
            sx={{ borderTop: 1, borderColor: 'primary.dark', mt: 4, py: 2, textAlign: 'center' }}
        >
            <Typography variant="body2" color="text.secondary">
                Designed by Felix Laniyan
            </Typography>
        </Box>
    )
}

export default Footer