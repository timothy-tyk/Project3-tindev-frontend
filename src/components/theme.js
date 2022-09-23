import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#CFFF04",
    },
    secondary: {
      main: "#E600FF",
    },
    tertiary: {
      main: "#333333",
    },
  },
  question: {
    field: {
      marginTop: 20,
      marginBottom: 20,
      display: "block",
    },
  },
});
