// Dashboard.js – with inline animated background 🌄
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Landing.css";
import { Modal, Button, Form, Toast, ToastContainer, Alert } from "react-bootstrap";
import Confetti from "react-confetti";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ username: "", email: "", photo: "" });
  const [showProfile, setShowProfile] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [latestAlert, setLatestAlert] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("userName");
    const email = localStorage.getItem("userEmail");
    const photo = localStorage.getItem("userPhoto");

    if (token) {
      setUser({ username: name || "", email: email || "", photo: photo || "" });
      fetchUserAlerts(token);
    }
  }, []);

  const fetchUserAlerts = async (token) => {
    try {
      const groupRes = await axios.get("http://localhost:5001/groups/my-groups", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const groups = groupRes.data;

      for (let group of groups) {
        const res = await axios.get(`http://localhost:5001/alerts/${group._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.latestAlert) {
          setLatestAlert({
            message: res.data.latestAlert.message,
            time: res.data.latestAlert.timestamp,
            groupName: group.name
          });
          break;
        }
      }
    } catch (err) {
      console.error("Failed to fetch alerts", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userPhoto");
    navigate("/");
  };

  const handleSaveProfile = () => {
    localStorage.setItem("userName", user.username);
    localStorage.setItem("userEmail", user.email);
    localStorage.setItem("userPhoto", user.photo);
    setShowProfile(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser((prev) => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const buttons = [
    { label: "📡 Location Tracking", path: "/location-tracking" },
    { label: "👥 Group Tracking", path: "/group-tracking" },
    { label: "🛡️ Geofencing", path: "/geofence" },
    { label: "🌐 Group Geofence", path: "/group-geofence" },
    { label: "🚨 Emergency Alert", path: "/send-alert" },
    { label: "🧠 Predict Movement", path: "/predict-movement" }
  ];

  return (
    <div
      style={{
        background: "url('/Images/4.jpg') no-repeat center center fixed",
        backgroundSize: "cover",
        minHeight: "100vh",
        paddingBottom: "3rem"
      }}
    >
      <nav className="navbar navbar-expand-lg navbar-dark bg-transparent px-4">
        <span className="navbar-brand fw-bold">🌍 Situational AI</span>
        <div className="d-flex ms-auto align-items-center">
          <img
            src={user.photo || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
            alt="user-avatar"
            width="48"
            height="48"
            className="rounded-circle"
            style={{ cursor: "pointer" }}
            onClick={() => setShowProfile(true)}
          />
          <Button onClick={logout} variant="outline-light" className="ms-3">🚪 Logout</Button>
        </div>
      </nav>

      {latestAlert && (
        <Alert variant="danger" className="text-center rounded-0 fw-bold">
          ⚠️ {latestAlert.message} (Group: {latestAlert.groupName})<br />
          🕒 {new Date(latestAlert.time).toLocaleString()}
        </Alert>
      )}

      <Modal show={showProfile} onHide={() => setShowProfile(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>👤 Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-3">
            <img
              src={user.photo || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
              alt="profile-preview"
              width="100"
              height="100"
              className="rounded-circle mb-2"
            />
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Change Profile Picture</Form.Label>
              <Form.Control type="file" onChange={handlePhotoUpload} />
            </Form.Group>
          </div>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" value={user.username} onChange={(e) => setUser((prev) => ({ ...prev, username: e.target.value }))} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" value={user.email} onChange={(e) => setUser((prev) => ({ ...prev, email: e.target.value }))} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowProfile(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveProfile}>Save Changes</Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="top-end" className="p-3">
        <Toast bg="success" show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide>
          <Toast.Body className="text-white">✅ Profile updated successfully!</Toast.Body>
        </Toast>
      </ToastContainer>

      {showToast && <Confetti width={window.innerWidth} height={window.innerHeight} numberOfPieces={400} recycle={false} />}

      <div className="container text-center mt-5 animate-fade-in">
        <h1 className="display-4 fw-bold text-warning mb-2">📍 Dashboard</h1>
        <p className="text-light mb-4">Welcome to your AI-powered tracking system</p>
        <div className="row justify-content-center animate-slide-up">
          <div className="col-md-6 d-flex flex-column gap-3">
            {buttons.map((btn, index) => (
              <button
                key={index}
                className="dashboard-button py-3 text-light"
                style={{ backgroundColor: "#1e1e2f", borderRadius: "15px", fontWeight: 600 }}
                onClick={() => navigate(btn.path)}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
