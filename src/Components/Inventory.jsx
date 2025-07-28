import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  CardActions,
  CardMedia,
  Chip,
  Box,
  IconButton,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
    import {axiosInstance} from "../Utils/axiosUrl"; // Import the axios instance

const InventoryPage = () => {

  const [inventory, setInventory] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await axiosInstance.get(
          "/inventory"
        );
        setInventory(res.data);
        const initialQuantities = {};
        res.data.forEach((item) => {
          initialQuantities[item._id] = 0;
        });
        setQuantities(initialQuantities);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch inventory:", err);
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const updateQuantity = (id, diff) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + diff),
    }));
  };

  const handlePlaceOrder = async () => {
    if (!token) {
      alert("Login required to place an order");
      return;
    }

    const items = Object.entries(quantities)
      .filter(([_, qty]) => qty > 0)
      .map(([id, qty]) => ({
        inventoryItem: id,
        quantity: qty,
      }));

    if (items.length === 0) {
      alert("No items selected for the order.");
      return;
    }

    try {
      const payload = {
        items,
        paymentCollected: "Paid",
      };

      await axiosInstance.post("/orders", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Order placed successfully");
      navigate("/order"); // Redirect to order page after placing order
      // Reset quantities
      setQuantities((prev) =>
        Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: 0 }), {})
      );
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to place order");
    }
  };

  if (loading) return <Typography>Loading inventory...</Typography>;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Inventory
      </Typography>
      <Grid container spacing={3}>
        {inventory.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item._id}>
            <Card
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              {item.imageUrl && (
                <CardMedia
                  component="img"
                  height="200"
                  image={item.imageUrl}
                  alt={item.name}
                  sx={{ objectFit: "cover" }}
                />
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Typography variant="h6" component="h2">
                    {item.name}
                  </Typography>
                  <Chip
                    label={item.isAvailable ? "Available" : "Out of Stock"}
                    color={item.isAvailable ? "success" : "error"}
                    size="small"
                  />
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Product ID: {item.productId}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Category: {item.category}
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 1 }}>
                  {item.description}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                  Price: ₹{item.price}
                </Typography>
              </CardContent>
              {token && item.isAvailable && (
                <CardActions sx={{ justifyContent: "space-between", px: 2 }}>
                  <Box display="flex" alignItems="center">
                    <IconButton onClick={() => updateQuantity(item._id, -1)}>
                      <Remove />
                    </IconButton>
                    <Typography>{quantities[item._id] || 0}</Typography>
                    <IconButton onClick={() => updateQuantity(item._id, 1)}>
                      <Add />
                    </IconButton>
                  </Box>
                </CardActions>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Place Order Button at Bottom */}
      {token && (
        <Box textAlign="center" mt={4}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handlePlaceOrder}
          >
            Place Order
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default InventoryPage;
