// Upgrading: Register.js with gradient visuals and smooth onboarding style
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, formData);
      navigate("/login");
    } catch (err) {
      setError("Registration failed.");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ background: "linear-gradient(to right, #fdfbfb, #ebedee)" }}
    >
      <form
        className="card p-5 shadow-lg animate__animated animate__fadeInUp"
        onSubmit={handleRegister}
        style={{
          maxWidth: "420px",
          width: "100%",
          borderRadius: "20px",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)"
        }}
      >
        <div className="text-center mb-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="register-avatar"
            width="60"
            className="mb-2"
          />
          <h3 className="text-success fw-bold">📝 Register</h3>
        </div>
        <input
          type="text"
          name="username"
          className="form-control mb-3"
          placeholder="Username"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          className="form-control mb-3"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          className="form-control mb-3"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        {error && <div className="alert alert-danger animate__animated animate__shakeX">{error}</div>}
        <button className="btn btn-success w-100 py-2 fw-semibold rounded-pill shadow-sm" type="submit">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
