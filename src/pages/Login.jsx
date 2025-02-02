import React, { useState, useEffect } from "react";
import "../styles/Login.css";
import { useDispatch } from "react-redux";
import { userLoginRequest } from "../store/user/userAction";
import { getCookieValue } from '../utils/helper.js';

function Login() {
  const dispatch = useDispatch();

  const [userId, setUserId] = useState("");

  const [message, setMessage] = useState("");

  useEffect(() => {
    const cookieUserId = getCookieValue('user_id');
    if (cookieUserId) {
      setUserId(cookieUserId);
    }
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!userId) {
      setMessage("Please enter a user ID.");
      return;
    }
    if (userId !== "17") {
      setMessage("This ID is not signed up.");
      return;
    }

    document.cookie = `user_id=${userId}`;

    dispatch(
      userLoginRequest(`http://192.99.8.135/pokemon_api.php?route=get_info&user_id=${userId}`)
    );

    setMessage("");
  };

  const handleInputChange = (e) => {
    setUserId(e.target.value);
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
