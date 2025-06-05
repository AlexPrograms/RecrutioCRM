import React, { useState } from "react";
import { Box, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataContacts } from "../../Data/mockData";
import Header from "../../components/header";
import { useTheme } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

const Candidates = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [rows, setRows] = useState(mockDataContacts);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('view');
  const [selectedRow, setSelectedRow] = useState(null);
  const [editData, setEditData] = useState({});

  const handleDialogOpen = (type, row) => {
    setDialogType(type);
    setSelectedRow(row);
    setEditData(row || {});
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedRow(null);
    setEditData({});
  };

  const handleDelete = (id) => {
    setRows((prev) => prev.filter((row) => row.id !== id));
    handleDialogClose();
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSave = () => {
    setRows((prev) => prev.map((row) => row.id === editData.id ? { ...editData, id: row.id } : row));
    handleDialogClose();
  };

  const columns = [
    {
      field: 'actions',
      headerName: '',
      width: 120,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Box display="flex">
          <IconButton size="small" onClick={() => handleDialogOpen('view', params.row)}><VisibilityIcon /></IconButton>
          <IconButton size="small" onClick={() => handleDialogOpen('edit', params.row)}><EditIcon /></IconButton>
          <IconButton size="small" color="error" onClick={() => handleDialogOpen('delete', params.row)}><DeleteIcon /></IconButton>
        </Box>
      ),
    },
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "registrarId", headerName: "Registrar ID" },
    { field: "name", headerName: "Name", flex: 1, cellClassName: "name-column--cell" },
    { field: "age", headerName: "Age", type: "number", headerAlign: "left", align: "left" },
    { field: "phone", headerName: "Phone Number", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "address", headerName: "Address", flex: 1 },
    { field: "city", headerName: "City", flex: 1 },
    { field: "zipCode", headerName: "Zip Code", flex: 1 },
  ];

  return (
    <Box m="20px">
      <Header
        title="CONTACTS"
        subtitle="List of Contacts for Future Reference"
      />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>

      {/* Dialog for view/edit/delete */}
      <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogType === 'view' && 'View Contact'}
          {dialogType === 'edit' && 'Edit Contact'}
          {dialogType === 'delete' && 'Delete Contact'}
        </DialogTitle>
        <DialogContent>
          {dialogType === 'view' && selectedRow && (
            <Box>
              {Object.entries(selectedRow).map(([key, value]) => (
                <Box key={key} mb={1}><strong>{key}:</strong> {value}</Box>
              ))}
            </Box>
          )}
          {dialogType === 'edit' && (
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              {Object.entries(editData).map(([key, value]) =>
                key === 'id' ? (
                  <TextField key={key} label={key} name={key} value={value} disabled />
                ) : (
                  <TextField key={key} label={key} name={key} value={value} onChange={handleEditChange} />
                )
              )}
            </Box>
          )}
          {dialogType === 'delete' && selectedRow && (
            <Box>Are you sure you want to delete contact <strong>{selectedRow.name}</strong>?</Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          {dialogType === 'edit' && <Button onClick={handleEditSave} variant="contained">Save</Button>}
          {dialogType === 'delete' && <Button onClick={() => handleDelete(selectedRow.id)} color="error" variant="contained">Delete</Button>}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Candidates;