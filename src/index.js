import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import { ThemeProvider } from "@mui/material";
import { theme } from "./components/theme";

const root = ReactDOM.createRoot(document.getElementById("root"));

theme.typography.h1 = {
  fontSize: "5rem",
  "@media (min-width:600px)": {
    fontSize: "4.5rem",
    fontStyle: "normal",
    fontWeight: "300",
  },
  [theme.breakpoints.up("lg")]: {
    fontSize: "5rem",
    fontStyle: "normal",
    fontWeight: "300",
  },
};
theme.typography.h2 = {
  fontSize: "3.75rem",
  "@media (min-width:600px)": {
    fontSize: "2.1rem",
    fontStyle: "normal",
    fontWeight: "300",
  },
  [theme.breakpoints.up("xl")]: {
    fontSize: "3.75rem",
    fontStyle: "normal",
    fontWeight: "300",
  },
};
theme.typography.h3 = {
  fontSize: "3.75rem",
  "@media (min-width:600px)": {
    fontSize: "2.1rem",
    fontStyle: "normal",
    fontWeight: "300",
  },
  [theme.breakpoints.up("xl")]: {
    fontSize: "3.75rem",
    fontStyle: "normal",
    fontWeight: "300",
  },
};
theme.typography.h4 = {
  fontSize: "2.125rem",
  "@media (min-width:600px)": {
    fontSize: "1.4rem",
    fontStyle: "normal",
    fontWeight: "300",
  },
  [theme.breakpoints.up("xl")]: {
    fontSize: "2.125rem",
    fontStyle: "normal",
    fontWeight: "300",
  },
};
theme.typography.h5 = {
  fontSize: "1.5rem",
  "@media (min-width:600px)": {
    fontSize: "1.2rem",
    fontStyle: "normal",
    fontWeight: "300",
  },
  [theme.breakpoints.up("xl")]: {
    fontSize: "1.5rem",
    fontStyle: "normal",
    fontWeight: "300",
  },
};
theme.typography.h6 = {
  fontSize: "1.25rem",
  "@media (min-width:600px)": {
    fontSize: "0.9rem",
    fontStyle: "normal",
    fontWeight: "300",
  },
  [theme.breakpoints.up("xl")]: {
    fontSize: "1.25rem",
    fontStyle: "normal",
    fontWeight: "300",
  },
};
theme.typography.body1 = {
  fontSize: "1rem",
  "@media (min-width:600px)": {
    fontSize: "0.8rem",
    fontStyle: "normal",
    fontWeight: "300",
  },
  [theme.breakpoints.up("xl")]: {
    fontSize: "1rem",
    fontStyle: "normal",
    fontWeight: "300",
  },
};

root.render(
  <ThemeProvider theme={theme}>
    <Auth0Provider
      domain={process.env.REACT_APP_DOMAIN}
      clientId={process.env.REACT_APP_CLIENT_ID}
      redirectUri={process.env.REACT_APP_REDIRECT}
      audience={process.env.REACT_APP_AUDIENCE}
      scope={process.env.REACT_APP_SCOPE}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Auth0Provider>
  </ThemeProvider>
);
