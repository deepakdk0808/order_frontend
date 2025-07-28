import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";

  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* App Title */}
        <Typography variant="h6" component="div">
          Order Management
        </Typography>

        {/* Navigation Buttons */}
        <Box>
          {isAdmin ? (
            <>
              <Button
                color="inherit"
                onClick={() => navigate("/inventoryDetails")}
              >
                Inventory
              </Button>
              <Button color="inherit" onClick={() => navigate("/customer")}>
                Customer
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate("/inventory")}>
                Home
              </Button>
              <Button color="inherit" onClick={() => navigate("/orderHistory")}>
                Order History
              </Button>
            </>
          )}

          <Button color="inherit" onClick={() => navigate("/healthz")}>
            Health
          </Button>
          <Button color="inherit" onClick={() => navigate("/profile")}>
            My Profile
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
