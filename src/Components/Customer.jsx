import React, { useEffect, useState } from "react";
import { Container, Typography, Paper, Button, Grid, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import  axiosInstance  from "../Utils/axiosUrl";

const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();

  const fetchCustomers = async () => {
    try {
      const res 
      = await axiosInstance.get("/customers",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setCustomers(res.data.data);
     
    } catch (err) {
      alert(err.response?.data?.message || "Error fetching customers");
    }
  };

  const deleteCustomer = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?"))
      return;
    try {
      await axiosInstance.delete(`/customers/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCustomers(customers.filter((c) => c._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting customer");
    }
  };

  const viewDetails = (id) => {
    navigate(`/customerDetails/${id}`);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom align="center">
          Customer List
        </Typography>
        {customers.map((customer) => (
          <Paper
            key={customer._id}
            sx={{ p: 2, mb: 2, background: "#f9f9f9" }}
            elevation={1}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={8}>
                <Typography>Name: {customer.name}</Typography>
                <Typography>Email: {customer.email}</Typography>
                <Typography>Role: {customer.role}</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box display="flex" justifyContent="flex-end" gap={1}>
                  <Button
                    variant="contained"
                    color="info"
                    onClick={() => viewDetails(customer._id)}
                  >
                    View
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => deleteCustomer(customer._id)}
                  >
                    Delete
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        ))}
      </Paper>
    </Container>
  );
};

export default Customer;
