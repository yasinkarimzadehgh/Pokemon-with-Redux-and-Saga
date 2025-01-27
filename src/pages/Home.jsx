import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
import { userLogout, userUpdateRequest } from "../store/user/userAction";

function Home() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userData } = useSelector((state) => state.user);

    const [image, setImage] = useState(null);
    const [name, setName] = useState(userData?.name || "");
    const [theme, setTheme] = useState(userData?.theme || "light");

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
        }
    };

    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        if (image) {
            formData.append("picture", image);
        }
        formData.append("name", name);
        formData.append("theme", theme);

        dispatch(userUpdateRequest(formData));
    };

    useEffect(() => {
        const handleBackspaceKey = (event) => {
            if (event.key === "Backspace" && event.target.tagName !== "INPUT" && event.target.tagName !== "TEXTAREA") {
                dispatch(userLogout());
                navigate("/login");
            }
        };

        window.addEventListener("keydown", handleBackspaceKey);

        return () => {
            window.removeEventListener("keydown", handleBackspaceKey);
        };
    }, [dispatch, navigate]);

    return (
        <div className="profile-container">
            <p className="profile-title">Profile Settings</p>
            <div className="settings-main">
                <form className="settings-form" onSubmit={submitHandler}>
                    {image ? (
                        <img src={URL.createObjectURL(image)} alt="Preview" className="profile-image" />
                    ) : userData.picture ? (
                        <img src={userData.picture} alt="User" className="profile-image" />
                    ) : (
                        <p>No image selected</p>
                    )}

                    <input type="file" accept="image/*" onChange={handleImageChange} />

                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        placeholder="Your Name..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="settings-input"
                    />

                    <label htmlFor="theme">Theme:</label>
                    <select
                        id="theme"
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                        className="settings-select"
                    >
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