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
  IconButton,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import { tokens } from "../../theme";
import Header from "../../components/header";
import { projectsApi, employeesApi } from "../../services/apiService";
import { useFormik } from "formik";
import * as yup from "yup";

// Form validation schema
const projectSchema = yup.object().shape({
  name: yup.string().required('Project name is required'),
  required_people_count: yup.number().positive('Team size must be positive').required('Team size is required'),
  details: yup.string().required('Details are required'),
  location_street: yup.string().required('Street address is required'),
  location_city: yup.string().required('City is required'),
  location_postal_code: yup.string().required('Postal code is required'),
  location_country: yup.string().required('Country is required'),
  manager: yup.mixed().required('Project manager is required'),
});

const Projects = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  // State for data & UI
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [managers, setManagers] = useState([]);
  
  // Dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState(''); // 'create', 'edit', or 'delete'
  const [selectedProject, setSelectedProject] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form handling with formik
  const formik = useFormik({
    initialValues: {
      name: '',
      required_people_count: '',
      details: '',
      location_street: '',
      location_city: '',
      location_postal_code: '',
      location_country: '',
      manager: '',
    },
    validationSchema: projectSchema,
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        setError(null); // Clear previous errors
        
        const formattedValues = {
          ...values,
          required_people_count: Number(values.required_people_count),
          manager: Number(values.manager), // Convert to number for API
          company: 1, // TODO: Extract from authenticated user token
        };
        
        console.log('📤 Submitting project with data:', formattedValues);
        
        if (dialogType === 'create') {
          await projectsApi.create(formattedValues);
          console.log('✅ Project created successfully');
        } else if (dialogType === 'edit' && selectedProject) {
          await projectsApi.update(selectedProject.id, formattedValues);
          console.log('✅ Project updated successfully');
        }
        
        fetchProjects();
        handleDialogClose();
      } catch (err) {
        console.error("❌ Error submitting project:", err);
        const errorMessage = err.response?.data?.detail || 
                             err.response?.data?.message || 
                             "Failed to save project. Please check your data and try again.";
        setError(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    },
  });
  
  // Dialog management
  const handleDialogOpen = (type, project = null) => {
    setDialogType(type);
    setSelectedProject(project);
    
    if (type === 'edit' && project) {
      formik.setValues({
        name: project.name || '',
        required_people_count: project.required_people_count || '',
        details: project.details || '',
        location_street: project.location_street || '',
        location_city: project.location_city || '',
        location_postal_code: project.location_postal_code || '',
        location_country: project.location_country || '',
        manager: project.manager?.id || '',
      });
    } else if (type === 'create') {
      formik.resetForm();
    }
    
    setOpenDialog(true);
  };
  
  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedProject(null);
    setDialogType('');
    formik.resetForm();
  };
  
  const handleDeleteProject = async () => {
    if (!selectedProject) return;
    
    try {
      setIsSubmitting(true);
      await projectsApi.delete(selectedProject.id);
      fetchProjects();
      handleDialogClose();
    } catch (err) {
      console.error("Error deleting project:", err);
      setError("Failed to delete project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching projects...');
      const response = await projectsApi.getAll();
      console.log('📋 Projects API response:', response.data);
      
      // Handle paginated response
      const projectsData = response.data.results || response.data || [];
      console.log('✅ Projects data extracted:', projectsData);
      
      setProjects(Array.isArray(projectsData) ? projectsData : []);
      setError(null);
    } catch (err) {
      console.error("❌ Failed to fetch projects:", err);
      setError("Failed to load projects. Please try again later.");
      setProjects([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch managers for the dropdown
  const fetchManagers = useCallback(async () => {
    try {
      console.log('🔄 Fetching managers...');
      const response = await employeesApi.getAll();
      console.log('👥 Employees API response:', response.data);
      
      const managersData = response.data.results || response.data || [];
      console.log('✅ Managers data extracted:', managersData);
      
      setManagers(managersData.map((manager) => ({ 
        id: manager.id, 
        name: manager.name || `${manager.first_name} ${manager.last_name}`.trim() || 'Unknown'
      })));
    } catch (err) {
      console.error('❌ Error fetching managers:', err);
      setError('Failed to load managers. Please refresh the page.');
      // Fallback to hardcoded data if API fails
      setManagers([
        { id: 1, name: 'John Smith' },
        { id: 2, name: 'Anna Johnson' },
        { id: 3, name: 'Michael Brown' },
      ]);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
    fetchManagers();
  }, [fetchProjects, fetchManagers]);
  
  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "name", headerName: "Project Name", flex: 1 },
    {
      field: "required_people_count",
      headerName: "Required People",
      flex: 0.8,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "location_city",
      headerName: "City",
      flex: 0.8,
    },
    {
      field: "location_country",
      headerName: "Country",
      flex: 0.8,
    },
    {
      field: "details",
      headerName: "Details",
      flex: 1.5,
      renderCell: (params) => {
        if (!params || !params.value) return <Typography>No details</Typography>;
        return (
          <Typography>
            {params.value.length > 50 ? `${params.value.substring(0, 50)}...` : params.value}
          </Typography>
        );
      },
    },
    {
      field: "manager",
      headerName: "Manager",
      flex: 1,
      renderCell: (params) => {
        if (!params || !params.row) return <Typography>N/A</Typography>;
        return (
          <Typography>
            {params.row.manager ? params.row.manager : "Not assigned"}
          </Typography>
        );
      },
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
      <Header title="PROJECTS" subtitle="Managing Projects" />
      
      {error && (
        <Box mb="20px">
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        </Box>
      )}
      
      <Box display="flex" justifyContent="space-between" alignItems="center" mb="20px">
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleDialogOpen("create")}
        >
          Add New Project
        </Button>
        
        <Button
          variant="outlined"
          color="primary"
          startIcon={<RefreshIcon />}
          onClick={() => {
            fetchProjects();
            fetchManagers();
          }}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>
      
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
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="400px">
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid 
            rows={Array.isArray(projects) ? projects : []} 
            columns={columns}
            loading={loading}
            autoHeight
            getRowId={(row) => row.id}
            disableSelectionOnClick
            sx={{
              '& .MuiDataGrid-cell:focus': {
                outline: 'none',
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: colors.primary[400],
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
        maxWidth="md"
      >
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>
            {dialogType === "create" ? "Add New Project" : "Edit Project"}
          </DialogTitle>
          <DialogContent>
            <Box mt={2} display="grid" gap={2} gridTemplateColumns="1fr 1fr">
              <TextField
                fullWidth
                variant="filled"
                label="Project Name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
              {/* Client field removed as it's not in the backend model */}
              <TextField
                fullWidth
                variant="filled"
                label="Street Address"
                name="location_street"
                value={formik.values.location_street}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.location_street && Boolean(formik.errors.location_street)}
                helperText={formik.touched.location_street && formik.errors.location_street}
              />
              <TextField
                fullWidth
                variant="filled"
                label="City"
                name="location_city"
                value={formik.values.location_city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.location_city && Boolean(formik.errors.location_city)}
                helperText={formik.touched.location_city && formik.errors.location_city}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Postal Code"
                name="location_postal_code"
                value={formik.values.location_postal_code}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.location_postal_code && Boolean(formik.errors.location_postal_code)}
                helperText={formik.touched.location_postal_code && formik.errors.location_postal_code}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Country"
                name="location_country"
                value={formik.values.location_country}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.location_country && Boolean(formik.errors.location_country)}
                helperText={formik.touched.location_country && formik.errors.location_country}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Required People"
                name="required_people_count"
                type="number"
                value={formik.values.required_people_count}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.required_people_count && Boolean(formik.errors.required_people_count)}
                helperText={formik.touched.required_people_count && formik.errors.required_people_count}
                inputProps={{ min: 1 }}
                gridColumn="span 2"
              />
              <TextField
                fullWidth
                variant="filled"
                label="Project Details"
                name="details"
                value={formik.values.details}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.details && Boolean(formik.errors.details)}
                helperText={formik.touched.details && formik.errors.details}
                multiline
                rows={4}
                gridColumn="span 2"
              />
              <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 2" }}>
                <InputLabel>Project Manager</InputLabel>
                <Select
                  name="manager"
                  value={formik.values.manager}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.manager && Boolean(formik.errors.manager)}
                >
                  <MenuItem value=""><em>Select a Manager</em></MenuItem>
                  {managers.map((manager) => (
                    <MenuItem key={manager.id} value={manager.id}>
                      {manager.name}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.manager && formik.errors.manager && (
                  <Typography color="error" variant="caption">
                    {formik.errors.manager}
                  </Typography>
                )}
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
        <DialogTitle>Delete Project</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete project "{selectedProject?.name}"?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteProject} 
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

export default Projects;
