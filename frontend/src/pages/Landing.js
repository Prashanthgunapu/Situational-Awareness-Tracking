import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Landing.css"; // Custom CSS with animation

const Landing = () => {
  return (
    <div className="bg-dark text-light landing-page">
      {/* Video Banner */}
      <div className="video-banner-container">
        <video autoPlay muted loop className="video-banner">
          <source src="https://www.w3schools.com/howto/rain.mp4" type="video/mp4" />
          Your browser does not support HTML5 video.
        </video>
        <div className="overlay d-flex flex-column justify-content-center align-items-center text-center">
          <h1 className="display-4 fw-bold text-warning animate-fade-in">
            🛰️ Situational Awareness AI
          </h1>
          <p className="lead text-white animate-fade-in-delay">
            Empowering safety and coordination through smart tracking & alerts.
          </p>
          <div className="mt-3 d-flex gap-3 flex-wrap justify-content-center">
            <Link to="/login" className="btn btn-warning btn-lg animate-slide-up">Login</Link>
            <Link to="/register" className="btn btn-outline-light btn-lg animate-slide-up">Register</Link>
            <Link to="/group-tracking" className="btn btn-primary btn-lg animate-slide-up">Create Group</Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container py-5">
        <div className="row text-center">
          <div className="col-md-4 animate-slide-up">
            <img src="https://cdn-icons-png.flaticon.com/512/854/854878.png" alt="Tracking" className="img-fluid mb-3" width="80" />
            <h5 className="fw-bold">Real-Time Location</h5>
            <p>Track team members on the map with accuracy and efficiency.</p>
          </div>
          <div className="col-md-4 animate-slide-up">
            <img src="https://cdn-icons-png.flaticon.com/512/189/189001.png" alt="Geofencing" className="img-fluid mb-3" width="80" />
            <h5 className="fw-bold">Smart Geofencing</h5>
            <p>Trigger alerts when users exit or enter defined zones.</p>
          </div>
          <div className="col-md-4 animate-slide-up">
            <img src="https://cdn-icons-png.flaticon.com/512/3011/3011270.png" alt="Groups" className="img-fluid mb-3" width="80" />
            <h5 className="fw-bold">Group Tracking</h5>
            <p>Monitor multiple users as teams with defined objectives.</p>
          </div>
        </div>
      </div>

      <footer className="text-center text-secondary py-3 small animate-fade-in-delay">
        &copy; {new Date().getFullYear()} Team 18 – AI Situational Awareness Capstone
      </footer>
    </div>
  );
};

export default Landing;
