import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import { ThemeProvider } from "@mui/material";
import { theme } from "./components/theme";

const root = ReactDOM.createRoot(document.getElementById("root"));

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
