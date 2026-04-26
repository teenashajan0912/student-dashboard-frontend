import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  Chip,
  TextField,
  Stack,
  Button,
  Alert
} from "@mui/material";

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");
  const role = (localStorage.getItem("role") || "").toLowerCase();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateRole = async (id, newRole) => {
    try {
      await axios.put(
        `http://127.0.0.1:8000/users/${id}/role?new_role=${newRole}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("Role updated successfully");
      fetchUsers();
    } catch (err) {
      setMessage(err.response?.data?.detail || "Update failed");
    }
  };

  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  const getChipColor = (role) => {
    if (role === "admin") return "error";
    if (role === "professor") return "warning";
    return "success";
  };

  return (
    <Box sx={{ p: 4, background: "#f5f6fa", minHeight: "100vh" }}>

      {/* HEADER */}
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        👥 User Management Panel
      </Typography>

      <Typography variant="body2" sx={{ mb: 2 }}>
        Logged in as: <b>{role}</b>
      </Typography>

      {message && <Alert severity="info" sx={{ mb: 2 }}>{message}</Alert>}

      {/* SEARCH BAR */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          label="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Paper>

      {/* TABLE */}
      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>

          <TableHead sx={{ background: "#1976d2" }}>
            <TableRow>
              <TableCell sx={{ color: "white" }}>ID</TableCell>
              <TableCell sx={{ color: "white" }}>Username</TableCell>
              <TableCell sx={{ color: "white" }}>Email</TableCell>
              <TableCell sx={{ color: "white" }}>Role</TableCell>
              <TableCell sx={{ color: "white" }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredUsers.map((u) => {
              const isSystemAdmin = u.username === "admin";

              return (
                <TableRow key={u.id} hover>

                  <TableCell>{u.id}</TableCell>
                  <TableCell>{u.username}</TableCell>
                  <TableCell>{u.email}</TableCell>

                  {/* ROLE BADGE */}
                  <TableCell>
                    <Chip
                      label={u.role}
                      color={getChipColor(u.role)}
                      size="small"
                    />
                  </TableCell>

                  {/* ACTIONS */}
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">

                      {/* ROLE CHANGE */}
                      <Select
                        size="small"
                        value={u.role}
                        disabled={isSystemAdmin}
                        onChange={(e) => updateRole(u.id, e.target.value)}
                      >
                        <MenuItem value="student">Student</MenuItem>
                        <MenuItem value="professor">Professor</MenuItem>

                        {/* only admin can assign admin */}
                        {role === "admin" && (
                          <MenuItem value="admin">Admin</MenuItem>
                        )}
                      </Select>

                      {/* DELETE BUTTON (ADMIN ONLY + BLOCK SYSTEM ADMIN) */}
                      {role === "admin" && !isSystemAdmin && (
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={async () => {
                            await axios.delete(
                              `http://127.0.0.1:8000/users/${u.id}`,
                              { headers: { Authorization: `Bearer ${token}` } }
                            );
                            fetchUsers();
                          }}
                        >
                          Delete
                        </Button>
                      )}

                      {/* SYSTEM ADMIN LOCK */}
                      {isSystemAdmin && (
                        <Chip label="SYSTEM ADMIN" color="error" />
                      )}

                    </Stack>
                  </TableCell>

                </TableRow>
              );
            })}
          </TableBody>

        </Table>
      </TableContainer>

    </Box>
  );
}

export default UsersPage;