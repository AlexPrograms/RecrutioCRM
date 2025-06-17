import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  useTheme,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  CircularProgress,
  Alert,
  AlertTitle,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';

import { tokens } from "../../theme";
import Header from "../../components/header";
import { candidatesApi } from "../../services/apiService";
import { useFormik } from "formik";
import * as yup from "yup";

// Form validation schema for candidate forms
const candidateSchema = yup.object().shape({
  first_name: yup.string().required("First name is required"),
  last_name: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email format").required("Email is required"),
  phone_number: yup.string().required("Phone number is required"),
  status: yup.string().required("Status is required"),
  city: yup.string(),
  address: yup.string(),
  nationality: yup.string(),
  specialty: yup.string(),
  additional_info: yup.string(),
  relocation_ready: yup.boolean(),
  housing_status: yup.string().required("Housing status is required"),
});

const Candidates = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  // Data state
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statuses, setStatuses] = useState(["Applied", "Rejected", "Interviewing", "Hired"]);
  
  // Dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState(''); // 'create', 'edit', or 'delete'
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form handling with formik
  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      status: "Applied",
      city: "",
      address: "",
      nationality: "",
      specialty: "",
      additional_info: "",
      relocation_ready: false,
      housing_status: "HasTemporary",
    },
    validationSchema: candidateSchema,
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        setError('');
        
        // Get company info from auth token or use a default
        const company = 1; // TODO: Extract from user context/auth token
        
        const payload = {
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          phone_number: values.phone_number,
          status: values.status,
          city: values.city || '',
          address: values.address || '',
          nationality: values.nationality || '',
          specialty: values.specialty || '',
          additional_info: values.additional_info || '',
          relocation_ready: values.relocation_ready,
          housing_status: values.housing_status,
          company: company,
        };
        
        console.log('📤 Submitting candidate payload:', payload);
        
        if (dialogType === "create") {
          const response = await candidatesApi.create(payload);
          console.log('✅ Candidate created successfully:', response.data);
        } else if (dialogType === "edit" && selectedCandidate) {
          const response = await candidatesApi.update(selectedCandidate.id, payload);
          console.log('✅ Candidate updated successfully:', response.data);
        }
        
        fetchCandidates();
        handleDialogClose();
      } catch (err) {
        const errorMessage = dialogType === "create" ? "Failed to create candidate. Please check all required fields." : "Failed to update candidate. Please try again.";
        setError(errorMessage);
        console.error('❌ Candidate save error:', err);
        console.error('❌ Error details:', err.response?.data);
        
        // Display specific validation errors if available
        if (err.response?.data) {
          const validationErrors = Object.entries(err.response.data)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join('; ');
          setError(`Validation errors: ${validationErrors}`);
        }
      } finally {
        setIsSubmitting(false);
      }
    },
  });
  
  // Dialog management
  const handleDialogOpen = (type, candidate = null) => {
    setDialogType(type);
    setSelectedCandidate(candidate);
    
    if (type === "edit" && candidate) {
      formik.setValues({
        first_name: candidate.first_name || "",
        last_name: candidate.last_name || "",
        email: candidate.email || "",
        phone_number: candidate.phone_number || "",
        status: candidate.status || "Applied",
        city: candidate.city || "",
        address: candidate.address || "",
        nationality: candidate.nationality || "",
        specialty: candidate.specialty || "",
        additional_info: candidate.additional_info || "",
        relocation_ready: candidate.relocation_ready,
        housing_status: candidate.housing_status,
      });
    } else if (type === "create") {
      formik.resetForm();
    }
    
    setOpenDialog(true);
  };
  
  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedCandidate(null);
    setDialogType("");
    formik.resetForm();
  };
  
  const handleDeleteCandidate = async () => {
    if (!selectedCandidate) return;
    
    try {
      setIsSubmitting(true);
      setError('');
      console.log('🗑️ Deleting candidate:', selectedCandidate.id);
      await candidatesApi.delete(selectedCandidate.id);
      console.log('✅ Candidate deleted successfully');
      fetchCandidates();
      handleDialogClose();
    } catch (err) {
      console.error('❌ Error deleting candidate:', err);
      setError(`Failed to delete candidate: ${err.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchCandidates = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      console.log('🔄 Fetching candidates...');
      const response = await candidatesApi.getAll();
      console.log('✅ Candidates response:', response);
      
      // Handle paginated response
      const candidateData = response.data?.results || response.data || [];
      console.log('📊 Candidate data:', candidateData);
      setCandidates(Array.isArray(candidateData) ? candidateData : []);
    } catch (err) {
      console.error('❌ Error fetching candidates:', err);
      setError(`Failed to fetch candidates: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { 
      field: "name", 
      headerName: "Name", 
      flex: 1,
      valueGetter: (params) => {
        if (!params || !params.row) return '';
        return `${params.row.first_name || ''} ${params.row.last_name || ''}`.trim();
      }
    },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phone_number", headerName: "Phone Number", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => {
        if (!params || !params.row) return null;
        const { status } = params.row;
        return (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={
              status === "Applied"
                ? colors.greenAccent[600]
                : status === "Rejected"
                ? colors.redAccent[700]
                : status === "Interviewing"
                ? colors.blueAccent[700]
                : colors.greenAccent[600]
            }
            borderRadius="4px"
          >
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              {status}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "city",
      headerName: "City",
      flex: 1,
    },
    {
      field: "specialty",
      headerName: "Specialty",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.8,
      renderCell: (params) => {
        if (!params || !params.row) return null;
        return (
          <Box display="flex" justifyContent="center" width="100%">
            <IconButton onClick={() => handleDialogOpen("edit", params.row)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleDialogOpen("delete", params.row)} color="error">
              <DeleteIcon />
            </IconButton>
          </Box>
        );
      }
    },
  ];

  return (
    <Box m="20px">
      <Header title="CANDIDATES" subtitle="Managing candidate information" />
      
      {error && (
        <Alert 
          severity="error" 
          onClose={() => setError('')} 
          sx={{ mb: 2 }}
        >
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}
      
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
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Button
            color="secondary"
            variant="contained"
            onClick={() => handleDialogOpen('create')}
          >
            Add New Candidate
          </Button>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchCandidates}
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </Button>
        </Box>
        {loading && candidates.length === 0 ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="200px">
            <CircularProgress />
            <Typography variant="h6" sx={{ ml: 2 }}>
              Loading candidates...
            </Typography>
          </Box>
        ) : (
          <DataGrid 
            rows={candidates || []} 
            columns={columns}
            loading={loading}
            autoHeight
            getRowId={(row) => row?.id || Math.random()}
            disableSelectionOnClick
            sx={{
              '& .MuiDataGrid-cell': {
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              },
            }}
          />
        )}
      </Box>

      {/* Create/Edit Dialog */}
      <Dialog 
        open={openDialog && (dialogType === "create" || dialogType === "edit")} 
        onClose={handleDialogClose}
        fullWidth
        maxWidth="sm"
      >
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>
            {dialogType === "create" ? "Add New Candidate" : "Edit Candidate"}
          </DialogTitle>
          <DialogContent>
            <Box mt={2} display="grid" gap={2} gridTemplateColumns="1fr 1fr">
              <TextField
                fullWidth
                variant="filled"
                label="First Name"
                name="first_name"
                value={formik.values.first_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.first_name && Boolean(formik.errors.first_name)}
                helperText={formik.touched.first_name && formik.errors.first_name}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Last Name"
                name="last_name"
                value={formik.values.last_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.last_name && Boolean(formik.errors.last_name)}
                helperText={formik.touched.last_name && formik.errors.last_name}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                gridColumn="span 2"
              />
              <TextField
                fullWidth
                variant="filled"
                label="Phone Number"
                name="phone_number"
                value={formik.values.phone_number}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.phone_number && Boolean(formik.errors.phone_number)}
                helperText={formik.touched.phone_number && formik.errors.phone_number}
              />
              <FormControl fullWidth variant="filled">
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.status && Boolean(formik.errors.status)}
                >
                  {statuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                variant="filled"
                label="City"
                name="city"
                value={formik.values.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                gridColumn="span 2"
              />
              <TextField
                fullWidth
                variant="filled"
                label="Address"
                name="address"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                gridColumn="span 2"
              />
              <TextField
                fullWidth
                variant="filled"
                label="Specialty"
                name="specialty"
                value={formik.values.specialty}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Nationality"
                name="nationality"
                value={formik.values.nationality}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Additional Info"
                name="additional_info"
                value={formik.values.additional_info}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                gridColumn="span 2"
              />
              <FormControl fullWidth variant="filled">
                <InputLabel>Housing Status</InputLabel>
                <Select
                  name="housing_status"
                  value={formik.values.housing_status}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.housing_status && Boolean(formik.errors.housing_status)}
                >
                  <MenuItem value="HasTemporary">Has Temporary Housing</MenuItem>
                  <MenuItem value="NeedsHousing">Needs Housing</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth variant="filled">
                <InputLabel>Relocation Ready</InputLabel>
                <Select
                  name="relocation_ready"
                  value={formik.values.relocation_ready}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <MenuItem value={true}>Yes</MenuItem>
                  <MenuItem value={false}>No</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary">
              Cancel
            </Button>
            <Button 
              type="submit" 
              color="secondary" 
              variant="contained"
              disabled={isSubmitting}
            >
              {isSubmitting ? <CircularProgress size={24} /> : dialogType === "create" ? "Add" : "Save"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog && dialogType === "delete"} onClose={handleDialogClose}>
        <DialogTitle>Delete Candidate</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete candidate {selectedCandidate?.first_name} {selectedCandidate?.last_name}?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteCandidate} 
            color="error" 
            variant="contained"
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Candidates;
