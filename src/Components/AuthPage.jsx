import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Box,
  Tabs,
  Tab,
  Paper,
  Typography,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

const AuthPage = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0); // 0 = Signup, 1 = Login
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer", // Default role
  });

  const handleTabChange = (_, newValue) => {
    setTab(newValue);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "customer",
    });
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      const url =
        tab === 0
          ? "https://order-backend-3bgm.onrender.com/api/auth/signup"
          : "https://order-backend-3bgm.onrender.com/api/auth/login";

      const payload =
        tab === 0
          ? formData
          : { email: formData.email, password: formData.password };

      const res = await axios.post(url, payload);
      alert(res.data.message || "Success");

      if (tab === 0) {
        // Switch to login after successful signup
        setTab(1);
      }

      if (tab === 1 && res.data.token) {
        // Store token
        localStorage.setItem("token", res.data.token);

        // Decode token to check role
        const decoded = jwtDecode(res.data.token);

        // Store user info (like role) for later use (e.g. navbar)
        localStorage.setItem("user", JSON.stringify({ role: decoded.role }));

        if (decoded.role === "admin") {
          navigate("/customer");
        } else {
          navigate("/inventory");
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 8, p: 4 }}>
        <Typography variant="h5" align="center" gutterBottom>
          {tab === 0 ? "Create Account" : "Login"}
        </Typography>
        <Tabs value={tab} onChange={handleTabChange} centered>
          <Tab label="Signup" />
          <Tab label="Login" />
        </Tabs>
        <Box sx={{ mt: 3 }}>
          {tab === 0 && (
            <>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Role"
                name="role"
                select
                value={formData.role}
                onChange={handleChange}
                margin="normal"
              >
                <MenuItem value="customer">Customer</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </TextField>
            </>
          )}
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            type="email"
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            type="password"
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit}
            sx={{ mt: 2 }}
          >
            {tab === 0 ? "Signup" : "Login"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AuthPage;
