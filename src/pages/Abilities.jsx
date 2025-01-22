import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Abilities.css";
import Loader from "../components/Loader";
import { formatNameForDisplay } from "../utils/helper";

function Abilities({
  apiUrl,
  abilityList,
  currentOffset,
  isLastPage,
  fetchPokemonAbilities,
  deletePokemonAbilities,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredAbilities, setFilteredAbilities] = useState(abilityList);

  useEffect(() => {
    setFilteredAbilities(abilityList);
  }, [abilityList]);

  const handleSearchChange = (event) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    const filtered = abilityList.filter((name) =>
      name.toLowerCase().includes(newSearchTerm.toLowerCase())
    );
    setFilteredAbilities(filtered);
  };

  return (
    <div className="abilityList">
      <div className="abilityList-search">
        <input
          type="text"
          placeholder="Search abilities..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="abilityList-searchInput"
        />
      </div>
      <div className="abilityList-items">
        {filteredAbilities.length > 0 ? (
          <ul className="abilityList-main">
            {filteredAbilities.map((name, index) => {
              return (
                <Link
                  key={index}
                  to={`/ability/${name}`}
                  className="abilityList-item"
                >
                  {formatNameForDisplay(name)}
                </Link>
              );
            })}
          </ul>
        ) : (
          <Loader />
        )}
        <div className="abilityList-controls">
          {currentOffset > 10 && (
            <button
              className="show-less"
              onClick={deletePokemonAbilities}
              aria-label="Show previous abilities"
            >
              Show Less
            </button>
          )}
          {!isLastPage && (
            <button
              className="show-more"
              onClick={() => fetchPokemonAbilities(apiUrl)}
              aria-label="Show more abilities"
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Abilities;
