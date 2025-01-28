import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { loginUser } from "../api/login";
import LoginForm from "../components/LoginForm";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setUserToken, setUserRole } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const data = await loginUser(email, password); // Call the login API
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("userRole", data.role_id.toString()); // Store role_id
      setUserToken(data.accessToken);
      setUserRole(data.role_id); // Update context with role_id
      navigate("/home");
    } catch (err: any) {
      setError(err.message); // Handle error
    }
  };

  return (
    <div className="container mt-5">
      <h2>Login</h2>
      <LoginForm
        email={email}
        password={password}
        error={error}
        setEmail={setEmail}
        setPassword={setPassword}
        onSubmit={handleLogin}
      />
    </div>
  );
};

export default Login;
