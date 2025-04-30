import React, { useEffect, useState } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

const LocationTracking = () => {
  const [viewport, setViewport] = useState({
    latitude: 42.2628,
    longitude: -71.8025,
    zoom: 15
  });

  const [userLocation, setUserLocation] = useState(null);
  const [userInfo, setUserInfo] = useState({ username: "", email: "", photo: "" });

  useEffect(() => {
    const name = localStorage.getItem("userName");
    const email = localStorage.getItem("userEmail");
    const photo = localStorage.getItem("userPhoto");

    setUserInfo({
      username: name || "User",
      email: email || "user@example.com",
      photo: photo || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
    });

    const token = localStorage.getItem("token");

    const updateBackend = async (latitude, longitude) => {
      try {
        await axios.post(
          `${API_BASE_URL}/location/update`,
          { latitude, longitude },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("📡 Sent to backend:", latitude, longitude);
      } catch (error) {
        console.error("❌ Error updating location:", error.message);
      }
    };

    const trackLiveLocation = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ latitude, longitude });
            setViewport((prev) => ({ ...prev, latitude, longitude }));
            updateBackend(latitude, longitude);
          },
          (error) => {
            console.error("❌ Geolocation error:", error.message);
          },
          { enableHighAccuracy: true }
        );
      } else {
        alert("Geolocation not supported by your browser.");
      }
    };

    trackLiveLocation();
  }, []);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <Map
        {...viewport}
        mapboxAccessToken="pk.eyJ1IjoicHJhc2hhbnRoMDEzNSIsImEiOiJjbThna3RiOTQwcHI1MmlwdmdkOWJnOGQ2In0.cZYSpfIUeLmjWEw5GFyrUQ"
        mapStyle="mapbox://styles/mapbox/navigation-night-v1"
        onMove={(evt) => setViewport(evt.viewState)}
      >
        {userLocation && (
          <>
            <Marker latitude={userLocation.latitude} longitude={userLocation.longitude}>
              <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{
                  position: "absolute",
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(0, 153, 255, 0.4)",
                  animation: "pulse 2s infinite"
                }} />

                <img
                  src={userInfo.photo}
                  alt="User"
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    border: "2px solid white",
                    zIndex: 2
                  }}
                />
              </div>
            </Marker>

            <Popup
              latitude={userLocation.latitude}
              longitude={userLocation.longitude}
              closeButton={false}
              closeOnClick={false}
              offset={25}
              anchor="top"
            >
              <div style={{
                padding: "8px",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.9)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                fontSize: "14px"
              }}>
                <strong>{userInfo.username}</strong><br />
                <span>{userInfo.email}</span>
              </div>
            </Popup>
          </>
        )}
      </Map>

      <style>
        {`
          @keyframes pulse {
            0% {
              transform: scale(0.9);
              opacity: 0.7;
            }
            70% {
              transform: scale(1.5);
              opacity: 0;
            }
            100% {
              transform: scale(0.9);
              opacity: 0;
            }
          }
        `}
      </style>
    </div>
  );
};

export default LocationTracking;
