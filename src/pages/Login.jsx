import React, { useState } from "react";
import axios from "axios";
import "../styles/Login.css";

function Login({ handleLoginSuccess }) {
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!userId) {
      setError("Please enter a user ID.");
      setMessage("");
      return;
    }

    if (userId !== "17") {
      setMessage("This ID is not signed up.");
      setError("");
      return;
    }

    try {
      const response = await axios.get(
        `http://192.99.8.135/pokemon_api.php?route=get_info&user_id=${userId}`
      );

      setError("");
      setMessage("");
      handleLoginSuccess();
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data. Please try again.");
      setMessage("");
    }
  };

  const handleInputChange = (e) => {
    setUserId(e.target.value);
    setError("");
    setMessage("");
  };

  return (
    <div className="login-container">
      <div className="form-container">
        <form className="login-form" onSubmit={submitHandler}>
          <label htmlFor="userId">Your ID:</label>
          <input
            type="text"
            id="userId"
            placeholder="Enter Your ID..."
            value={userId}
            onChange={handleInputChange}
          />
          {error && <p className="login-error">{error}</p>}
          {message && <p className="login-message">{message}</p>}
          <button className="login-button" type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
