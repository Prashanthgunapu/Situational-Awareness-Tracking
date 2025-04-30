// GroupTracking.js – Full version with inline background (2.jpg)
import React, { useEffect, useState } from "react";
import { Container, Typography, Button, TextField, List, ListItem, ListItemText, Switch, FormControlLabel, Box, InputAdornment, Alert } from "@mui/material";
import Map, { Marker, Popup, NavigationControl, Source, Layer } from "react-map-gl";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

const GroupTracking = () => {
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [newUserId, setNewUserId] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [groupLocations, setGroupLocations] = useState([]);
  const [mapCenter, setMapCenter] = useState({ latitude: 42.2628, longitude: -71.8025, zoom: 13 });
  const [darkMode, setDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [latestAlert, setLatestAlert] = useState(null);

  useEffect(() => { fetchGroups(); }, []);
  useEffect(() => {
    if (selectedGroupId) {
      fetchGroupLocations();
      fetchLatestAlert();
      const interval = setInterval(fetchGroupLocations, 10000);
      return () => clearInterval(interval);
    }
  }, [selectedGroupId]);

  const fetchGroups = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${API_BASE_URL}/groups/my-groups`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setGroups(res.data);
  };

  const fetchLatestAlert = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${API_BASE_URL}/alerts/${selectedGroupId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.data.latestAlert) setLatestAlert(res.data.latestAlert);
  };

  const createGroup = async () => {
    const token = localStorage.getItem("token");
    await axios.post(`${API_BASE_URL}/groups/create`, { name: groupName }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setGroupName("");
    fetchGroups();
  };

  const addUserToGroup = async () => {
    const token = localStorage.getItem("token");
    await axios.post(`${API_BASE_URL}/groups/add`, {
      groupId: selectedGroupId, userId: newUserId
    }, { headers: { Authorization: `Bearer ${token}` } });
    setNewUserId("");
    fetchGroups();
  };

  const fetchGroupLocations = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${API_BASE_URL}/groups/${selectedGroupId}/locations`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setGroupLocations(res.data);
    if (res.data.length > 0) {
      setMapCenter((prev) => ({ ...prev, latitude: res.data[0].latitude, longitude: res.data[0].longitude }));
    }
  };

  const groupLineGeoJSON = groupLocations.length > 1 ? {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: groupLocations.map((loc) => [loc.longitude, loc.latitude])
    }
  } : null;

  const filteredMembers = groupLocations.filter((m) =>
    m.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      style={{
        background: "url('/Images/2.jpg') no-repeat center center fixed",
        backgroundSize: "cover",
        minHeight: "100vh",
        padding: "2rem 0"
      }}
    >
      <Container maxWidth="xl">
        <Typography variant="h4" align="center" className="fw-bold text-primary mb-4">👥 Group Tracking</Typography>

        {latestAlert && (
          <Alert severity="error" sx={{ mb: 3 }}>
            ⚠️ {latestAlert.message} – 🕒 {new Date(latestAlert.timestamp).toLocaleString()}
          </Alert>
        )}

        <FormControlLabel control={<Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />} label="Night Mode" className="mb-3" />

        <TextField label="Group Name" fullWidth margin="normal" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
        <Button variant="contained" color="primary" fullWidth onClick={createGroup}>➕ Create Group</Button>

        <Typography variant="h6" className="mt-3">Your Groups:</Typography>
        <List>
          {groups.map((group) => (
            <ListItem key={group._id} button onClick={() => setSelectedGroupId(group._id)} sx={{ borderRadius: "12px", mb: 1, background: "#f0f0f0" }}>
              <ListItemText primary={group.name} secondary={`Members: ${group.users.length}`} />
            </ListItem>
          ))}
        </List>

        {selectedGroupId && (
          <>
            <TextField label="User ID to Add" fullWidth margin="normal" value={newUserId} onChange={(e) => setNewUserId(e.target.value)} />
            <Button variant="contained" color="secondary" fullWidth onClick={addUserToGroup}>➕ Add User to Selected Group</Button>

            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
              <Box sx={{ width: "300px", height: "500px", overflowY: "auto", background: "#f9f9f9", borderRadius: "12px", p: 2 }}>
                <TextField
                  placeholder="Search members"
                  fullWidth
                  size="small"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    )
                  }}
                />
                <List>
                  {filteredMembers.map((m) => (
                    <ListItem key={m.userId}>
                      <img src={m.photo || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt={m.username} style={{ width: 30, height: 30, borderRadius: "50%", marginRight: 8 }} />
                      <ListItemText primary={m.username} secondary={m.email} />
                    </ListItem>
                  ))}
                </List>
              </Box>

              <Box sx={{ flex: 1, height: "500px", borderRadius: "12px", overflow: "hidden" }}>
                <Map
                  viewState={mapCenter}
                  onMove={(evt) => setMapCenter(evt.viewState)}
                  mapboxAccessToken="pk.eyJ1IjoicHJhc2hhbnRoMDEzNSIsImEiOiJjbThna3RiOTQwcHI1MmlwdmdkOWJnOGQ2In0.cZYSpfIUeLmjWEw5GFyrUQ"
                  mapStyle={darkMode ? "mapbox://styles/mapbox/navigation-night-v1" : "mapbox://styles/mapbox/streets-v11"}
                >
                  <NavigationControl position="top-left" />
                  {filteredMembers.map((loc) => (
                    <React.Fragment key={loc.userId}>
                      <Marker latitude={loc.latitude} longitude={loc.longitude}>
                        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <div style={{ position: "absolute", width: "45px", height: "45px", borderRadius: "50%", backgroundColor: "rgba(0,153,255,0.4)", animation: "pulse 2s infinite" }} />
                          <img src={loc.photo || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt={loc.username} style={{ width: "36px", height: "36px", borderRadius: "50%", border: "2px solid white", zIndex: 2 }} />
                        </div>
                      </Marker>
                      <Popup latitude={loc.latitude} longitude={loc.longitude} closeButton={false} closeOnClick={false} anchor="top" offset={30}>
                        <div style={{ background: "white", borderRadius: "8px", padding: "6px 10px", boxShadow: "0 2px 6px rgba(0,0,0,0.15)", fontSize: "14px", textAlign: "center" }}>
                          <strong>{loc.username || "Member"}</strong><br />
                          {loc.email || "No email"}
                        </div>
                      </Popup>
                    </React.Fragment>
                  ))}
                  {groupLineGeoJSON && (
                    <Source id="group-path" type="geojson" data={groupLineGeoJSON}>
                      <Layer id="line-path" type="line" paint={{ "line-color": "#ff6600", "line-width": 4 }} />
                    </Source>
                  )}
                </Map>
              </Box>
            </Box>
          </>
        )}
        <style>{`
          @keyframes pulse {
            0% { transform: scale(0.9); opacity: 0.7; }
            70% { transform: scale(1.5); opacity: 0; }
            100% { transform: scale(0.9); opacity: 0; }
          }
        `}</style>
      </Container>
    </div>
  );
};

export default GroupTracking;
