import * as React from "react"
import { Link as RouterLink, NavLink } from "react-router-dom"
import { AppBar, Toolbar, Box, Button, Typography, Menu, MenuItem } from "@mui/material"
import newlogo from "../img/newlogo.jpg"
import { User } from "../types"

interface HeaderProps {
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
}

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Pickup Games', to: '/game-library' },
  { label: 'My Games', to: '/personal-page' },
  { label: 'Created Games', to: '/create-game' }
]

function Header({ user, setUser }: HeaderProps) {

  // Which button the mobile menu is attached to. null means the menu is closed.
  const [menuAnchor, setMenuAnchor] = React.useState<HTMLElement | null>(null)

  async function handleLogout() {
    const response = await fetch('/logout', {
      method: 'DELETE'
    })
    if (response.ok) {
      setUser(null)
    }
  }

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: '#000',
        color: 'text.primary',
        backgroundImage: 'none',
        borderBottom: 1,
        borderColor: 'primary.dark'
      }}
    >
      <Toolbar sx={{ gap: 2 }}>
        <Box
          component={RouterLink}
          to="/"
          sx={{ display: 'flex', alignItems: 'center', gap: 1.5, textDecoration: 'none', color: 'text.primary' }}
        >
          <Box component="img" src={newlogo} alt="PickupPal logo" sx={{ height: 40, display: 'block' }} />
          <Typography variant="h6" component="span" sx={{ display: { xs: 'none', sm: 'block' } }}>
            PickupPal
          </Typography>
        </Box>

        {user ? (
          <>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
              {NAV_LINKS.map(link => (
                <Button
                  key={link.to}
                  component={NavLink}
                  to={link.to}
                  end={link.to === '/'}
                  color="inherit"
                  sx={{
                    '&.active': { bgcolor: 'primary.main', color: 'primary.contrastText' },
                    '&.active:hover': { bgcolor: 'primary.dark' }
                  }}
                >
                  {link.label}
                </Button>
              ))}
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
                Signed in as {user.username}
              </Typography>
              <Button variant="outlined" color="inherit" size="small" onClick={handleLogout}>
                Logout
              </Button>
            </Box>

            <Button
              color="inherit"
              onClick={e => setMenuAnchor(e.currentTarget)}
              sx={{ display: { xs: 'inline-flex', md: 'none' } }}
            >
              Menu
            </Button>
            <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
              {NAV_LINKS.map(link => (
                <MenuItem
                  key={link.to}
                  component={NavLink}
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setMenuAnchor(null)}
                  sx={{ '&.active': { color: 'primary.light' } }}
                >
                  {link.label}
                </MenuItem>
              ))}
            </Menu>
          </>
        ) : null}
      </Toolbar>
    </AppBar>
  )
}

export default Header