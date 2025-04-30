import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        { email, password }
      );
      localStorage.setItem("token", res.data.token);
      
      // NEW: Save additional user info
      localStorage.setItem("userName", res.data.username);
      localStorage.setItem("userEmail", res.data.email);

      navigate("/dashboard");
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(to right, #e0eafc, #cfdef3)",
        animation: "fadeIn 1s ease-in-out"
      }}
    >
      <form
        className="card p-5 shadow-lg animate__animated animate__fadeInUp"
        onSubmit={handleLogin}
        style={{
          maxWidth: "400px",
          width: "100%",
          borderRadius: "20px",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)"
        }}
      >
        <div className="text-center mb-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2919/2919600.png"
            alt="login-avatar"
            width="60"
            className="mb-2"
          />
          <h3 className="text-primary fw-bold">🔐 Login</h3>
        </div>
        <input
          type="email"
          className="form-control mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <div className="alert alert-danger animate__animated animate__shakeX">{error}</div>}
        <button className="btn btn-primary w-100 py-2 fw-semibold rounded-pill shadow-sm" type="submit">
          Login
        </button>
        <div className="mt-3 text-center">
          <span
            onClick={() => navigate("/forgot-password")}
            style={{ cursor: "pointer", color: "#007bff" }}
          >
            Forgot Password?
          </span>
        </div>
      </form>
    </div>
  );
};

export default Login;
