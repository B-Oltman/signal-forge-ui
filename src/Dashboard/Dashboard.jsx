import React, { useEffect, useState } from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { mainListItems, secondaryListItems } from './listItems';
import TradingSystemManagement from '../TradingSystemManagement';
import SplashScreen from './SplashScreen';
import { dwarvishTheme, modernLightTheme, dwarvishIceTheme, modernDarkTheme } from '../themes'; // Import the themes
import { MenuItem, Select } from '@mui/material';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://signalforge.co/">
        Signal Forge
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      backgroundColor: theme.palette.background.paper,
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

export default function Dashboard() {
  const [open, setOpen] = useState(true);
  const [isSplashVisible, setIsSplashVisible] = useState(false);

  const [theme, setTheme] = useState(dwarvishTheme); // Set initial theme

  const handleThemeChange = (event) => {
    const selectedTheme = event.target.value;
    if (selectedTheme === 'dwarvish') {
      setTheme(dwarvishTheme);
      setIsSplashVisible(true);
    } else if (selectedTheme === 'dwarvishIce') {
      setTheme(dwarvishIceTheme);
    } else if (selectedTheme === 'modernLight') {
      setTheme(modernLightTheme);
    } else if (selectedTheme === 'modernDark') {
      setTheme(modernDarkTheme);
    } else {
      setTheme(dearvishTheme);
    }
  };

  const handleSplashFinish = () => {
    setIsSplashVisible(false);
  };

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              onClick={() => setIsSplashVisible(true)}
              sx={{ flexGrow: 1 }}
            >
              Forge
            </Typography>
            <Select
              value={
                theme === dwarvishTheme
                  ? 'dwarvish'
                  : theme === dwarvishIceTheme
                  ? 'dwarvishIce'
                  : theme === modernLightTheme
                  ? 'modernLight'
                  : theme === modernDarkTheme
                  ? 'modernDark'
                  : 'modernDark'
              }
              onChange={handleThemeChange}
              sx={{ color: 'white', borderColor: 'white', backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            >
              <MenuItem value="dwarvish">Dwarvish Theme</MenuItem>
              <MenuItem value="dwarvishIce">Dwarvish Ice Theme</MenuItem>
              <MenuItem value="modernLight">Modern Light Theme</MenuItem>
              <MenuItem value="modernDark">Modern Dark Theme</MenuItem>
            </Select>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            {mainListItems}
            <Divider sx={{ my: 1 }} />
            {secondaryListItems}
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: theme.palette.background.default,
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {isSplashVisible && <SplashScreen onFinish={handleSplashFinish} />}
            {!isSplashVisible && (
              <div className="dashboard-content">
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', backgroundColor: theme.palette.background.paper }}>
                      <TradingSystemManagement />
                    </Paper>
                  </Grid>
                </Grid>
                <Copyright sx={{ pt: 4 }} />
              </div>
            )}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
