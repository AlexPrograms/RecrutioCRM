import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const AccountPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    about: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [confirmDialog, setConfirmDialog] = useState(false);
  const [doubleConfirm, setDoubleConfirm] = useState(false);

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSave = () => {
    console.log("Saved:", form);
  };

  const handleDelete = () => {
    if (!doubleConfirm) {
      setDoubleConfirm(true);
    } else {
      console.log("Account deleted");
      setConfirmDialog(false);
      setDoubleConfirm(false);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        overflow: "auto",
        background:
          "linear-gradient(135deg, #110019 0%, #180038 50%, #1d003f 100%)",
        p: { xs: 2, md: 6 },
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: "1100px",
          p: { xs: 3, md: 5 },
          borderRadius: 4,
          backgroundColor: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.15)",
          backdropFilter: "blur(10px)",
          color: "#fff",
        }}
      >
        {/* Header */}
        <Grid container spacing={3} alignItems="center" justifyContent="space-between">
          <Grid item>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar src="https://i.pravatar.cc/300" sx={{ width: 64, height: 64 }} />
              <Box>
                <Typography variant="h6">Alexa Rawles</Typography>
                <Typography variant="body2" sx={{ color: "#aaa" }}>
                  alexarawles@gmail.com
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item>
            <Box display="flex" gap={2}>
              <Button
                variant="outlined"
                onClick={() => setConfirmDialog(true)}
                sx={{
                  borderColor: "#f44336",
                  color: "#f44336",
                  fontWeight: "bold",
                  textTransform: "none",
                  px: 4,
                  py: 1.5,
                  fontSize: "1rem",
                  "&:hover": {
                    backgroundColor: "rgba(244,67,54,0.1)",
                  },
                }}
              >
                Delete Account
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
                sx={{
                  background: "linear-gradient(to right, #7b2ff7, #f107a3)",
                  fontWeight: "bold",
                  textTransform: "none",
                  px: 4,
                  py: 1.5,
                  fontSize: "1rem",
                }}
              >
                Save Changes
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Form */}
        <Box mt={5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Full Name"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange("name")}
                InputProps={{ style: { color: "#fff" } }}
                InputLabelProps={{ style: { color: "#aaa" } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                placeholder="+1234567890"
                value={form.phone}
                onChange={handleChange("phone")}
                InputProps={{ style: { color: "#fff" } }}
                InputLabelProps={{ style: { color: "#aaa" } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                placeholder="john@example.com"
                value={form.email}
                onChange={handleChange("email")}
                InputProps={{ style: { color: "#fff" } }}
                InputLabelProps={{ style: { color: "#aaa" } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                minRows={4}
                label="About"
                placeholder="Tell us something about yourself..."
                value={form.about}
                onChange={handleChange("about")}
                InputProps={{ style: { color: "#fff" } }}
                InputLabelProps={{ style: { color: "#aaa" } }}
              />
            </Grid>
          </Grid>

          <Box mt={5}>
            <Typography variant="h6" gutterBottom>
              Change Password
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="password"
                  label="Old Password"
                  placeholder="••••••"
                  value={form.oldPassword}
                  onChange={handleChange("oldPassword")}
                  InputProps={{ style: { color: "#fff" } }}
                  InputLabelProps={{ style: { color: "#aaa" } }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="password"
                  label="New Password"
                  placeholder="••••••"
                  value={form.newPassword}
                  onChange={handleChange("newPassword")}
                  InputProps={{ style: { color: "#fff" } }}
                  InputLabelProps={{ style: { color: "#aaa" } }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="password"
                  label="Confirm Password"
                  placeholder="••••••"
                  value={form.confirmPassword}
                  onChange={handleChange("confirmPassword")}
                  InputProps={{ style: { color: "#fff" } }}
                  InputLabelProps={{ style: { color: "#aaa" } }}
                />
              </Grid>
            </Grid>
          </Box>
        </Box>

        {/* Delete confirmation popup */}
        <Dialog open={confirmDialog} onClose={() => {
          setConfirmDialog(false);
          setDoubleConfirm(false);
        }}>
          <DialogTitle sx={{ color: "#fff", background: "#1a1a1a" }}>
            {doubleConfirm ? "Are You Absolutely Sure?" : "Delete Account"}
          </DialogTitle>
          <DialogContent sx={{ background: "#1a1a1a", color: "#aaa" }}>
            {doubleConfirm
              ? "This action is irreversible. Confirm again to delete your account."
              : "Are you sure you want to delete your account?"}
          </DialogContent>
          <DialogActions sx={{ background: "#1a1a1a" }}>
            <Button onClick={() => {
              setConfirmDialog(false);
              setDoubleConfirm(false);
            }}>
              Cancel
            </Button>
            <Button onClick={handleDelete} sx={{ color: "#f44336" }}>
              {doubleConfirm ? "Yes, Delete It" : "Delete"}
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
};

export default AccountPage;
