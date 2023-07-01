import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import "./Signup.css";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [cookies, setCookies] = useCookies(["token"]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Perform form validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Form data is valid, proceed with signup
    const formData = {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    };

    fetch("https://odin-book-api-production.up.railway.app/sign-up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Signup success");

          // Automatically log in the user after successful signup
          return fetch(
            "https://odin-book-api-production.up.railway.app/login",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email, password }),
            }
          );
        } else {
          setError("Error creating account");
          throw new Error("Error creating account");
        }
      })
      .then((response) => {
        if (response.ok) {
          console.log("Login successful");
          return response.json();
        } else {
          setError("Error logging in");
          throw new Error("Error logging in");
        }
      })
      .then((data) => {
        const { token } = data;
        setCookies("token", token, { path: "/" });

        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        setError("An unexpected error occurred");
      });
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        {error && <p className="signup-error">{error}</p>}

        <h2 className="signup-title">Sign Up for OdinBook</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="First Name"
            className="signup-input"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Last Name"
            className="signup-input"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="signup-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="signup-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="signup-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <div className="button-container-signup">
            <button type="submit" className="signup-button">
              Create account
            </button>

            <hr />
            <Link to="/">
              <button type="submit" className="back-button">
                Back to login
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
