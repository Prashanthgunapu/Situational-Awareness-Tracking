import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import GroupGeofence from "./pages/GroupGeofence";
import SendAlert from "./pages/SendAlert";
import PredictMovement from "./pages/PredictMovement";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Geofence from "./pages/Geofence";
import GroupTracking from "./pages/GroupTracking";
import LocationTracking from "./pages/LocationTracking";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/group-geofence" element={<GroupGeofence />} />
        <Route path="/send-alert" element={<SendAlert />} />
        <Route path="/predict-movement" element={<PredictMovement />} />
        <Route path="/location-tracking" element={<LocationTracking />} />
        <Route path="/geofence" element={<Geofence />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/group-tracking" element={<GroupTracking />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
