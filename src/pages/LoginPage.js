import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  TextField,
  Button,
  Alert
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function LoginPage() {
  const [tab, setTab] = useState(0);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setError("");
    setSuccess("");
    setUsername("");
    setPassword("");
    setEmail("");
  };

  // 🔐 LOGIN (UPDATED FOR ROLE SUPPORT)
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await axios.post("http://127.0.0.1:8000/auth/login", {
        username,
        password
      });

      const token = res.data.access_token;

      // decode JWT
      const decoded = jwtDecode(token);
      console.log(decoded);

      // store auth data
      localStorage.setItem("token", token);
      localStorage.setItem("role", decoded.role);
      localStorage.setItem("username", decoded.sub);

      setSuccess("Login successful!");
      navigate("/dashboard");


    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Login failed");
    }
  };

  // 🧾 SIGNUP (NO ROLE HERE - SAFE DEFAULT)
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await axios.post("http://127.0.0.1:8000/auth/signup", {
        username,
        email,
        password
      });

      setSuccess("User created successfully! Please login.");
      setTab(0);

      setUsername("");
      setPassword("");
      setEmail("");

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Signup failed");
    }
  };

  return (
    <Box sx={{
      maxWidth: 400,
      mx: "auto",
      mt: 8,
      p: 4,
      borderRadius: 2,
      boxShadow: 3,
      backgroundColor: "#fff"
    }}>
      <Tabs value={tab} onChange={handleTabChange} variant="fullWidth">
        <Tab label="Login" />
        <Tab label="Sign Up" />
      </Tabs>

      <Box sx={{ mt: 3 }}>

        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}

        {/* LOGIN */}
        {tab === 0 && (
          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
            />

            <Button fullWidth type="submit" variant="contained" sx={{ mt: 2 }}>
              Login
            </Button>
          </form>
        )}

        {/* SIGNUP */}
        {tab === 1 && (
          <form onSubmit={handleSignup}>
            <TextField
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
            />

            <Button fullWidth type="submit" variant="contained" sx={{ mt: 2 }}>
              Sign Up
            </Button>
          </form>
        )}

      </Box>
    </Box>
  );
}

export default LoginPage;