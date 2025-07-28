import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Divider,
} from "@mui/material";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrderHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5001/api/orders/my/history",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOrders(response.data);
    } catch (err) {
      console.error("Failed to fetch order history:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  return (
    <Container sx={{ marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Order History
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : orders.length === 0 ? (
        <Typography>No past orders found.</Typography>
      ) : (
        <Grid container spacing={2}>
          {orders.map((order) => (
            <Grid item xs={12} md={6} key={order._id}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6">Order ID: {order._id}</Typography>
                  <Typography variant="body1">
                    Status: {order.status}
                  </Typography>
                  <Typography variant="body1">
                    Payment: {order.paymentCollected}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Placed on: {new Date(order.createdAt).toLocaleString()}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle2">Items:</Typography>
                  {order.items.map((item, index) => (
                    <Typography key={index}>
                      • {item.inventoryItem?.name || "Unknown"} (x
                      {item.quantity})
                    </Typography>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default OrderHistory;
