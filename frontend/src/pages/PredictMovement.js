// PredictMovement.js – Final UI Polished Version with Animated Background
import React, { useState } from "react";
import { Container, Typography, Button } from "@mui/material";
import Map, { Marker, Source, Layer } from "react-map-gl";
import axios from "axios";
import "./PredictMovement.css";

const PredictMovement = () => {
  const [prediction, setPrediction] = useState(null);
  const [mapCenter, setMapCenter] = useState({ latitude: 42.2628, longitude: -71.8025, zoom: 14 });

  const fetchPrediction = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5001/offline/predict", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data;
      if (data.message?.includes("mock")) {
        alert("🔄 Mock data added. Click Predict again.");
        return;
      }
      if (!data.predictedLat || !data.predictedLon) return;
      setPrediction(data);
      setMapCenter({ ...mapCenter, latitude: data.predictedLat, longitude: data.predictedLon });
    } catch (error) {
      console.error("Prediction failed", error);
    }
  };

  const lineGeoJSON = prediction ? {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: [
        [prediction.secondLastLon, prediction.secondLastLat],
        [prediction.predictedLon, prediction.predictedLat]
      ]
    }
  } : null;

  return (
    <div className="predict-container">
      <Container maxWidth="md">
        <div className="glass-card text-center">
          <Typography variant="h4" className="fw-bold text-primary mb-3">
            🧠 Predict Next Movement
          </Typography>
          <Button variant="contained" color="primary" onClick={fetchPrediction}>
            🤖 PREDICT
          </Button>
          {prediction && (
            <div className="mt-4">
              <Typography variant="body1" className="fw-medium">
                🟢 Last: {prediction.secondLastLat}, {prediction.secondLastLon}<br />
                🔵 Predicted: {prediction.predictedLat}, {prediction.predictedLon}
              </Typography>
            </div>
          )}
        </div>

        <div className="map-wrapper">
          <Map
            {...mapCenter}
            onMove={(evt) => setMapCenter(evt.viewState)}
            mapboxAccessToken="pk.eyJ1IjoicHJhc2hhbnRoMDEzNSIsImEiOiJjbThna3RiOTQwcHI1MmlwdmdkOWJnOGQ2In0.cZYSpfIUeLmjWEw5GFyrUQ"
            mapStyle="mapbox://styles/mapbox/outdoors-v11"
          >
            {prediction && (
              <>
                <Marker latitude={prediction.secondLastLat} longitude={prediction.secondLastLon}>
                  <div style={{ background: "green", width: "15px", height: "15px", borderRadius: "50%" }} />
                </Marker>
                <Marker latitude={prediction.predictedLat} longitude={prediction.predictedLon}>
                  <div style={{ background: "blue", width: "15px", height: "15px", borderRadius: "50%" }} />
                </Marker>
                <Source id="line" type="geojson" data={lineGeoJSON}>
                  <Layer id="line-layer" type="line" paint={{ "line-color": "#ff6600", "line-width": 4 }} />
                </Source>
              </>
            )}
          </Map>
        </div>
      </Container>
    </div>
  );
};

export default PredictMovement;
