import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Typography,
    useTheme,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Alert,
    Switch,
    FormControlLabel,
    Grid,
    Card,
    CardContent,
    Divider,
    Chip,
    Tooltip
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useFormik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/header";
import { tokens } from "../../theme";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

// Icons
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import RefreshIcon from '@mui/icons-material/Refresh';

// API service
import { employeesApi, candidatesApi, projectsApi, vacanciesApi } from "../../services/apiService";

// Validation schema
const employeeSchema = yup.object().shape({
    candidate_id: yup.number().required("Candidate is required"),
    project_id: yup.number().required("Project is required"),
    vacancy_id: yup.number().required("Vacancy is required"),
    start_date: yup.date().required("Start date is required"),
    planned_end_date: yup.date().nullable(),
    is_registered_zus: yup.boolean(),
    zus_registration_date: yup.date().nullable(),
    housing_details: yup.string().nullable(),
    additional_info: yup.string().nullable()
});

const Employees = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const isNonMobile = useMediaQuery("(min-width:600px)");

    // State for data
    const [employees, setEmployees] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [projects, setProjects] = useState([]);
    const [vacancies, setVacancies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogType, setDialogType] = useState('create'); // 'create' or 'edit'
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const fetchEmployees = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            console.log('🔄 Fetching employees...');
            const response = await employeesApi.getAll();
            console.log('✅ Employees data received:', response.data);
            setEmployees(response.data || []);
            
            if (response.data && response.data.length > 0) {
                console.log('📊 Employee sample:', response.data[0]);
            }
        } catch (err) {
            const errorMessage = "Failed to fetch employees. Please check your connection and authentication.";
            setError(errorMessage);
            console.error('❌ Employees fetch error:', err);
            console.error('Error details:', {
                message: err.message,
                status: err.response?.status,
                statusText: err.response?.statusText,
                data: err.response?.data
            });
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchDropdownData = useCallback(async () => {
        try {
            console.log('🔄 Fetching dropdown data...');
            const [cands, projs, vacs] = await Promise.all([
                candidatesApi.getAll(),
                projectsApi.getAll(),
                vacanciesApi.getAll()
            ]);
            setCandidates(cands.data || []);
            setProjects(projs.data || []);
            setVacancies(vacs.data || []);
            console.log('✅ Dropdown data loaded:', {
                candidates: cands.data?.length || 0,
                projects: projs.data?.length || 0,
                vacancies: vacs.data?.length || 0
            });
        } catch (err) {
            setError("Failed to fetch dropdown data. Some form options may not be available.");
            console.error('❌ Dropdown data fetch error:', err);
        }
    }, []);

    useEffect(() => {
        fetchEmployees();
        fetchDropdownData();
    }, [fetchEmployees, fetchDropdownData]);

    const formik = useFormik({
        initialValues: {
            candidate_id: '',
            project_id: '',
            vacancy_id: '',
            start_date: null,
            planned_end_date: null,
            is_registered_zus: false,
            zus_registration_date: null,
            housing_details: '',
            additional_info: ''
        },
        validationSchema: employeeSchema,
        onSubmit: async (values, { resetForm, setSubmitting }) => {
            setError('');
            const payload = {
                candidate: values.candidate_id,
                project: values.project_id,
                vacancy: values.vacancy_id,
                start_date: values.start_date ? dayjs(values.start_date).format('YYYY-MM-DD') : null,
                planned_end_date: values.planned_end_date ? dayjs(values.planned_end_date).format('YYYY-MM-DD') : null,
                is_registered_zus: values.is_registered_zus,
                zus_registration_date: values.zus_registration_date ? dayjs(values.zus_registration_date).format('YYYY-MM-DD') : null,
                housing_details: values.housing_details,
                additional_info: values.additional_info
            };

            try {
                if (dialogType === 'create') {
                    await employeesApi.create(payload);
                    console.log('✅ Employee created successfully');
                } else {
                    await employeesApi.update(selectedEmployee.id, payload);
                    console.log('✅ Employee updated successfully');
                }
                await fetchEmployees();
                resetForm();
                handleCloseDialog();
            } catch (err) {
                const errorMessage = dialogType === 'create' ? "Failed to create employee. Please check all required fields." : "Failed to update employee. Please try again.";
                setError(errorMessage);
                console.error('❌ Employee save error:', err);
                console.error('❌ Error details:', err.response?.data);
            } finally {
                setSubmitting(false);
            }
        }
    });

    const handleOpenDialog = (type, employee = null) => {
        setDialogType(type);
        setSelectedEmployee(employee);
        setError(''); // Clear any existing errors
        
        if (employee) {
            formik.setValues({
                candidate_id: employee.candidate?.id || '',
                project_id: employee.project?.id || '',
                vacancy_id: employee.vacancy?.id || '',
                start_date: employee.start_date ? dayjs(employee.start_date) : null,
                planned_end_date: employee.planned_end_date ? dayjs(employee.planned_end_date) : null,
                is_registered_zus: employee.is_registered_zus || false,
                zus_registration_date: employee.zus_registration_date ? dayjs(employee.zus_registration_date) : null,
                housing_details: employee.housing_details || '',
                additional_info: employee.additional_info || ''
            });
        } else {
            formik.resetForm();
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedEmployee(null);
        setError(''); // Clear errors when closing
        formik.resetForm();
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this employee? This action cannot be undone.')) {
            try {
                setError(''); // Clear any existing errors
                await employeesApi.delete(id);
                await fetchEmployees();
                console.log('✅ Employee deleted successfully');
            } catch (err) {
                const errorMessage = "Failed to delete employee. Please try again.";
                setError(errorMessage);
                console.error('❌ Employee delete error:', err);
            }
        }
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return dayjs(dateString).format('MMM DD, YYYY');
    };

    // Enhanced columns with better formatting and additional data
    const columns = [
        { 
            field: "id", 
            headerName: "ID", 
            width: 70,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: "candidate",
            headerName: "Employee Name",
            flex: 1.5,
            minWidth: 180,
            renderCell: (params) => (
                <Box display="flex" alignItems="center" gap={1}>
                    <PersonIcon sx={{ color: colors.blueAccent[400] }} />
                    <Box>
                        <Typography variant="body2" fontWeight="bold">
                            {params.row.candidate?.first_name || 'N/A'} {params.row.candidate?.last_name || ''}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                            {params.row.candidate?.email || 'No email'}
                        </Typography>
                    </Box>
                </Box>
            )
        },
        { 
            field: "project", 
            headerName: "Project", 
            flex: 1.2,
            minWidth: 150,
            renderCell: (params) => (
                <Box display="flex" alignItems="center" gap={1}>
                    <WorkIcon sx={{ color: colors.greenAccent[400] }} />
                    <Typography variant="body2">
                        {params.row.project?.name || 'N/A'}
                    </Typography>
                </Box>
            )
        },
        { 
            field: "vacancy", 
            headerName: "Position", 
            flex: 1.2,
            minWidth: 150,
            renderCell: (params) => (
                <Tooltip title={params.row.vacancy?.description || ''}>
                    <Typography variant="body2">
                        {params.row.vacancy?.title || 'N/A'}
                    </Typography>
                </Tooltip>
            )
        },
        { 
            field: "start_date", 
            headerName: "Start Date", 
            flex: 1,
            minWidth: 120,
            renderCell: (params) => (
                <Box display="flex" alignItems="center" gap={1}>
                    <CalendarTodayIcon sx={{ color: colors.primary[100], fontSize: 16 }} />
                    <Typography variant="body2">
                        {formatDate(params.row.start_date)}
                    </Typography>
                </Box>
            )
        },
        { 
            field: "planned_end_date", 
            headerName: "End Date", 
            flex: 1,
            minWidth: 120,
            renderCell: (params) => (
                <Typography variant="body2" color={params.row.planned_end_date ? 'inherit' : 'textSecondary'}>
                    {formatDate(params.row.planned_end_date)}
                </Typography>
            )
        },
        {
            field: "is_registered_zus",
            headerName: "ZUS Status",
            width: 120,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <Chip
                    icon={params.row.is_registered_zus ? <CheckCircleIcon /> : <ErrorIcon />}
                    label={params.row.is_registered_zus ? "Registered" : "Not Registered"}
                    color={params.row.is_registered_zus ? "success" : "warning"}
                    size="small"
                    variant="outlined"
                />
            )
        },
        {
            field: "actions",
            headerName: "Actions",
            width: 120,
            headerAlign: 'center',
            align: 'center',
            sortable: false,
            renderCell: (params) => (
                <Box display="flex" justifyContent="center" gap={1}>
                    <Tooltip title="Edit Employee">
                        <IconButton 
                            onClick={() => handleOpenDialog('edit', params.row)}
                            sx={{ color: colors.blueAccent[400] }}
                        >
                            <EditOutlinedIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Employee">
                        <IconButton 
                            onClick={() => handleDelete(params.row.id)}
                            sx={{ color: colors.redAccent[400] }}
                        >
                            <DeleteOutlinedIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            )
        }
    ];

    return (
        <Box m="20px">
            <Header title="EMPLOYEES" subtitle="Managing company employees and their assignments" />
            
            {error && (
                <Alert 
                    severity="error" 
                    sx={{ mb: 2 }}
                    onClose={() => setError('')}
                >
                    {error}
                </Alert>
            )}
            
            {/* Summary Cards */}
            <Box display="flex" gap={2} mb={3} flexWrap="wrap">
                <Card sx={{ minWidth: 150, flex: '1 1 200px' }}>
                    <CardContent>
                        <Typography color="textSecondary" gutterBottom variant="h6">
                            Total Employees
                        </Typography>
                        <Typography variant="h4" color={colors.blueAccent[400]}>
                            {employees.length}
                        </Typography>
                    </CardContent>
                </Card>
                <Card sx={{ minWidth: 150, flex: '1 1 200px' }}>
                    <CardContent>
                        <Typography color="textSecondary" gutterBottom variant="h6">
                            ZUS Registered
                        </Typography>
                        <Typography variant="h4" color={colors.greenAccent[400]}>
                            {employees.filter(emp => emp.is_registered_zus).length}
                        </Typography>
                    </CardContent>
                </Card>
                <Card sx={{ minWidth: 150, flex: '1 1 200px' }}>
                    <CardContent>
                        <Typography color="textSecondary" gutterBottom variant="h6">
                            Active Projects
                        </Typography>
                        <Typography variant="h4" color={colors.primary[100]}>
                            {new Set(employees.map(emp => emp.project?.id).filter(Boolean)).size}
                        </Typography>
                    </CardContent>
                </Card>
            </Box>

            <Box display="flex" gap={2} mb={2}>
                <Button
                    variant="contained"
                    sx={{ 
                        backgroundColor: colors.blueAccent[700], 
                        color: colors.grey[100], 
                        '&:hover': {
                            backgroundColor: colors.blueAccent[800]
                        }
                    }}
                    onClick={() => handleOpenDialog('create')}
                >
                    Add New Employee
                </Button>
                
                <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    sx={{ 
                        borderColor: colors.primary[100], 
                        color: colors.primary[100],
                        '&:hover': {
                            borderColor: colors.primary[200],
                            backgroundColor: colors.primary[900]
                        }
                    }}
                    onClick={() => {
                        fetchEmployees();
                        fetchDropdownData();
                    }}
                    disabled={loading}
                >
                    Refresh Data
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
                        padding: "12px",
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: colors.blueAccent[700],
                        borderBottom: "none",
                        fontSize: "14px",
                        fontWeight: "bold",
                    },
                    "& .MuiDataGrid-virtualScroller": {
                        backgroundColor: colors.primary[400],
                    },
                    "& .MuiDataGrid-footerContainer": {
                        borderTop: "none",
                        backgroundColor: colors.blueAccent[700],
                    },
                    "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                        color: `${colors.grey[100]} !important`,
                    },
                    "& .MuiDataGrid-row": {
                        "&:hover": {
                            backgroundColor: colors.primary[300]
                        }
                    }
                }}
            >
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="400px">
                        <CircularProgress />
                        <Typography ml={2}>Loading employees...</Typography>
                    </Box>
                ) : employees.length === 0 ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="400px">
                        <Typography variant="h6" color="textSecondary">
                            No employees found. Click "Add New Employee" to get started.
                        </Typography>
                    </Box>
                ) : (
                    <DataGrid
                        rows={employees}
                        columns={columns}
                        components={{ Toolbar: GridToolbar }}
                        getRowId={(row) => row.id}
                        disableSelectionOnClick
                        autoHeight={false}
                        initialState={{
                            pagination: {
                                paginationModel: { pageSize: 25 },
                            },
                        }}
                        pageSizeOptions={[10, 25, 50, 100]}
                    />
                )}
            </Box>

            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                <DialogTitle>{dialogType === 'create' ? 'Create New Employee' : 'Edit Employee'}</DialogTitle>
                <DialogContent>
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12}>
                                <FormControl fullWidth error={formik.touched.candidate_id && Boolean(formik.errors.candidate_id)}>
                                    <InputLabel>Candidate *</InputLabel>
                                    <Select
                                        name="candidate_id"
                                        value={formik.values.candidate_id}
                                        onChange={formik.handleChange}
                                        label="Candidate *"
                                        onBlur={formik.handleBlur}
                                    >
                                        {candidates.length > 0 ? (
                                            candidates.map(c => (
                                                <MenuItem key={c.id} value={c.id}>
                                                    {c.first_name} {c.last_name} {c.email && `(${c.email})`}
                                                </MenuItem>
                                            ))
                                        ) : (
                                            <MenuItem disabled>No candidates available</MenuItem>
                                        )}
                                    </Select>
                                    {formik.touched.candidate_id && formik.errors.candidate_id && (
                                        <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                                            {formik.errors.candidate_id}
                                        </Typography>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth error={formik.touched.project_id && Boolean(formik.errors.project_id)}>
                                    <InputLabel>Project *</InputLabel>
                                    <Select
                                        name="project_id"
                                        value={formik.values.project_id}
                                        onChange={formik.handleChange}
                                        label="Project *"
                                        onBlur={formik.handleBlur}
                                    >
                                        {projects.length > 0 ? (
                                            projects.map(p => (
                                                <MenuItem key={p.id} value={p.id}>
                                                    {p.name} {p.description && `- ${p.description}`}
                                                </MenuItem>
                                            ))
                                        ) : (
                                            <MenuItem disabled>No projects available</MenuItem>
                                        )}
                                    </Select>
                                    {formik.touched.project_id && formik.errors.project_id && (
                                        <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                                            {formik.errors.project_id}
                                        </Typography>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth error={formik.touched.vacancy_id && Boolean(formik.errors.vacancy_id)}>
                                    <InputLabel>Vacancy *</InputLabel>
                                    <Select
                                        name="vacancy_id"
                                        value={formik.values.vacancy_id}
                                        onChange={formik.handleChange}
                                        label="Vacancy *"
                                        onBlur={formik.handleBlur}
                                    >
                                        {vacancies.length > 0 ? (
                                            vacancies.map(v => (
                                                <MenuItem key={v.id} value={v.id}>
                                                    {v.title} {v.department && `- ${v.department}`}
                                                </MenuItem>
                                            ))
                                        ) : (
                                            <MenuItem disabled>No vacancies available</MenuItem>
                                        )}
                                    </Select>
                                    {formik.touched.vacancy_id && formik.errors.vacancy_id && (
                                        <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                                            {formik.errors.vacancy_id}
                                        </Typography>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="Start Date *"
                                        value={formik.values.start_date}
                                        onChange={(value) => formik.setFieldValue('start_date', value)}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                error: formik.touched.start_date && Boolean(formik.errors.start_date),
                                                helperText: formik.touched.start_date && formik.errors.start_date
                                            }
                                        }}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="Planned End Date"
                                        value={formik.values.planned_end_date}
                                        onChange={(value) => formik.setFieldValue('planned_end_date', value)}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true
                                            }
                                        }}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={<Switch checked={formik.values.is_registered_zus} onChange={formik.handleChange} name="is_registered_zus" />}
                                    label="Registered in ZUS"
                                />
                            </Grid>
                            {formik.values.is_registered_zus && (
                                <Grid item xs={12}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            label="ZUS Registration Date"
                                            value={formik.values.zus_registration_date}
                                            onChange={(value) => formik.setFieldValue('zus_registration_date', value)}
                                            slotProps={{
                                                textField: {
                                                    fullWidth: true
                                                }
                                            }}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                            )}
                            <Grid item xs={12}>
                                <TextField
                                    label="Housing Details"
                                    name="housing_details"
                                    value={formik.values.housing_details}
                                    onChange={formik.handleChange}
                                    fullWidth
                                    multiline
                                    rows={2}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Additional Info"
                                    name="additional_info"
                                    value={formik.values.additional_info}
                                    onChange={formik.handleChange}
                                    fullWidth
                                    multiline
                                    rows={2}
                                />
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} disabled={formik.isSubmitting}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={formik.submitForm} 
                        variant="contained"
                        color="primary" 
                        disabled={formik.isSubmitting}
                        sx={{
                            backgroundColor: colors.blueAccent[700],
                            '&:hover': {
                                backgroundColor: colors.blueAccent[800]
                            }
                        }}
                    >
                        {formik.isSubmitting ? <CircularProgress size={24} /> : (dialogType === 'create' ? 'Create' : 'Save')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Employees;
