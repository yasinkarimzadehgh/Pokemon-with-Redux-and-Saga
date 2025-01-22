import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "animate.css";
import Loader from "../components/Loader";
import Error from "../components/Error";
import { getPokemonSprite, formatNameForDisplay } from "../utils/helper";
import "../styles/PokemonList.css";

function PokemonList({ abilityList }) {
  const navigate = useNavigate();
  const { abilityName } = useParams();
  const [abilityDetail, setAbilityDetail] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  async function getAbilityDetail(name, fetchLimit) {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/ability/${name}`
      );
      const abilityDetail = response.data;

      const pokemonUrls = abilityDetail.pokemon.map(
        (pokemon) => pokemon.pokemon.url
      );

      const pokemonList = [];
      const totalBatches = Math.ceil(pokemonUrls.length / fetchLimit);

      const processBatch = async (batchIndex = 0) => {
        if (batchIndex >= totalBatches) {
          return;
        }

        const startIndex = batchIndex * fetchLimit;
        const endIndex = Math.min(startIndex + fetchLimit, pokemonUrls.length);
        const batchUrls = pokemonUrls.slice(startIndex, endIndex);

        try {
          const batchResults = await Promise.all(
            batchUrls.map(async (url) => {
              try {
                const pokemonResponse = await axios.get(url);
                const pokemonData = pokemonResponse.data;

                const transformedData = {
                  name: pokemonData.name,
                  sprite: getPokemonSprite(pokemonData.sprites),
                  abilities: pokemonData.abilities.map((ability) => ({
                    name: ability.ability.name,
                  })),
                };
                return transformedData;
              } catch (error) {
                console.error(`Error fetching ${url}:`, error);
                return null;
              }
            })
          );
          pokemonList.push(...batchResults);

          await processBatch(batchIndex + 1);
        } catch (error) {
          setError(err);
          console.error("Error fetching ability details:", err);
          setAbilityDetail([]);
        }
      };

      await processBatch();
      setAbilityDetail(pokemonList);
    } catch (err) {
      setError(err);
      console.error("Error fetching ability details:", err);
      setAbilityDetail([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getAbilityDetail(abilityName, 50);
  }, [abilityName]);

  const handleBack = () => navigate("/abilityList");

  const handlePrev = () => {
    const prevAbilityName = abilityList[abilityList.indexOf(abilityName) - 1];
    navigate(`/ability/${prevAbilityName}`);
  };

  const handleNext = () => {
    const nextAbilityName = abilityList[abilityList.indexOf(abilityName) + 1];
    navigate(`/ability/${nextAbilityName}`);
  };

  const isPrevDisabled = abilityList.indexOf(abilityName) === 0;
  const isNextDisabled =
    abilityList.indexOf(abilityName) === abilityList.length - 1;

  useEffect(() => {
    const handleBackspaceKey = (event) => {
      if (event.key === "Backspace") {
        navigate("/home");
      }
    };

    window.addEventListener("keydown", handleBackspaceKey);

    return () => {
      window.removeEventListener("keydown", handleBackspaceKey);
    };
  }, [navigate]);

  return (
    <div className="ability-detail-container">
      {loading ? (
        <Loader />
      ) : error ? (
        <Error error={error} />
      ) : (
        abilityDetail && (
          <>
            <div className="ability-header">
              <button onClick={handleBack} className="back-button">
                Back To Ability List
              </button>
              <h2 className="ability-name">
                {formatNameForDisplay(abilityName)}
              </h2>
              <div className="navigation-buttons">
                {!isPrevDisabled && (
                  <button onClick={handlePrev} className="prev-button">
                    Previous Ability
                  </button>
                )}
                {!isNextDisabled && (
                  <button onClick={handleNext} className="next-button">
                    Next Ability
                  </button>
                )}
              </div>
            </div>

            <div className="pokemon-list-container">
              <h3 className="pokemon-list-title">
                List of Pokémon's with this Ability:
              </h3>
              <table className="pokemon-table">
                <thead className="pokemon-table-header">
                  <tr>
                    <th>Name</th>
                    <th>Image</th>
                    <th>Other Abilities of this Pokémon</th>
                  </tr>
                </thead>
                <tbody className="pokemon-table-body">
                  {abilityDetail.map(
                    (pokemon, index) =>
                      pokemon && (
                        <tr
                          key={index}
                          onClick={() => navigate(`/pokemon/${pokemon.name}`)}
                          className="pokemon-row"
                        >
                          <td>
                            <Link
                              to={`/pokemon/${pokemon.name}`}
                              className="pokemon-name-link"
                            >
                              {formatNameForDisplay(pokemon.name)}
                            </Link>
                          </td>
                          <td>
                            <img
                              src={pokemon.sprite}
                              alt={pokemon.name}
                              className="pokemon-sprite"
                            />
                          </td>
                          <td>
                            {pokemon.abilities && pokemon.abilities.length > 1
                              ? pokemon.abilities
                                .filter(
                                  (ability) => ability.name !== abilityName
                                )
                                .map((ability) =>
                                  formatNameForDisplay(ability.name)
                                )
                                .join(", ")
                              : "No other abilities"}
                          </td>
                        </tr>
                      )
                  )}
                </tbody>
              </table>
            </div>
          </>
        )
      )}
    </div>
  );
}

export default PokemonList;
