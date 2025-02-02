import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "animate.css";
import Loader from "../components/Loader";
import Error from "../components/Error";
import { formatNameForDisplay } from "../utils/helper.js";
import "../styles/PokemonList.css";
import { useDispatch, useSelector } from "react-redux";
import { getPokemonListRequest } from "../store/pokemonList/pokemonListAction";

function PokemonList() {
  const { abilityName } = useParams();

  const dispatch = useDispatch();
  const { abilityList } = useSelector(state => state.ability);
  const { pokemonList, loading, error } = useSelector(state => state.pokemonList);

  const navigate = useNavigate();


  useEffect(() => {
    dispatch(getPokemonListRequest(`https://pokeapi.co/api/v2/ability/${abilityName}`));
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
        pokemonList && (
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
                  {pokemonList.map(
                    (pokemon, index) =>
                      pokemon && (
                        <tr
                          key={index}
                          onClick={() => navigate(`/pokemons/${pokemon.name}`)}
                          className="pokemon-row"
                        >
                          <td>
                            <Link
                              to={`/pokemons/${pokemon.name}`}
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
