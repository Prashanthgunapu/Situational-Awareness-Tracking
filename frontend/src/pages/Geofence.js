import React, { useEffect, useState, useRef } from "react";
import Map, { Marker, Source, Layer, NavigationControl } from "react-map-gl";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import "./Geofence.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

const Geofence = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [radius, setRadius] = useState(100);
  const [alertMessage, setAlertMessage] = useState(null);
  const [log, setLog] = useState([]);
  const [viewState, setViewState] = useState({
    latitude: 42.2628,
    longitude: -71.8025,
    zoom: 14,
  });
  const audioRef = useRef(null);
  const token = localStorage.getItem("token");

  const checkGeofence = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/geofence/check`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const newMessage = res.data.message;
      setAlertMessage(newMessage);

      const timestamp = new Date().toLocaleString();
      const lastLog = log[log.length - 1]?.message;

      if (newMessage !== lastLog) {
        setLog((prev) => [...prev, { message: newMessage, time: timestamp }]);
        if (newMessage.includes("outside")) audioRef.current?.play();
      }
    } catch {
      setAlertMessage("🚨 Error checking geofence");
    }
  };

  const setGeofence = async () => {
    if (!userLocation) return;
    try {
      await axios.post(
        `${API_BASE_URL}/geofence/set`,
        {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          radius: parseInt(radius),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Geofence set!");
      checkGeofence();
    } catch {
      alert("❌ Failed to set geofence");
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      setUserLocation({ latitude, longitude });
      setViewState((prev) => ({ ...prev, latitude, longitude }));
    });

    const interval = setInterval(checkGeofence, 10000);
    return () => clearInterval(interval);
  }, []);

  const createCircleGeoJSON = (lat, lon, radiusInMeters) => {
    const points = 64;
    const coords = [];
    for (let i = 0; i < points; i++) {
      const angle = (i * 360) / points;
      const offsetLat =
        (radiusInMeters / 111320) * Math.cos((angle * Math.PI) / 180);
      const offsetLng =
        (radiusInMeters /
          (111320 * Math.cos((lat * Math.PI) / 180))) *
        Math.sin((angle * Math.PI) / 180);
      coords.push([lon + offsetLng, lat + offsetLat]);
    }
    coords.push(coords[0]);
    return {
      type: "Feature",
      geometry: { type: "Polygon", coordinates: [coords] },
    };
  };

  const circle = userLocation
    ? createCircleGeoJSON(
        userLocation.latitude,
        userLocation.longitude,
        radius
      )
    : null;

  return (
    <div
      style={{
        background: "url('/Images/1.jpg') no-repeat center center fixed",
        backgroundSize: "cover",
        minHeight: "100vh",
        padding: "3rem 0",
        animation: "zoomIn 1.5s ease-in-out",
      }}
    >
      <Container maxWidth="md" className="geofence-panel">
        <Typography
          variant="h4"
          align="center"
          className="fw-bold text-primary mb-4"
        >
          🛡️ Smart Geofencing with Alerts
        </Typography>
        <div className="shadow p-4 rounded bg-white">
          <TextField
            label="Radius (meters)"
            type="number"
            fullWidth
            variant="outlined"
            className="mb-3"
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={setGeofence}
          >
            Set Geofence at My Location
          </Button>
          {alertMessage && (
            <Alert
              severity={alertMessage.includes("outside") ? "error" : "success"}
              sx={{ mt: 2 }}
            >
              {alertMessage}
            </Alert>
          )}
        </div>

        <div style={{ width: "100%", height: "500px", marginTop: "2rem" }}>
          <Map
            {...viewState}
            onMove={(evt) => setViewState(evt.viewState)}
            mapboxAccessToken="pk.eyJ1IjoicHJhc2hhbnRoMDEzNSIsImEiOiJjbThna3RiOTQwcHI1MmlwdmdkOWJnOGQ2In0.cZYSpfIUeLmjWEw5GFyrUQ"
            mapStyle="mapbox://styles/mapbox/outdoors-v11"
          >
            <NavigationControl position="top-left" />
            {userLocation && (
              <>
                <Marker
                  latitude={userLocation.latitude}
                  longitude={userLocation.longitude}
                >
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    alt="User"
                    style={{
                      width: "35px",
                      borderRadius: "50%",
                      border: "2px solid white",
                    }}
                  />
                </Marker>
                {circle && (
                  <Source id="geofence" type="geojson" data={circle}>
                    <Layer
                      id="geofence-layer"
                      type="fill"
                      paint={{
                        "fill-color": "#f03b20",
                        "fill-opacity": 0.3,
                      }}
                    />
                  </Source>
                )}
              </>
            )}
          </Map>
        </div>

        {log.length > 0 && (
          <div className="bg-white shadow mt-4 p-3 rounded">
            <Typography variant="h6" className="mb-2">
              📜 Entry/Exit History
            </Typography>
            <List>
              {log
                .slice()
                .reverse()
                .map((item, idx) => (
                  <ListItem key={idx}>
                    <ListItemText
                      primary={item.message}
                      secondary={item.time}
                    />
                  </ListItem>
                ))}
            </List>
          </div>
        )}
        <audio
          ref={audioRef}
          src="https://www.soundjay.com/buttons/beep-07.mp3"
          preload="auto"
        />
      </Container>
    </div>
  );
};

export default Geofence;
