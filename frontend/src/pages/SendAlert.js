// SendAlert.js cinematic edition 🌄
import React, { useEffect, useState, useRef } from "react";
import {
  Container, Typography, TextField, Button, MenuItem, Select, FormControlLabel, Switch
} from "@mui/material";
import axios from "axios";

const SendAlert = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [message, setMessage] = useState("");
  const [alertMsg, setAlertMsg] = useState("");
  const [soundOn, setSoundOn] = useState(true);
  const audioRef = useRef(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("http://localhost:5001/groups/my-groups", {
      headers: { Authorization: `Bearer ${token}` }
    }).then((res) => setGroups(res.data));
  }, []);

  const sendAlert = async () => {
    try {
      const res = await axios.post("http://localhost:5001/alerts/send", {
        groupId: selectedGroup, message
      }, { headers: { Authorization: `Bearer ${token}` } });
      setAlertMsg(res.data.alertMessage);
      setMessage("");
    } catch {
      setAlertMsg("❌ Failed to send alert");
    }
  };

  return (
    <div style={{ position: "relative", zIndex: 0 }}>
      <video
        autoPlay muted loop playsInline
        style={{
          position: "fixed", width: "100%", height: "100%",
          objectFit: "cover", top: 0, left: 0, zIndex: -1, opacity: 0.8
        }}
      >
        <source src="https://cdn.coverr.co/videos/coverr-mystic-forest-7239/1080p.mp4" type="video/mp4" />
      </video>

      {soundOn && (
        <audio ref={audioRef} autoPlay loop>
          <source src="https://cdn.pixabay.com/audio/2022/08/08/audio_0fc50d7df0.mp3" type="audio/mpeg" />
        </audio>
      )}

      <div style={{ backdropFilter: "blur(2px)", minHeight: "100vh", padding: "4rem 0" }}>
        <Container maxWidth="sm">
          <div className="d-flex justify-content-end mb-2">
            <FormControlLabel
              control={<Switch checked={soundOn} onChange={() => setSoundOn(!soundOn)} />}
              label="Ambient Sound"
            />
          </div>

          <div className="shadow-lg p-5 rounded" style={{ background: "rgba(255,255,255,0.9)" }}>
            <Typography variant="h4" align="center" className="fw-bold text-danger mb-4">
              📢 Emergency Alert
            </Typography>

            <Select fullWidth value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)} displayEmpty>
              <MenuItem value="" disabled>Select Group</MenuItem>
              {groups.map((g) => <MenuItem key={g._id} value={g._id}>{g.name}</MenuItem>)}
            </Select>

            <TextField
              label="Alert Message"
              fullWidth
              margin="normal"
              multiline
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <Button variant="contained" color="error" fullWidth onClick={sendAlert}>
              🚨 Send Emergency Alert
            </Button>

            {alertMsg && (
              <p className="mt-3 text-center text-dark animate__animated animate__fadeInUp">{alertMsg}</p>
            )}
          </div>
        </Container>
      </div>
    </div>
  );
};

export default SendAlert;
