import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

const rootEl = document.getElementById("root");

// Brand colors
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#36B37E", // A fresh, modern green that works well for chat apps
      light: "#4CD195",
      dark: "#2C9066",
      contrastText: "#fff",
    },
    secondary: {
      main: "#6B54DE", // A vibrant purple as secondary color
      light: "#8A76E5",
      dark: "#5342B7",
      contrastText: "#fff",
    },
    background: {
      default: "#121214", // Dark background for the main app
      paper: "#1A1A1E", // Slightly lighter for cards and surfaces
    },
    text: {
      primary: "#FFFFFF",
      secondary: "rgba(255, 255, 255, 0.7)",
    },
    divider: "rgba(255, 255, 255, 0.12)",
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: "#6b6b6b transparent",
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            width: "6px",
            height: "6px",
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: "3px",
            backgroundColor: "rgba(255, 255, 255, 0.15)",
          },
          "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover":
            {
              backgroundColor: "rgba(255, 255, 255, 0.3)",
            },
          "&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            backgroundColor: "rgba(54, 179, 126, 0.15)", // Primary color with opacity
            "&:hover": {
              backgroundColor: "rgba(54, 179, 126, 0.25)",
            },
          },
        },
      },
    },
  },
});

if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </React.StrictMode>,
  );
}
