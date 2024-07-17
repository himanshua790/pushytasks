import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const defaultTheme = createTheme();

export default function Signup() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
  });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setData({ ...data, [event.currentTarget.name]: event.target.value });
  };

  const connectMetaMask = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const metamaskAddress = accounts[0];
        const url = "http://localhost:5000/api/users";
        const res = await axios.post(url, { ...data, metamaskAddress });
        navigate("/login");
      } catch (error) {
        if (error.response && error.response.status >= 400 && error.response.status <= 500) {
          setError(error.response.data.message);
        }
      }
    } else {
      setError("MetaMask is not installed!");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    connectMetaMask();
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
              autoComplete="name"
              onChange={handleChange}
              name="name"
              required
              fullWidth
              id="name"
              label=" Username"
              autoFocus
            />
            {error && <div>{error}</div>}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
