import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Paper,
} from "@mui/material";
import  axiosInstance  from "../Utils/axiosUrl";

const CustomerDetails = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
  });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        const res = await axiosInstance.get(
          `/customers/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setCustomer(res.data.data);
        setFormData({
          name: res.data.data.name || "",
          address: res.data.data.address || "",
          phone: res.data.data.phone || "",
        });
      } catch (err) {
        console.error("Error fetching customer details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerDetails();
  }, [id]);

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      const res = await axiosInstance.put(
        `/customers/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Customer updated successfully");
      setCustomer(res.data.data);
    } catch (err) {
      console.error("Error updating customer:", err);
      alert("Failed to update customer");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <CircularProgress />;
  if (!customer) return <Typography>Customer not found</Typography>;

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Customer Info
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          label="Name"
          variant="outlined"
          margin="normal"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <TextField
          fullWidth
          label="Address"
          variant="outlined"
          margin="normal"
          value={formData.address}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
        />
        <TextField
          fullWidth
          label="Phone"
          variant="outlined"
          margin="normal"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpdate}
          disabled={updating}
        >
          {updating ? "Updating..." : "Update"}
        </Button>
      </Paper>

      <Typography variant="h5" gutterBottom>
        Orders
      </Typography>
      {customer.orders?.length === 0 ? (
        <Typography>No orders yet.</Typography>
      ) : (
        customer.orders.map((order) => (
          <Paper
            key={order._id}
            sx={{ p: 2, mb: 2, backgroundColor: "#f8f8f8" }}
            elevation={1}
          >
            <Typography>
              <strong>Status:</strong> {order.status}
            </Typography>
            <Typography>
              <strong>Payment:</strong> {order.paymentCollected}
            </Typography>
            <Typography>
              <strong>Items:</strong>
            </Typography>
            <ul>
              {order.items.map((item, idx) => (
                <li key={idx}>
                  {item.inventoryItem?.name} — ₹{item.inventoryItem?.price} —{" "}
                  {item.inventoryItem?.description}
                </li>
              ))}
            </ul>
          </Paper>
        ))
      )}
      <Button
        variant="outlined"
        color="error"
        sx={{ mt: 2 }}
        onClick={async () => {
          const confirmDelete = window.confirm(
            "Are you sure you want to delete this customer?"
          );
          if (!confirmDelete) return;

          try {
            await axiosInstance.delete(
              `/customers/${id}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
            alert("Customer deleted successfully");
            window.location.href = "/customer"; // redirect to customer list or homepage
          } catch (err) {
            console.error("Error deleting customer:", err);
            alert("Failed to delete customer"); // navigate back to customer list
          }
        }}
      >
        Delete Customer
      </Button>
    </Box>
  );
};

export default CustomerDetails;
