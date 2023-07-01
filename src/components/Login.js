import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cookies, setCookies] = useCookies(["token"]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const formData = {
    email,
    password,
  };

  const handleLogin = (e) => {
    e.preventDefault();

    setLoading(true);

    fetch("https://odin-book-api-production.up.railway.app/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Login successful");
          return response.json();
        } else {
          throw new Error("Invalid email or password");
        }
      })
      .then((data) => {
        const { token } = data;

        setCookies("token", token, { path: "/" });

        navigate("/");
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Clear inputs if login error
  useEffect(() => {
    if (error) {
      setEmail("");
      setPassword("");
    }
  }, [error]);

  const handleDemoLogin = (e) => {
    e.preventDefault();

    const demoEmail = "test@user.com";
    const demoPassword = "test";

    fetch("https://odin-book-api-production.up.railway.app/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: demoEmail, password: demoPassword }),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Login successful");
          return response.json();
        } else {
          throw new Error("Invalid email or password");
        }
      })
      .then((data) => {
        const { token } = data;

        setCookies("token", token, { path: "/" });

        navigate("/");
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  return (
    <div className="login-container">
      <div className="login-welcome">
        <h1>&#10100;OdinBook&#10101;</h1>
        <p>Connect with friends and the world around you on the Odinbook.</p>
      </div>

      <div className="login-form">
        {error && <p className="login-error">{error}</p>}

        <h2 className="login-title">Log In to Odinbook</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Logging In..." : "Log In"}
          </button>
        </form>

        <button onClick={handleDemoLogin} className="login-demo-button">
          Login As Demo User
        </button>

        <hr className="login-divider" />
        <Link to="/signup">
          <button className="login-create-button">Create New Account</button>
        </Link>
      </div>
    </div>
  );
};

export default Login;
