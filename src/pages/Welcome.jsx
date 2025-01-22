import React from "react";
import "../styles/Welcome.css";

const Welcome = () => {
  return (
    <div className="welcome-page">
      <div className="welcome-content">
        <h1 className="welcome-title">Welcome to PokéWorld</h1>
        <p className="welcome-caption">
          Discover and explore the fascinating world of Pokémon.
        </p>
      </div>
    </div>
  );
};

export default Welcome;
