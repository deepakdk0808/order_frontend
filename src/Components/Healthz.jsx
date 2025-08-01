import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Typography, CircularProgress } from "@mui/material";

const Healthz = () => {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    axios
      .get("https://order-backend-3bgm.onrender.com/healthz")
      .then((res) => setStatus(res.data))
      .catch(() => setStatus({ message: "Service Unavailable" }));
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Health Check
      </Typography>
      {status ? (
        <Typography>{status.message}</Typography>
      ) : (
        <CircularProgress />
      )}
    </Container>
  );
};

export default Healthz;
