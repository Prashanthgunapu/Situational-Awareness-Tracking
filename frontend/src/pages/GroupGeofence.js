// GroupGeofence.js – Full file with inline background (3.jpg) ✅
import React, { useState, useEffect, useRef } from "react";
import { Container, Typography, TextField, Button, Alert, MenuItem, Select, Stack, List, ListItem, ListItemText } from "@mui/material";
import Map, { Marker, Source, Layer, NavigationControl } from "react-map-gl";
import axios from "axios";

const GroupGeofence = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [radius, setRadius] = useState("");
  const [alerts, setAlerts] = useState([]);
  const [log, setLog] = useState([]);
  const [viewState, setViewState] = useState({ latitude: 42.26, longitude: -71.8, zoom: 13 });
  const audioRef = useRef(null);
  const token = localStorage.getItem("token");

  const fetchLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setLatitude(pos.coords.latitude.toFixed(6));
      setLongitude(pos.coords.longitude.toFixed(6));
      setViewState({ ...viewState, latitude: pos.coords.latitude, longitude: pos.coords.longitude });
    });
  };

  useEffect(() => {
    axios.get("http://localhost:5001/groups/my-groups", {
      headers: { Authorization: `Bearer ${token}` }
    }).then((res) => setGroups(res.data));
    fetchLocation();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      const interval = setInterval(() => checkGeofence(), 10000);
      return () => clearInterval(interval);
    }
  }, [selectedGroup]);

  const handleSetGeofence = async () => {
    try {
      await axios.post("http://localhost:5001/geofence/group/set", {
        groupId: selectedGroup, latitude, longitude, radius
      }, { headers: { Authorization: `Bearer ${token}` } });
      alert("✅ Shared geofence set!");
    } catch {
      alert("❌ Failed to set geofence");
    }
  };

  const checkGeofence = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/geofence/group/check/${selectedGroup}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAlerts(res.data.alerts);
      const timestamp = new Date().toLocaleTimeString();
      res.data.alerts.forEach(a => {
        setLog(prev => [...prev, { user: a.user, time: timestamp, distance: a.distance }]);
        audioRef.current?.play();
      });
    } catch {
      alert("❌ Failed to check geofence");
    }
  };

  const createCircleGeoJSON = (lat, lon, radiusMeters) => {
    const points = 64;
    const coords = [];
    for (let i = 0; i < points; i++) {
      const angle = (i * 360) / points;
      const offsetLat = radiusMeters / 111320 * Math.cos(angle * Math.PI / 180);
      const offsetLng = radiusMeters / (111320 * Math.cos(lat * Math.PI / 180)) * Math.sin(angle * Math.PI / 180);
      coords.push([lon + offsetLng, lat + offsetLat]);
    }
    coords.push(coords[0]);
    return { type: "Feature", geometry: { type: "Polygon", coordinates: [coords] } };
  };

  const circle = latitude && longitude && radius
    ? createCircleGeoJSON(parseFloat(latitude), parseFloat(longitude), parseFloat(radius))
    : null;

  return (
    <div
      style={{
        background: "url('/Images/3.jpg') no-repeat center center fixed",
        backgroundSize: "cover",
        minHeight: "100vh",
        padding: "3rem 0"
      }}
    >
      <Container maxWidth="md">
        <Typography variant="h4" align="center" className="fw-bold text-info mb-4">
          🌐 Shared Group Geofence
        </Typography>
        <div className="shadow p-4 rounded bg-white">
          <Select fullWidth value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)} displayEmpty>
            <MenuItem value="" disabled>Select Group</MenuItem>
            {groups.map((g) => <MenuItem key={g._id} value={g._id}>{g.name}</MenuItem>)}
          </Select>

          <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 2 }}>
            <TextField label="Latitude" fullWidth value={latitude} onChange={(e) => setLatitude(e.target.value)} />
            <TextField label="Longitude" fullWidth value={longitude} onChange={(e) => setLongitude(e.target.value)} />
            <Button variant="outlined" onClick={fetchLocation}>📍</Button>
          </Stack>

          <TextField label="Radius (meters)" fullWidth margin="normal" value={radius} onChange={(e) => setRadius(e.target.value)} />

          <Button variant="contained" color="primary" fullWidth onClick={handleSetGeofence}>SET SHARED GEOFENCE</Button>
          <Button variant="outlined" fullWidth onClick={checkGeofence} sx={{ mt: 2 }}>CHECK MEMBERS OUTSIDE</Button>

          {alerts.map((a, idx) => (
            <Alert key={idx} severity="error" sx={{ mt: 1 }}>{a.user} is OUTSIDE by {Math.round(a.distance)} meters</Alert>
          ))}
        </div>

        <div style={{ height: 400, marginTop: "2rem" }}>
          <Map
            viewState={viewState}
            onMove={evt => setViewState(evt.viewState)}
            mapboxAccessToken="pk.eyJ1IjoicHJhc2hhbnRoMDEzNSIsImEiOiJjbThna3RiOTQwcHI1MmlwdmdkOWJnOGQ2In0.cZYSpfIUeLmjWEw5GFyrUQ"
            mapStyle="mapbox://styles/mapbox/light-v10"
          >
            <NavigationControl position="top-left" />
            {latitude && longitude && (
              <Marker latitude={parseFloat(latitude)} longitude={parseFloat(longitude)}>
                <img
                  src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  alt="group center"
                  style={{ width: 36, borderRadius: "50%", border: "2px solid white" }}
                />
              </Marker>
            )}
            {circle && (
              <Source id="shared-fence" type="geojson" data={circle}>
                <Layer id="shared-fence-layer" type="fill" paint={{ "fill-color": "#2196f3", "fill-opacity": 0.2 }} />
              </Source>
            )}
          </Map>
        </div>

        {log.length > 0 && (
          <div className="bg-white shadow mt-4 p-3 rounded">
            <Typography variant="h6" className="mb-2">📜 Group Member Breach Log</Typography>
            <List>
              {log.slice().reverse().map((entry, idx) => (
                <ListItem key={idx}>
                  <ListItemText primary={`${entry.user} is outside`} secondary={`${entry.time} – ${Math.round(entry.distance)} meters`} />
                </ListItem>
              ))}
            </List>
          </div>
        )}

        <audio ref={audioRef} preload="auto">
          <source src="https://assets.mixkit.co/sfx/download/mixkit-system-beep-buzzer-fail-2964.mp3" type="audio/mpeg" />
          Your browser does not support audio playback.
        </audio>
      </Container>
    </div>
  );
};

export default GroupGeofence;
