import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import { purple } from '@mui/material/colors';


// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: purple[500],
    },
    secondary: {
      main: purple[100],
    },
    error: {
      main: red.A400,
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
});

export default theme;