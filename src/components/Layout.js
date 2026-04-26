import React from "react";
import { useNavigate, Outlet } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
  Button
} from "@mui/material";

function Layout() {
  const navigate = useNavigate();
  const role = (localStorage.getItem("role") || "").toLowerCase();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <Box sx={{ display: "flex" }}>

      {/* SIDEBAR */}
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
            background: "#1e1e2f",
            color: "white",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between" 
          },
        }}
      >

        {/* TOP MENU */}
        <Box>

          <Typography sx={{ p: 2, fontWeight: "bold" }}>
            🎓 Student System
          </Typography>

          <List>

            <ListItem button onClick={() => navigate("/dashboard")}>
              <ListItemText primary="Dashboard" />
            </ListItem>

            {(role === "professor" || role === "admin") && (
              <ListItem button onClick={() => navigate("/users")}>
                <ListItemText primary="Users" />
              </ListItem>
            )}

          </List>

        </Box>

        {/* BOTTOM LOGOUT */}
        <Box sx={{ p: 2 }}>

          <Button
            fullWidth
            variant="contained"
            color="error"
            onClick={handleLogout}
            sx={{
              borderRadius: "8px",
              fontWeight: "bold"
            }}
          >
            Logout
          </Button>

        </Box>

      </Drawer>

      {/* MAIN CONTENT */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Outlet />
      </Box>

    </Box>
  );
}

export default Layout;