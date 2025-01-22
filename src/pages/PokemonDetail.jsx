import React, { useEffect, useState } from "react";
import "../styles/PokemonDetail.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import { getPokemonSprite, formatNameForDisplay } from "../utils/helper";
import Loader from "../components/Loader";
import Error from "../components/Error";
import { useNavigate } from "react-router-dom";

function PokemonDetail() {
  const navigate = useNavigate();

  const { pokemonName } = useParams();
  const [pokemonDetail, setPokemonDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function getPokemonDetail(name) {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${name}`
      );
      setPokemonDetail(response.data);
    } catch (error) {
      setError(error);
      console.log("Error: ", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getPokemonDetail(pokemonName);
  }, [pokemonName]);

  const playPokemonCry = (type) => {
    if (pokemonDetail?.cries?.[type]) {
      const audio = new Audio(pokemonDetail.cries[type]);
      audio.play().catch((error) => {
        setError(error);
      });
    }
  };

  useEffect(() => {
    const handleBackspaceKey = (event) => {
      if (event.key === "Backspace") {
        navigate(-1);
      }
    };

    window.addEventListener("keydown", handleBackspaceKey);

    return () => {
      window.removeEventListener("keydown", handleBackspaceKey);
    };
  }, [navigate]);

  return (
    <div className="pokemon-detail">
      {loading ? (
        <Loader />
      ) : error ? (
        <Error />
      ) : (
        pokemonDetail && (
          <>
            <h1 className="pokemon-name">
              {formatNameForDisplay(pokemonDetail.name)}
            </h1>
            <img
              src={getPokemonSprite(pokemonDetail.sprites)}
              alt={pokemonDetail.name}
              className="pokemon-sprite"
            />
            <div className="pokemon-audio-controls">
              <button
                className="cry-button"
                onClick={() => playPokemonCry("latest")}
                title="Play Latest Cry"
              >
                <i class="fa-solid fa-volume-high"></i>
                <span>Latest Cry</span>
              </button>
              <button
                className="cry-button"
                onClick={() => playPokemonCry("legacy")}
                title="Play Legacy Cry"
              >
                <i class="fa-solid fa-volume-high"></i>
                <span>Legacy Cry</span>
              </button>
            </div>
            <div className="pokemon-info">
              <h2>Details</h2>
              <div className="pokemon-details">
                <p>
                  <strong>Types: </strong>
                  {pokemonDetail.types.map((type) => type.type.name).join(", ")}
                </p>
                <p>
                  <strong>Height:</strong> {pokemonDetail.height / 10} m
                </p>
                <p>
                  <strong>Weight:</strong> {pokemonDetail.weight / 10} kg
                </p>
                <p>
                  <strong>Base Experience:</strong>
                  {pokemonDetail.base_experience}
                </p>

                <p>
                  <strong>Abilities: </strong>

                  {pokemonDetail.abilities && pokemonDetail.abilities.length > 0
                    ? pokemonDetail.abilities
                      .map((ability) =>
                        formatNameForDisplay(ability.ability.name)
                      )
                      .join(", ")
                    : "No abilities"}
                </p>
              </div>
            </div>
          </>
        )
      )}
    </div>
  );
}

export default PokemonDetail;
