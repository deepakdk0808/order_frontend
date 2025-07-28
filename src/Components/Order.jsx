import React, { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import {
  Container,
  Typography,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  Box,
  Alert,
} from "@mui/material";

const socket = io("http://localhost:5001"); // Adjust this URL if needed

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [cancelDisabled, setCancelDisabled] = useState(false);
  const [message, setMessage] = useState("");

  const STATUS_FLOW = ["Placed", "Picked", "Shipped", "Delivered"];
  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5001/api/orders/my/current",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders(res.data);
      setMessage("You can cancel an order within 60 seconds.");
    } catch (err) {
      console.error("Failed to fetch orders:", err.response?.data || err);
      setMessage("Please log in to view your orders.");
    }
  };

  const handleCancel = async (orderId) => {
    try {
      await axios.put(
        `http://localhost:5001/api/orders/${orderId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } catch (err) {
      console.error("Error cancelling order:", err.response?.data || err);
    }
  };

  const updateSingleOrderStatus = async (orderId, currentStatus) => {
    const currentIndex = STATUS_FLOW.indexOf(currentStatus);
    const nextStatus = STATUS_FLOW[currentIndex + 1];
    if (!nextStatus) return;

    try {
      await axios.patch(
        `http://localhost:5001/api/orders/${orderId}/status`,
        { status: nextStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Error updating status:", err.response?.data || err);
    }
  };

  const updateOrderStatus = async () => {
    for (const order of orders) {
      if (order.status !== "Cancelled" && order.status !== "Delivered") {
        await updateSingleOrderStatus(order._id, order.status);
      }
    }
    fetchOrders();
  };

  useEffect(() => {
    fetchOrders();

    const cancelTimer = setTimeout(() => {
      setCancelDisabled(true);
      setMessage(
        "Cancel period is over. Orders will now update automatically."
      );
    }, 60000);

    const statusTimer = setInterval(updateOrderStatus, 60000);

    // Real-time socket listener
    socket.on("orderStatusUpdated", (updatedOrder) => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
    });

    return () => {
      clearTimeout(cancelTimer);
      clearInterval(statusTimer);
      socket.off("orderStatusUpdated");
    };
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        My Orders
      </Typography>

      {message && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      {orders.length === 0 ? (
        <Typography>No orders found.</Typography>
      ) : (
        orders.map((order) => (
          <Paper
            key={order._id}
            elevation={3}
            sx={{ p: 3, mb: 3, backgroundColor: "#f9f9f9" }}
          >
            <Typography variant="subtitle1">
              <strong>Status:</strong> {order.status}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Payment Collected:</strong> {order.paymentCollected}
            </Typography>

            <Box mt={2}>
              <Typography variant="subtitle1" fontWeight="bold">
                Items:
              </Typography>
              <List dense>
                {order.items.map((item, idx) => (
                  <ListItem key={idx} disablePadding>
                    <ListItemText
                      primary={`${item.inventoryItem.name} — Quantity: ${item.quantity}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>

            <Box mt={2} display="flex" gap={2}>
              {order.status !== "Cancelled" &&
                order.status !== "Delivered" &&
                !cancelDisabled && (
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleCancel(order._id)}
                  >
                    Cancel Order
                  </Button>
                )}
            </Box>
          </Paper>
        ))
      )}
    </Container>
  );
};

export default Orders;
