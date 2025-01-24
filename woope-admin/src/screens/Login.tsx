import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

// Context for managing authentication (you can implement this later)
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState(""); // State for email
  const [password, setPassword] = useState(""); // State for password
  const [error, setError] = useState(""); // State for errors
  const { setUserToken } = useContext(AuthContext); // Context to set user token
  const navigate = useNavigate(); // Navigation hook

  // Handle login submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear errors

    try {
      // API call to login
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData || "Invalid credentials");
      }

      const data = await response.json(); // Extract tokens
      localStorage.setItem("accessToken", data.accessToken); // Store access token
      localStorage.setItem("refreshToken", data.refreshToken); // Store refresh token
      setUserToken(data.accessToken); // Update auth context
      navigate("/home"); // Redirect to home page
    } catch (err: any) {
      setError(err.message); // Display error
    }
  };

  return (
    <div className="container mt-5">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        {/* Email Input */}
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            id="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password Input */}
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            id="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Error Message */}
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Login Button */}
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    </div>
  );
};

export default Login;
