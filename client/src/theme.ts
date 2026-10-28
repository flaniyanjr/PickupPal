import { createTheme } from "@mui/material/styles"

const headingFont = '"Marcellus", Georgia, serif'

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#C62833',
            light: '#E5535D',
            dark: '#8E1B23',
            contrastText: '#FFFFFF'
        },
        secondary: {
            main: '#EECE96'
        },
        background: {
            // Pure black on purpose: the header and silhouette images are JPGs with black backgrounds
            default: '#000000',
            paper: '#161214'
        },
        text: {
            primary: '#EDEADE',
            secondary: 'rgba(237, 234, 222, 0.7)'
        }
    },
    typography: {
        fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
        h1: { fontFamily: headingFont },
        h2: { fontFamily: headingFont },
        h3: { fontFamily: headingFont },
        h4: { fontFamily: headingFont },
        h5: { fontFamily: headingFont },
        h6: { fontFamily: headingFont },
        button: { textTransform: 'none', fontWeight: 600 }
    },
    shape: {
        borderRadius: 10
    },
    components: {
        MuiButton: {
            defaultProps: { disableElevation: true }
        }
    }
})

export default theme