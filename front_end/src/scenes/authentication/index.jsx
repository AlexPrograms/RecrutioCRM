import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Link,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  Divider,
  Paper,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { FaGoogle, FaFacebookF, FaGithub } from "react-icons/fa";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => setShowPassword((prev) => !prev);
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted", form);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        background:
          "linear-gradient(135deg, #110019 0%, #180038 50%, #1d003f 100%)",
        color: "#fff",
      }}
    >
      {/* Left Panel */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 4,
        }}
      >
        <Typography variant="h2" fontWeight="bold">
          Welcome Back <span style={{ color: "#c084fc" }}>!</span>
        </Typography>
      </Box>

      {/* Right Panel */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 420,
            p: 4,
            borderRadius: 4,
            border: "1px solid rgba(255,255,255,0.2)",
            backgroundColor: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 4px 30px rgba(0,0,0,0.2)",
          }}
        >
          <Typography variant="h5" gutterBottom>
            Login
          </Typography>
          <Typography variant="body2" sx={{ color: "#aaa", mb: 2 }}>
            Glad you're back
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              margin="normal"
              variant="outlined"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              InputProps={{ style: { color: "#fff" } }}
              InputLabelProps={{ style: { color: "#aaa" } }}
            />

            <TextField
              fullWidth
              label="Password"
              margin="normal"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              InputProps={{
                style: { color: "#fff" },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{ style: { color: "#aaa" } }}
            />

            <FormControlLabel
              control={<Checkbox sx={{ color: "#c084fc" }} />}
              label={<Typography variant="body2">Remember me</Typography>}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 2,
                py: 1.4,
                borderRadius: 2,
                background: "linear-gradient(to right, #7b2ff7, #f107a3)",
                fontWeight: "bold",
                fontSize: "1rem",
                textTransform: "none",
              }}
            >
              Login
            </Button>

            <Box textAlign="center" mt={2}>
              <Link href="#" variant="body2" sx={{ color: "#aaa" }}>
                Forgot password ?
              </Link>
            </Box>

            <Divider sx={{ my: 3, borderColor: "#444" }}>Or</Divider>

            <Box display="flex" justifyContent="center" gap={2}>
              <IconButton sx={{ color: "#fff" }}>
                <FaGoogle />
              </IconButton>
              <IconButton sx={{ color: "#fff" }}>
                <FaFacebookF />
              </IconButton>
              <IconButton sx={{ color: "#fff" }}>
                <FaGithub />
              </IconButton>
            </Box>

            <Box mt={3} textAlign="center">
              <Typography variant="body2" sx={{ color: "#aaa" }}>
                Don’t have an account?{" "}
                <Link href="#" underline="hover" sx={{ color: "#c084fc" }}>
                  Signup
                </Link>
              </Typography>
              <Box mt={1} display="flex" justifyContent="space-between">
                <Link href="#" variant="caption" sx={{ color: "#aaa" }}>
                  Terms & Conditions
                </Link>
                <Link href="#" variant="caption" sx={{ color: "#aaa" }}>
                  Support
                </Link>
                <Link href="#" variant="caption" sx={{ color: "#aaa" }}>
                  Customer Care
                </Link>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Login;
