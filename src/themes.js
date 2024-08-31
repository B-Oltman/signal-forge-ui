// src/themes.js
import { createTheme } from '@mui/material/styles';

export const dwarvishTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff9800', // Bright orange for the primary color
    },
    secondary: {
      main: '#ff5722', // A fiery orange-red for secondary accents
    },
    background: {
      default: '#1c1c1c', // Dark stone-like background
      paper: '#212121', // Stone texture for paper elements
    },
  },
  typography: {
    fontFamily: 'Uncial Antiqua, sans-serif', // Fantasy-style font
    h1: {
      fontFamily: 'MedievalSharp, serif',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#2e2e2e', // Darker, stone-like texture
          borderBottom: '1px solid #ff9800', // Accent with a metallic finish
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#3c3c3c', // Stone texture
          color: '#ffffff',
          '& .MuiIconButton-root': {
            color: '#ff9800', // Matching the primary color
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px', // Slightly rounded corners        
          backgroundImage: 'linear-gradient(145deg, #ff9800, #ff5722)', // Fiery gradient
        },
      },
    },
  },
});

export const dwarvishIceTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#00bcd4', // Icy blue for the primary color
    },
    secondary: {
      main: '#00acc1', // Deeper blue for secondary accents
    },
    background: {
      default: '#e0f7fa', // Light icy blue background
      paper: '#b6eff6', // Slightly darker icy blue for paper elements
    },
  },
  typography: {
    fontFamily: 'Uncial Antiqua, sans-serif', // Fantasy-style font
    h1: {
      fontFamily: 'MedievalSharp, serif',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#b2ebf2', // Icy blue background
          borderBottom: '1px solid #00bcd4', // Icy accent
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#81d4fa', // Light icy blue
          color: '#004d40', // Darker blue for text
          '& .MuiIconButton-root': {
            color: '#00bcd4', // Matching the primary color
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px', // Slightly rounded corners
          backgroundImage: 'linear-gradient(145deg, #00bcd4, #00acc1)', // Icy gradient
        },
      },
    },
  },
});

export const modernDarkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#ff9800', // Bright orange for the primary color
      },
      secondary: {
        main: '#f48fb1', // Keeping the pink as a secondary color
      },
      background: {
        default: '#121212',
        paper: '#1e1e1e',
      },
    },
    typography: {
      fontFamily: 'Roboto, sans-serif',
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: '#1e1e1e',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: '#2c2c2c',
          },
        },
      },
    },
  });

export const modernLightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});
