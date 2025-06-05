import { useState } from 'react';
import { Box, Typography, useTheme, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { tokens } from "../../theme";
import { mockDataTeam as mockDataEmployees } from "../../Data/mockData"; // Using mockDataTeam as mockDataEmployees
import Header from "../../components/header";

const Employees = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState(''); // 'edit' or 'delete'
  const [selectedRow, setSelectedRow] = useState(null);

  const handleDialogOpen = (type, row) => {
    setDialogType(type);
    setSelectedRow(row);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedRow(null);
    setDialogType('');
  };

  const handleEditConfirm = () => {
    // Add your edit logic here, e.g., API call
    console.log('Editing employee:', selectedRow);
    handleDialogClose();
  };

  const handleDeleteConfirm = () => {
    // Add your delete logic here, e.g., API call
    console.log('Deleting employee:', selectedRow);
    handleDialogClose();
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "name", headerName: "Name", flex: 1, cellClassName: "name-column--cell" },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phone", headerName: "Phone Number", flex: 1 },
    { field: "access", headerName: "Role", flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box>
          <IconButton onClick={() => handleDialogOpen('edit', params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDialogOpen('delete', params.row)} color="error">
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  // Basic initial state for DataGrid, enabling toolbar
  const initialState = {
    components: {
      Toolbar: GridToolbar,
    },
    componentsProps: {
      toolbar: {
        showQuickFilter: true,
        quickFilterProps: { debounceMs: 500 },
      },
    },
  };

  return (
    <Box m="20px">
      <Header
        title="EMPLOYEES"
        subtitle="List of Employees"
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
        }}
      >
        <DataGrid
          rows={mockDataEmployees}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          initialState={initialState}
        />
      </Box>

      {/* Edit/Delete Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>{dialogType === 'edit' ? 'Edit Employee' : 'Delete Employee'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialogType === 'edit'
              ? `Modify details for employee: ${selectedRow?.name || ''}.` // Placeholder for edit form
              : `Are you sure you want to delete employee ${selectedRow?.name || ''}? This action cannot be undone.`}
          </DialogContentText>
          {/* TODO: If dialogType is 'edit', render form fields here */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button 
            onClick={dialogType === 'edit' ? handleEditConfirm : handleDeleteConfirm} 
            color={dialogType === 'edit' ? 'primary' : 'error'} 
            autoFocus
          >
            {dialogType === 'edit' ? 'Save Changes' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Employees;