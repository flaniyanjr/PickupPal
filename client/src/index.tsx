import App from "./components/App.tsx";
import "./styling/index.css";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import GameLibrary from "./components/GameLibrary.tsx"
import SignupForm from "./components/SignupForm.tsx";
import PersonalLibrary from "./components/PersonalLibrary.tsx";
import CreateGame from "./components/CreateGameForm.tsx";
import MainScreen from "./components/MainScreen.tsx";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme.ts";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <MainScreen />,
      },
      {
        path: "/game-library",
        element: <GameLibrary />,
      },
      {
        path: "/signup-form",
        element: <SignupForm />
      },
      {
        path: "/personal-page",
        element: <PersonalLibrary />
      },
      {
        path: "/create-game",
        element: <CreateGame />
      }
    ]
  }
]);


const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <RouterProvider router={router} />
  </ThemeProvider>
);

