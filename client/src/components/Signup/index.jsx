import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { FormControlLabel, Grid, Link, Switch } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import  { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const defaultTheme = createTheme();

export default function Signup() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    isAdmin: false,
    orgName: "",
  });

  const handleToggle = (event) => {
    // setChecked(event.target.checked);
    setData({ ...data, isAdmin: event.target.checked });
  };
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setData({ ...data, [event.currentTarget.name]: event.target.value });
  };

  const connectMetaMask = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const metamaskAddress = accounts[0];
        const url = "/api/users";
         await axiosInstance.post(url, {
          name: data.name,
          metamaskAddress,
          role: data.isAdmin ? "admin" : "user",
          orgName: data.orgName,
        });
        navigate("/login");
      } catch (error) {
        if (
          error.response &&
          error.response.status >= 400 &&
          error.response.status <= 500
        ) {
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
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
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
            {
              data.isAdmin && (
                <TextField
                autoComplete="orgName"
                onChange={handleChange}
                name="orgName"
                required
                fullWidth
                id="orgName"
                label="Organization Name"
                autoFocus
                sx={{ mt: 3 }}
              />
              )
            }
            <FormControlLabel
              control={
                <Switch
                  checked={data.isAdmin}
                  onChange={handleToggle}
                  inputProps={{ "aria-label": "controlled" }}
                />
              }
              label="Manager"
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
          <Grid container>
            <Grid item>
              <Link href="/login" variant="body2">
                {"Already have account? Sign In"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
