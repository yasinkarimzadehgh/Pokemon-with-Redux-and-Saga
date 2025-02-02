import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { getAbilitiesRequest, deleteAbilitiesRequest, GET_ABILITIES_STORED } from '../store/ability/abilityAction';

import Loader from '../components/Loader';
import { formatNameForDisplay } from '../utils/helper.js';

import '../styles/Abilities.css';


function Abilities() {
  const dispatch = useDispatch();
  const { abilityList, currentOffset, loading, API_URL, isLastPage } = useSelector(state => state.ability);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const storedAbilityList = localStorage.getItem("abilityList");
    if (storedAbilityList) {
      const parsedAbilities = JSON.parse(storedAbilityList);
      dispatch({
        type: GET_ABILITIES_STORED,
        payload: {
          abilityList: parsedAbilities,
          currentOffset: parsedAbilities.length,
          nextApiUrl: `https://pokeapi.co/api/v2/ability/?offset=${currentOffset}&limit=10`,
          isLastPage: false,
        }
      })
    }
    else if (abilityList.length === 0) {
      dispatch(getAbilitiesRequest(API_URL));
    }
  }, []);

  useEffect(() => {
    if (abilityList.length > 0) {
      localStorage.setItem("abilityList", JSON.stringify(abilityList));
    }
  }, [abilityList]);

  const filteredAbilities = useMemo(() => {
    return abilityList.filter(name =>
      name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [abilityList, searchTerm]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleShowMore = () => {
    dispatch(getAbilitiesRequest(API_URL));
  };

  const handleShowLess = () => {
    dispatch(deleteAbilitiesRequest());
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
        {loading ? (
          <Loader />
        ) : (
          <>
            {filteredAbilities.length > 0 ? (
              <ul className="abilityList-main">
                {filteredAbilities.map((name, index) => (
                  <Link
                    key={index}
                    to={`/ability/${name}`}
                    className="abilityList-item"
                  >
                    {formatNameForDisplay(name)}
                  </Link>
                ))}
              </ul>
            ) : (
              <p>No abilities found.</p>
            )}
            <div className="abilityList-controls">
              {abilityList.length > 10 && (
                <button className="show-less" onClick={handleShowLess}>
                  Show Less
                </button>
              )}
              {!isLastPage && (
                <button className="show-more" onClick={handleShowMore}>
                  Show More
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Abilities;