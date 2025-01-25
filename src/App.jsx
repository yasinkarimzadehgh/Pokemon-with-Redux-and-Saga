import { useEffect, useState } from "react";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import axios from "axios";

import AppLayout from "./pages/AppLayout";
import Login from "./pages/Login";
import Welcome from "./pages/Welcome";
import PokemonList from "./pages/PokemonList";
import PokemonDetail from "./pages/PokemonDetail";
import Abilities from "./pages/Abilities";
import Home from "./pages/Home";

import "./styles/theme.css";

function App() {
  //! ---------------------------------------------------------------------

  const [isLoggedIn, setIsLoggedIn] = useState(false);


  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const ProtectedRoute = ({ element }) => {
    return isLoggedIn ? element : <Navigate to="/login" replace />;
  };

  //! ---------------------------------------------------------------------
  const [userData, setUserData] = useState(null);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        "http://192.99.8.135/pokemon_api.php?route=get_info&user_id=17"
      );
      setUserData(response.data);
      document.documentElement.setAttribute("data-theme", response.data.theme);
      document.body.setAttribute("data-theme", response.data.theme);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      const storedUserData = localStorage.getItem("userData");

      if (storedUserData) {
        setUserData(JSON.parse(storedUserData));
        document.documentElement.setAttribute(
          "data-theme",
          JSON.parse(storedUserData).theme
        );
        document.body.setAttribute(
          "data-theme",
          JSON.parse(storedUserData).theme
        );
      } else {
        fetchUserData();
      }
    }
  }, [isLoggedIn]);
  //! ---------------------------------------------------------------------



  //! ---------------------------------------------------------------------

  const router = createBrowserRouter([
    {
      path: "/login",
      element: isLoggedIn ? (
        <Navigate to="/" replace />
      ) : (
        <Login handleLoginSuccess={handleLoginSuccess} />
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
          path: "/pokemon/:pokemonName",
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
            <Home setUserData={setUserData} setIsLoggedIn={setIsLoggedIn} />
          ),
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
