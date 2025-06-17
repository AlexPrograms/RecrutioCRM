import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    useTheme,
    Button,
    CircularProgress,
    Alert,
    Card,
    CardContent
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../components/header";
import { tokens } from "../../theme";
import { employeesApi } from "../../services/apiService";

const EmployeesSimple = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            setError('');
            console.log('🔄 Fetching employees...');
            const response = await employeesApi.getAll();
            console.log('✅ Employees response:', response);
            
            // Handle different response structures
            const employeeData = response.data || response || [];
            console.log('📊 Employee data:', employeeData);
            setEmployees(Array.isArray(employeeData) ? employeeData : []);
        } catch (err) {
            console.error('❌ Error fetching employees:', err);
            setError(`Failed to fetch employees: ${err.message || 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    // Simple columns for basic display
    const columns = [
        { 
            field: "id", 
            headerName: "ID", 
            width: 70 
        },
        {
            field: "candidate_name",
            headerName: "Employee Name",
            flex: 1,
            valueGetter: (params) => {
                const candidate = params.row.candidate;
                if (candidate && typeof candidate === 'object') {
                    return `${candidate.first_name || ''} ${candidate.last_name || ''}`.trim() || 'N/A';
                }
                return candidate || 'N/A';
            }
        },
        {
            field: "project_name",
            headerName: "Project",
            flex: 1,
            valueGetter: (params) => {
                const project = params.row.project;
                if (project && typeof project === 'object') {
                    return project.name || 'N/A';
                }
                return project || 'N/A';
            }
        },
        {
            field: "vacancy_title",
            headerName: "Position",
            flex: 1,
            valueGetter: (params) => {
                const vacancy = params.row.vacancy;
                if (vacancy && typeof vacancy === 'object') {
                    return vacancy.title || 'N/A';
                }
                return vacancy || 'N/A';
            }
        },
        {
            field: "start_date",
            headerName: "Start Date",
            flex: 1,
            valueFormatter: (params) => {
                if (!params.value) return 'N/A';
                try {
                    return new Date(params.value).toLocaleDateString();
                } catch {
                    return params.value;
                }
            }
        }
    ];

    return (
        <Box m="20px">
            <Header title="EMPLOYEES" subtitle="Employee Management System" />
            
            {error && (
                <Alert 
                    severity="error" 
                    sx={{ mb: 2 }}
                    onClose={() => setError('')}
                >
                    {error}
                </Alert>
            )}
            
            <Card sx={{ mb: 2 }}>
                <CardContent>
                    <Typography variant="h6" color={colors.blueAccent[400]}>
                        Total Employees: {employees.length}
                    </Typography>
                </CardContent>
            </Card>

            <Button
                variant="contained"
                sx={{ 
                    backgroundColor: colors.blueAccent[700], 
                    color: colors.grey[100], 
                    mb: 2,
                    '&:hover': {
                        backgroundColor: colors.blueAccent[800]
                    }
                }}
                onClick={fetchEmployees}
                disabled={loading}
            >
                {loading ? <CircularProgress size={20} /> : 'Refresh Data'}
            </Button>

            <Box
                height="75vh"
                sx={{
                    "& .MuiDataGrid-root": {
                        border: "none",
                    },
                    "& .MuiDataGrid-cell": {
                        borderBottom: "none",
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
                            No employees found.
                        </Typography>
                    </Box>
                ) : (
                    <DataGrid
                        rows={employees}
                        columns={columns}
                        getRowId={(row) => row.id}
                        disableSelectionOnClick
                        initialState={{
                            pagination: {
                                paginationModel: { pageSize: 25 },
                            },
                        }}
                        pageSizeOptions={[10, 25, 50]}
                    />
                )}
            </Box>
        </Box>
    );
};

export default EmployeesSimple;
