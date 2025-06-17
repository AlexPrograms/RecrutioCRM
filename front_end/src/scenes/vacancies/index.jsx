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
import { vacanciesApi, projectsApi, tagsApi } from "../../services/apiService";
import { useFormik } from "formik";
import * as yup from "yup";

// Form validation schema
const vacancySchema = yup.object().shape({
  name: yup.string().required('Position name is required'),
  project: yup.mixed().required('Project is required'),
  description: yup.string().required('Description is required'),
  salary: yup
    .number()
    .typeError('Salary must be a number')
    .positive('Salary must be positive')
    .required('Salary is required'),
  working_hours_daily: yup
    .number()
    .typeError('Daily hours must be a number')
    .positive('Daily hours must be positive')
    .required('Daily working hours are required'),
  working_hours_monthly: yup
    .number()
    .typeError('Monthly hours must be a number')
    .positive('Monthly hours must be positive')
    .required('Monthly working hours are required'),
  shift: yup.mixed().required('Shift is required'),
  job_type: yup.mixed().required('Job type is required'),
  sex_required: yup.string().required('Gender requirement is required'),
  open_positions: yup
    .number()
    .typeError('Open positions must be a number')
    .positive('Open positions must be positive')
    .integer('Open positions must be an integer')
    .required('Number of open positions is required'),
  recruiter: yup.mixed(),
});

const Vacancies = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  // State for data
  const [vacancies, setVacancies] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shiftsList, setShiftsList] = useState([]);
  const [jobTypesList, setJobTypesList] = useState([]);

  // Sex options for dropdown
  const sexOptions = ['Any', 'Male', 'Female'];
  
  // Dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState(''); // 'create', 'edit', or 'delete'
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form handling with formik
  const formik = useFormik({
    initialValues: {
      name: '',
      project: '',
      description: '',
      salary: '',
      working_hours_daily: '',
      working_hours_monthly: '',
      shift: '',
      sex_required: 'Any',
      job_type: '',
      open_positions: '',
      recruiter: '',  // This field is required by the backend model
    },
    validationSchema: vacancySchema,
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        setError(null); // Clear previous errors
        
        // Format data for API
        const formattedData = {
          ...values,
          salary: Number(values.salary),
          working_hours_daily: Number(values.working_hours_daily),
          working_hours_monthly: Number(values.working_hours_monthly),
          open_positions: Number(values.open_positions),
          project: Number(values.project), // Ensure project is a number
          job_type: Number(values.job_type), // Ensure job_type is a number
          shift: Number(values.shift), // Ensure shift is a number
          recruiter: values.recruiter ? Number(values.recruiter) : 1, // Default to ID 1 if not provided
          company: 1, // TODO: Extract from authenticated user token
        };
        
        console.log('📤 Submitting vacancy with data:', formattedData);
        
        if (dialogType === 'create') {
          await vacanciesApi.create(formattedData);
          console.log('✅ Vacancy created successfully');
        } else if (dialogType === 'edit' && selectedVacancy) {
          await vacanciesApi.update(selectedVacancy.id, formattedData);
          console.log('✅ Vacancy updated successfully');
        }
        
        fetchVacancies();
        handleDialogClose();
      } catch (err) {
        console.error("❌ Error submitting vacancy:", err);
        const errorMessage = err.response?.data?.detail || 
                             err.response?.data?.message || 
                             "Failed to save vacancy. Please check your data and try again.";
        setError(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    },
  });
  
  // Dialog management
  const handleDialogOpen = (type, vacancy = null) => {
    setDialogType(type);
    setSelectedVacancy(vacancy);
    
    if (type === 'edit' && vacancy) {
      formik.setValues({
        name: vacancy.name || '',
        project: vacancy.project?.id || '',
        description: vacancy.description || '',
        salary: vacancy.salary || '',
        working_hours_daily: vacancy.working_hours_daily || '',
        working_hours_monthly: vacancy.working_hours_monthly || '',
        shift: vacancy.shift?.id || '',
        sex_required: vacancy.sex_required || 'Any',
        job_type: vacancy.job_type?.id || '',
        open_positions: vacancy.open_positions || '',
        recruiter: vacancy.recruiter?.id || '',
      });
    } else if (type === 'create') {
      formik.resetForm();
    }
    
    setOpenDialog(true);
  };
  
  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedVacancy(null);
    setDialogType('');
    formik.resetForm();
  };
  
  const handleDeleteVacancy = async () => {
    if (!selectedVacancy) return;
    
    try {
      setIsSubmitting(true);
      await vacanciesApi.delete(selectedVacancy.id);
      fetchVacancies();
      handleDialogClose();
    } catch (err) {
      console.error("Error deleting vacancy:", err);
      setError("Failed to delete vacancy. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fetch vacancies
  const fetchVacancies = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching vacancies...');
      const response = await vacanciesApi.getAll();
      console.log('📋 Vacancies API response:', response.data);
      
      // Handle paginated response
      const vacanciesData = response.data.results || response.data || [];
      console.log('✅ Vacancies data extracted:', vacanciesData);
      
      setVacancies(Array.isArray(vacanciesData) ? vacanciesData : []);
      setError(null);
    } catch (err) {
      console.error("❌ Failed to fetch vacancies:", err);
      setError("Failed to load vacancies. Please try again later.");
      setVacancies([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch projects for dropdown
  const fetchProjects = useCallback(async () => {
    try {
      console.log('🔄 Fetching projects for dropdown...');
      const response = await projectsApi.getAll();
      console.log('📋 Projects API response:', response.data);
      
      // Handle paginated response
      const projectsData = response.data.results || response.data || [];
      console.log('✅ Projects data extracted:', projectsData);
      
      setProjects(Array.isArray(projectsData) ? projectsData : []);
    } catch (err) {
      console.error("❌ Error fetching projects:", err);
      setError("Failed to load projects. Please try again.");
      setProjects([]); // Set empty array on error
    }
  }, []);

  // Fetch job types and shifts
  const fetchReferenceData = useCallback(async () => {
    try {
      console.log('🔄 Fetching reference data (shifts and job types)...');
      
      // In a real app, you'd have specific endpoints for these
      // For now, we'll simulate with the general tagsApi
      const shiftsResponse = await tagsApi.getAll();
      console.log('📋 Shifts API response:', shiftsResponse.data);
      
      // Handle paginated response for shifts
      const shiftsData = shiftsResponse.data.results || shiftsResponse.data || [];
      const fallbackShifts = [
        { id: 1, name: 'Morning' },
        { id: 2, name: 'Evening' },
        { id: 3, name: 'Night' }
      ];
      setShiftsList(Array.isArray(shiftsData) && shiftsData.length > 0 ? shiftsData : fallbackShifts);
      
      const jobTypesResponse = await tagsApi.getAll();
      console.log('📋 Job Types API response:', jobTypesResponse.data);
      
      // Handle paginated response for job types
      const jobTypesData = jobTypesResponse.data.results || jobTypesResponse.data || [];
      const fallbackJobTypes = [
        { id: 1, name: 'Full-time' },
        { id: 2, name: 'Part-time' },
        { id: 3, name: 'Contract' },
        { id: 4, name: 'Temporary' }
      ];
      setJobTypesList(Array.isArray(jobTypesData) && jobTypesData.length > 0 ? jobTypesData : fallbackJobTypes);
      
      console.log('✅ Reference data loaded successfully');
    } catch (err) {
      console.error("❌ Error fetching reference data:", err);
      // Fallback data in case API fails
      setShiftsList([
        { id: 1, name: 'Morning' },
        { id: 2, name: 'Evening' },
        { id: 3, name: 'Night' }
      ]);
      setJobTypesList([
        { id: 1, name: 'Full-time' },
        { id: 2, name: 'Part-time' },
        { id: 3, name: 'Contract' },
        { id: 4, name: 'Temporary' }
      ]);
    }
  }, []);

  useEffect(() => {
    fetchVacancies();
    fetchProjects();
    fetchReferenceData();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "name", headerName: "Position", flex: 1 },
    {
      field: "project",
      headerName: "Project",
      flex: 1,
      renderCell: (params) => {
        if (!params || !params.row) return 'N/A';
        return params.row.project?.name || 'Not assigned';
      },
    },
    {
      field: "salary",
      headerName: "Salary",
      flex: 0.8,
      valueFormatter: (params) => {
        if (!params || !params.value) return '$0.00';
        return `$${params.value.toFixed(2)}`;
      },
    },
    {
      field: "job_type",
      headerName: "Job Type",
      flex: 0.8,
      renderCell: (params) => {
        if (!params || !params.row) return 'N/A';
        return params.row.job_type?.name || 'Not specified';
      },
    },
    {
      field: "shift",
      headerName: "Shift",
      flex: 0.8,
      renderCell: (params) => {
        if (!params || !params.row) return 'N/A';
        return params.row.shift?.name || 'Not specified';
      },
    },
    {
      field: "open_positions",
      headerName: "Open Positions",
      flex: 0.6,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "sex_required",
      headerName: "Gender",
      flex: 0.7,
    },
    {
      field: "created_at",
      headerName: "Created",
      flex: 0.8,
      valueFormatter: (params) => {
        if (!params || !params.value) return 'Not set';
        return new Date(params.value).toLocaleDateString();
      }
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1.2,
      renderCell: (params) => {
        if (!params || !params.value) return <Typography>No description</Typography>;
        return (
          <Typography>
            {params.value.length > 30 ? `${params.value.substring(0, 30)}...` : params.value}
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
      <Header title="VACANCIES" subtitle="Manage open positions" />
      
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
          Create New Vacancy
        </Button>
        
        <Button
          variant="outlined"
          color="primary"
          startIcon={<RefreshIcon />}
          onClick={() => {
            fetchVacancies();
            fetchProjects();
            fetchReferenceData();
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
            rows={Array.isArray(vacancies) ? vacancies : []} 
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

      {/* Create/Edit Vacancy Dialog */}
      <Dialog 
        open={openDialog && (dialogType === "create" || dialogType === "edit")} 
        onClose={handleDialogClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>{dialogType === "create" ? "Create New Vacancy" : "Edit Vacancy"}</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(2, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: "span 1" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                label="Position Name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
              <FormControl fullWidth variant="filled">
                <InputLabel>Project</InputLabel>
                <Select
                  name="project"
                  value={formik.values.project}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.project && Boolean(formik.errors.project)}
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  {projects.map((project) => (
                    <MenuItem key={project.id} value={project.id}>
                      {project.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                variant="filled"
                label="Salary"
                name="salary"
                type="number"
                value={formik.values.salary}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.salary && Boolean(formik.errors.salary)}
                helperText={formik.touched.salary && formik.errors.salary}
                inputProps={{ step: 0.01 }}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Open Positions"
                name="open_positions"
                type="number"
                value={formik.values.open_positions}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.open_positions && Boolean(formik.errors.open_positions)}
                helperText={formik.touched.open_positions && formik.errors.open_positions}
                inputProps={{ min: 1 }}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Daily Working Hours"
                name="working_hours_daily"
                type="number"
                value={formik.values.working_hours_daily}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.working_hours_daily && Boolean(formik.errors.working_hours_daily)}
                helperText={formik.touched.working_hours_daily && formik.errors.working_hours_daily}
                inputProps={{ step: 0.5, min: 0 }}
              />
              <TextField
                fullWidth
                variant="filled"
                label="Monthly Working Hours"
                name="working_hours_monthly"
                type="number"
                value={formik.values.working_hours_monthly}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.working_hours_monthly && Boolean(formik.errors.working_hours_monthly)}
                helperText={formik.touched.working_hours_monthly && formik.errors.working_hours_monthly}
                inputProps={{ step: 0.5, min: 0 }}
              />
              <FormControl fullWidth variant="filled">
                <InputLabel>Shift</InputLabel>
                <Select
                  name="shift"
                  value={formik.values.shift}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.shift && Boolean(formik.errors.shift)}
                >
                  <MenuItem value=""><em>Select Shift</em></MenuItem>
                  {shiftsList.map((shift) => (
                    <MenuItem key={shift.id} value={shift.id}>
                      {shift.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth variant="filled">
                <InputLabel>Job Type</InputLabel>
                <Select
                  name="job_type"
                  value={formik.values.job_type}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.job_type && Boolean(formik.errors.job_type)}
                >
                  <MenuItem value=""><em>Select Job Type</em></MenuItem>
                  {jobTypesList.map((jobType) => (
                    <MenuItem key={jobType.id} value={jobType.id}>
                      {jobType.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth variant="filled">
                <InputLabel>Sex Required</InputLabel>
                <Select
                  name="sex_required"
                  value={formik.values.sex_required}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.sex_required && Boolean(formik.errors.sex_required)}
                >
                  {sexOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                variant="filled"
                label="Description"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
                multiline
                rows={4}
                gridColumn="span 2"
              />
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
              {isSubmitting ? <CircularProgress size={24} /> : dialogType === "create" ? "Create" : "Save"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog && dialogType === "delete"} onClose={handleDialogClose}>
        <DialogTitle>Delete Vacancy</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete vacancy "{selectedVacancy?.title}"?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteVacancy} 
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

export default Vacancies;
