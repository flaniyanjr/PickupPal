import React from "react";
import App from "./components/App";
import "./styling/index.css";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider} from "react-router-dom"
import ReactDOM from "react-dom/client";
import GameLibrary from "./components/GameLibrary"
import LoginPage from "./components/LoginPage";
import SignupForm from "./components/SignupForm";
import PersonalLibrary from "./components/PersonalLibrary";

const router = createBrowserRouter ([
    {
      path: "/",
      element: <App/>,
      children: [
        {
          path: "/",
          element: <LoginPage />,
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
        }
      ]
    }
  ]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <RouterProvider router= {router}/>
);








// const container = document.getElementById("root");
// const root = createRoot(container);
// root.render(<App />);
