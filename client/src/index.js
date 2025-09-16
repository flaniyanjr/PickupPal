import React from "react";
import App from "./components/App";
import "./styling/index.css";
import "./styling/welcomepage.css"
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import ReactDOM from "react-dom/client";
import GameLibrary from "./components/GameLibrary.tsx"
import SignupForm from "./components/SignupForm";
import PersonalLibrary from "./components/PersonalLibrary";
import CreateGame from "./components/CreateGameForm.tsx";
import MainScreen from "./components/MainScreen.tsx";

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


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router} />
);








// const container = document.getElementById("root");
// const root = createRoot(container);
// root.render(<App />);
