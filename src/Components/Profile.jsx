import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5001/api/customers/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setAlert({ type: "error", message: "Failed to load profile." });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:5001/api/customers/me", profile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAlert({ type: "success", message: "Profile updated successfully." });
    } catch (err) {
      console.error("Update failed:", err);
      setAlert({ type: "error", message: "Failed to update profile." });
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete("http://localhost:5001/api/customers/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.clear();
      setAlert({ type: "success", message: "Account deleted." });
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      console.error("Delete failed:", err);
      setAlert({ type: "error", message: "Failed to delete account." });
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 6, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>

      {alert.message && (
        <Alert severity={alert.type} sx={{ mb: 2 }}>
          {alert.message}
        </Alert>
      )}

      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 500 }}
      >
        <TextField
          label="Name"
          name="name"
          value={profile.name}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Email"
          name="email"
          value={profile.email}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Phone"
          name="phone"
          value={profile.phone}
          onChange={handleChange}
          type="number"
          inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          fullWidth
        />
        <TextField
          label="Address"
          name="address"
          value={profile.address}
          onChange={handleChange}
          fullWidth
          multiline
          minRows={2}
        />

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="contained" color="primary" onClick={handleUpdate}>
            Update
          </Button>
          <Button variant="outlined" color="error" onClick={handleDelete}>
            Delete Account
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Profile;
