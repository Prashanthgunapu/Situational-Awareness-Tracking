// Upgrading: ResetPassword.js with smooth pastel UI
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:5001/auth/reset-password/${token}`, { newPassword });
      setMessage(res.data.message);
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      setMessage("Error resetting password.");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ background: "linear-gradient(to right, #f3f2f2, #e9e4f0)" }}
    >
      <form
        onSubmit={handleSubmit}
        className="card p-5 shadow-lg animate__animated animate__fadeInUp"
        style={{ maxWidth: "420px", width: "100%", borderRadius: "20px", background: "rgba(255, 255, 255, 0.95)", backdropFilter: "blur(10px)" }}
      >
        <div className="text-center mb-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2721/2721294.png"
            alt="reset-password-avatar"
            width="60"
            className="mb-2"
          />
          <h3 className="text-danger fw-bold">🔑 Reset Password</h3>
        </div>

        <input
          type="password"
          placeholder="Enter new password"
          className="form-control mb-3"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-danger w-100 fw-semibold rounded-pill shadow-sm">
          Reset Password
        </button>

        {message && <p className="mt-3 text-center text-dark animate__animated animate__fadeInUp">{message}</p>}
      </form>
    </div>
  );
};

export default ResetPassword;
