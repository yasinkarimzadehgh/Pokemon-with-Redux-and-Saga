import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../styles/Home.css";
import { useNavigate } from "react-router-dom";

function Home({ setUserData, setIsLoggedIn }) {
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [name, setName] = useState("");
  const [theme, setTheme] = useState("light");

  const prevDataRef = useRef({ name: "", theme: "light", image: null });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://192.99.8.135/pokemon_api.php?route=get_info&user_id=17"
        );
        const data = response.data;

        if (
          data.name !== prevDataRef.current.name ||
          data.theme !== prevDataRef.current.theme ||
          data.image !== prevDataRef.current.image
        ) {
          setUserData(data);
          setName(data.name);
          setTheme(data.theme);
          setPreview(data.image);
          setImage(data.image);
          localStorage.setItem("userData", JSON.stringify(data));

          document.documentElement.setAttribute("data-theme", data.theme);
          document.body.setAttribute("data-theme", data.theme);

          prevDataRef.current = {
            name: data.name,
            theme: data.theme,
            image: data.image,
          };
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const intervalId = setInterval(fetchData, 2000);

    return () => clearInterval(intervalId);
  }, [setUserData]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleThemeChange = (e) => {
    setTheme(e.target.value);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("picture", image);
    formData.append("name", name);
    formData.append("theme", theme);

    try {
      const response = await axios.post(
        "http://192.99.8.135/pokemon_api.php?route=set_info&user_id=17",
        formData
      );
      setUserData(response.data);
      localStorage.setItem("userData", JSON.stringify(response.data));
      console.log("UserData saved to localStorage:", response.data);

      document.documentElement.setAttribute("data-theme", theme);
      document.body.setAttribute("data-theme", theme);

      prevDataRef.current = {
        name: name,
        theme: theme,
        image: response.data.image,
      };
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  useEffect(() => {
    const handleBackspaceKey = (event) => {
      if (event.key === "Backspace") {
        setIsLoggedIn(false);
      }
    };

    window.addEventListener("keydown", handleBackspaceKey);

    return () => {
      window.removeEventListener("keydown", handleBackspaceKey);
    };
  }, [navigate]);

  return (
    <div className="profile-container">
      <p className="profile-title">Profile Settings</p>
      <div className="settings-main">
        <form className="settings-form" onSubmit={submitHandler}>
          {preview && (
            <img src={preview} alt="Preview" className="profile-image" />
          )}
          <input type="file" accept="image/*" onChange={handleImageChange} />

          <label htmlFor="userName">Name:</label>
          <input
            type="text"
            id="name"
            placeholder="Your Name..."
            value={name}
            onChange={handleNameChange}
            className="settings-input"
          />

          <label htmlFor="theme">Theme:</label>
          <select
            id="theme"
            value={theme}
            onChange={handleThemeChange}
            className="settings-select"
          >
            <option value="">Select Theme</option>
            <option value="light">Light Mode</option>
            <option value="dark">Dark Mode</option>
          </select>

          <button className="update-button" type="submit">
            Update
          </button>
        </form>
      </div>
    </div>
  );
}

export default Home;
