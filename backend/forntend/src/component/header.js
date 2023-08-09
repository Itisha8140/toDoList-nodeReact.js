import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import Images from "./images/logo_white.png";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export default function ButtonAppBar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/v1/users/logout"); // Replace with your logout API endpoint
      if (response.status === 200) {
        // Perform any additional actions after successful logout
        navigate('/')
        console.log("Logged out successfully");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.log("error: " + error);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" compo nent="div" sx={{ flexGrow: 1 }}>
            <img src={Images} width={100} />
          </Typography>
          <LogoutIcon onClick={handleLogout} />
          <Button color="inherit">
            <Link to="/">Login</Link>
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
