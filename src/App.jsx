import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { auth } from "./firebase/firebase";

import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Wardrobe from "./pages/Wardrobe";
import Outfits from "./pages/Outfits";
import Profile from "./pages/Profile";
import Favorites from "./pages/Favorites";
import ProtectedRoute from "./components/ProtectedRoute";

import "./App.css";

// Add Firebase ID token to every Axios request
axios.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;

    if (user) {
      try {
        const token = await user.getIdToken();

        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error("Failed to get Firebase token:", error);
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Auth />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth initialRegister={true} />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/wardrobe" element={<Wardrobe />} />
          <Route path="/outfits" element={<Outfits />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;