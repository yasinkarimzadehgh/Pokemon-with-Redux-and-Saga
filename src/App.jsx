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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const x = 2;
  console.log(x);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const ProtectedRoute = ({ element }) => {
    return isLoggedIn ? element : <Navigate to="/login" replace />;
  };

  //---------------------------------------------------------------------
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
  //---------------------------------------------------------------------

  const [apiUrl, setApiUrl] = useState(
    "https://pokeapi.co/api/v2/ability/?offset=0&limit=10"
  );

  const [abilityList, setAbilityList] = useState([]);

  const [currentOffset, setCurrentOffset] = useState(0);

  const [isLastPage, setIsLastPage] = useState(false);

  const fetchPokemonAbilities = async (url) => {
    try {
      const response = await axios.get(url);
      const data = response.data;

      const newAbilities = data.results.map((item) => item.name);
      const nextApiUrl = data.next;

      setAbilityList((prev) => [...prev, ...newAbilities]);
      setCurrentOffset((prev) => prev + newAbilities.length);

      if (nextApiUrl !== null) {
        setApiUrl(nextApiUrl);
      } else {
        setApiUrl(null);
        setIsLastPage(true);
      }
    } catch (error) {
      console.error("Error fetching abilities:", error);
    }
  };

  const deletePokemonAbilities = () => {
    try {
      const remainingItems = abilityList.length - 10;

      if (remainingItems > 0 && remainingItems < 20) {
        const itemsToRemove = abilityList.length - 10;
        setAbilityList((prev) => prev.slice(0, -itemsToRemove));
        setCurrentOffset(10);
        setApiUrl("https://pokeapi.co/api/v2/ability/?offset=10&limit=10");
      } else if (remainingItems >= 20) {
        setAbilityList((prev) => prev.slice(0, -10));
        setCurrentOffset((prev) => prev - 10);
        const newOffset = currentOffset - 10;
        const newUrl = `https://pokeapi.co/api/v2/ability/?offset=${newOffset}&limit=10`;
        setApiUrl(newUrl);
      }

      setIsLastPage(false);
    } catch (error) {
      console.error("Error handling show less:", error);
    }
  };

  useEffect(() => {
    const storedAbilities = localStorage.getItem("abilityList");

    if (storedAbilities) {
      setAbilityList(JSON.parse(storedAbilities));
      setCurrentOffset((prev) => prev + JSON.parse(storedAbilities).length);

      const newOffset = JSON.parse(storedAbilities).length;

      const newUrl = `https://pokeapi.co/api/v2/ability/?offset=${newOffset}&limit=10`;
      setApiUrl(newUrl);
    } else {
      fetchPokemonAbilities(apiUrl);
    }
  }, []);

  useEffect(() => {
    if (abilityList.length > 0) {
      localStorage.setItem("abilityList", JSON.stringify(abilityList));
    }
  }, [abilityList]);

  //---------------------------------------------------------------------

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
        <ProtectedRoute element={<AppLayout abilityList={abilityList} />} />
      ),
      children: [
        {
          path: "/",
          element: <Welcome />,
        },
        {
          path: "/ability/:abilityName",
          element: <PokemonList abilityList={abilityList} />,
        },
        {
          path: "/pokemon/:pokemonName",
          element: <PokemonDetail />,
        },
        {
          path: "/abilityList",
          element: (
            <Abilities
              apiUrl={apiUrl}
              abilityList={abilityList}
              currentOffset={currentOffset}
              isLastPage={isLastPage}
              fetchPokemonAbilities={fetchPokemonAbilities}
              deletePokemonAbilities={deletePokemonAbilities}
            />
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
