import { createTheme } from "@mui/material";
import Drab from "../Font/DRAB.ttf";

const Drabfont = {
  fontFamily: "Drab",
  fontStyle: "normal",
  fontDisplay: "swap",
  fontWeight: 400,
  src: `
    url(${Drab}) format('truetype')
  `,
};

export const theme = createTheme({
  // breakpoints: {
  //   values: {
  //     xs: "20vw",
  //     sm: "40vw",
  //     md: "50vw",
  //     lg: "60vw",
  //     xl: "80vw",
  //   },
  // },
  palette: {
    primary: {
      main: "#CFFF04",
    },
    secondary: {
      main: "#E600FF",
    },
    tertiary: {
      main: "#333333",
      lighter: "#8E8E8E",
    },
    electric: {
      main: "#1F51FF",
    },
    neongreen: {
      main: "#31ED31",
    },
    hotpink: {
      main: "#FF69B4",
    },
    offwhite: {
      main: "#E8DACC",
    },
    black: {
      main: "#000000",
    },
    // background: {
    //   paper: "#919191",
    // },
    text: {
      color: "#FFFFFF",
    },
  },
  question: {
    field: {
      marginTop: 20,
      marginBottom: 20,
      display: "block",
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#333333", //black bg
          borderRadius: 24,
          color: "#FFFFFF",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        color: "#FFFFFF",
      },
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
      "Drab",
    ].join(","),
  },
});
