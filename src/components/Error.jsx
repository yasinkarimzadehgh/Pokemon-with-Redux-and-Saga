import React from "react";
import "../styles/Error.css";
import { Link } from "react-router-dom";

function Error() {
  return (
    <div className="error-container">
      <h2 className="error-title">Oops! Something went wrong.</h2>

      <Link className="error-retry-button" to={"/abilityList"}>
        Back to Ability
      </Link>
    </div>
  );
}
export default Error;
