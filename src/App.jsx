import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

import { useSelector } from "react-redux";


import AppLayout from "./pages/AppLayout";
import Login from "./pages/Login";
import Welcome from "./pages/Welcome";
import PokemonList from "./pages/PokemonList";
import PokemonDetail from "./pages/PokemonDetail";
import Abilities from "./pages/Abilities";
import Home from "./pages/Home";

import "./styles/theme.css";

function App() {


  const { isLoggedIn } = useSelector(state => state.user);

  const ProtectedRoute = ({ element }) => {
    return isLoggedIn ? element : <Navigate to="/login" replace />;
  };


  const router = createBrowserRouter([
    {
      path: "/login",
      element: isLoggedIn ? (
        <Navigate to="/" replace />
      ) : (
        <Login />
      ),
    },
    {
      path: "/",
      element: (
        <ProtectedRoute element={<AppLayout />} />
      ),
      children: [
        {
          path: "/",
          element: <Welcome />,
        },
        {
          path: "/ability/:abilityName",
          element: <PokemonList />,
        },
        {
          path: "/pokemons/:pokemonName",
          element: <PokemonDetail />,
        },
        {
          path: "/abilityList",
          element: (
            <Abilities />
          ),
        },
        {
          path: "/home",
          element: (
            <Home />
          ),
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
