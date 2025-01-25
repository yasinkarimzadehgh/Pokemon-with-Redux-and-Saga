import React from "react";
import "../styles/Footer.css";
import { NavLink, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

function Footer() {
  const { abilityList } = useSelector(state => state.ability);
  const { abilityName } = useParams();
  const isPokemonsActive = (isActive) => {
    return isActive || (abilityName && abilityList.includes(abilityName));
  };

  return (
    <div className="footer">
      <NavLink
        className={({ isActive }) =>
          isPokemonsActive(isActive) ? "footer-link active-link" : "footer-link"
        }
        to="/ability/stench"
      >
        <i className="fa-brands fa-github"></i> Pokemons
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          isActive ? "footer-link active-link" : "footer-link"
        }
        to="/abilityList"
      >
        <i className="fa-solid fa-bars"></i> Abilities
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          isActive ? "footer-link active-link" : "footer-link"
        }
        to="/home"
      >
        <i className="fa-solid fa-house-user"></i> Home
      </NavLink>
    </div>
  );
}

export default Footer;
