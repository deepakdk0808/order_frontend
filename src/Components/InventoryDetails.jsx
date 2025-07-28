import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  TextField,
  Box,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  Paper,
  Checkbox,
} from "@mui/material";

import {axiosInstance} from "../Utils/axiosUrl";    

const InventoryDetails = () => {
  const [inventory, setInventory] = useState([]);
  const [newItem, setNewItem] = useState({
    productId: "",
    name: "",
    category: "",
    price: "",
    description: "",
    imageUrl: "",
    isAvailable: true,
  });

  const [editMode, setEditMode] = useState(null);
  const [editItem, setEditItem] = useState({});

  const token = localStorage.getItem("token");

  const fetchInventory = async () => {
    try {
      const res = await axiosInstance.get(
        "/inventory",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setInventory(res.data);
    } catch (err) {
      console.error("Error fetching inventory:", err);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleAdd = async () => {
    try {
      await axiosInstance.post("/inventory", newItem, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewItem({
        productId: "",
        name: "",
        category: "",
        price: "",
        description: "",
        imageUrl: "",
        isAvailable: true,
      });
      fetchInventory();
    } catch (err) {
      console.error("Error adding item:", err);
    }
  };

  const handleUpdate = async (id) => {
    try {
      await axiosInstance.put(
        `/inventory/${id}`,
        editItem,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEditMode(null);
      fetchInventory();
    } catch (err) {
      console.error("Error updating item:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/inventory/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchInventory();
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Inventory Details
      </Typography>

      {/* Add New Inventory Item */}
      <Box display="flex" flexWrap="wrap" gap={2} mb={3}>
        {[
          "productId",
          "name",
          "category",
          "price",
          "description",
          "imageUrl",
        ].map((field) => (
          <TextField
            key={field}
            label={field}
            value={newItem[field]}
            onChange={(e) =>
              setNewItem({ ...newItem, [field]: e.target.value })
            }
          />
        ))}
        <Box display="flex" alignItems="center">
          <Typography>Available</Typography>
          <Checkbox
            checked={newItem.isAvailable}
            onChange={(e) =>
              setNewItem({ ...newItem, isAvailable: e.target.checked })
            }
          />
        </Box>
        <Button variant="contained" onClick={handleAdd}>
          Add
        </Button>
      </Box>

      {/* Inventory Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Image URL</TableCell>
              <TableCell>Available</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventory.map((item) => (
              <TableRow key={item._id}>
                {editMode === item._id ? (
                  <>
                    <TableCell>
                      <TextField
                        value={editItem.productId}
                        onChange={(e) =>
                          setEditItem({
                            ...editItem,
                            productId: e.target.value,
                          })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={editItem.name}
                        onChange={(e) =>
                          setEditItem({ ...editItem, name: e.target.value })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={editItem.category}
                        onChange={(e) =>
                          setEditItem({ ...editItem, category: e.target.value })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={editItem.price}
                        type="number"
                        onChange={(e) =>
                          setEditItem({ ...editItem, price: e.target.value })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={editItem.description}
                        onChange={(e) =>
                          setEditItem({
                            ...editItem,
                            description: e.target.value,
                          })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={editItem.imageUrl}
                        onChange={(e) =>
                          setEditItem({ ...editItem, imageUrl: e.target.value })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={editItem.isAvailable}
                        onChange={(e) =>
                          setEditItem({
                            ...editItem,
                            isAvailable: e.target.checked,
                          })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Button onClick={() => handleUpdate(item._id)}>
                        Save
                      </Button>
                      <Button onClick={() => setEditMode(null)}>Cancel</Button>
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>{item.productId}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.price}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>
                      <a href={item.imageUrl} target="_blank" rel="noreferrer">
                        View
                      </a>
                    </TableCell>
                    <TableCell>{item.isAvailable ? "Yes" : "No"}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => {
                          setEditMode(item._id);
                          setEditItem(item);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        color="error"
                        onClick={() => handleDelete(item._id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default InventoryDetails;
