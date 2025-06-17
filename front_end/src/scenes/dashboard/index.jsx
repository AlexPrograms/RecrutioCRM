import React, { useState, useEffect } from 'react';
import { Box, Button, IconButton, Typography, useTheme, CircularProgress } from "@mui/material";
import { tokens } from "../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import GroupIcon from "@mui/icons-material/Group";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import Header from "../../components/header";
import LineChart from "../../components/linechart";
import GeographyChart from "../../components/geographychart";
import BarChart from "../../components/barchart";
import StatBox from "../../components/statbox";
import ProgressCircle from "../../components/progresscircle";

// Helper function to generate chart data format
const formatChartData = (data, label) => {
  return [{
    id: label,
    color: "hsl(229, 70%, 50%)",
    data: data
  }];
};

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  // State for API data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    candidateCount: 0,
    openPositions: 0,
    projectCount: 0,
    employeeCount: 0
  });
  const [recentCandidates, setRecentCandidates] = useState([]);
  const [candidatesChartData, setCandidatesChartData] = useState([]);
  
  useEffect(() => {
    const loadMockDashboardData = () => {
      try {
        setLoading(true);
        
        // Mock stats
        const mockStats = {
          candidateCount: 47,
          openPositions: 14,
          projectCount: 8,
          employeeCount: 32
        };
        
        setStats(mockStats);
        
        // Mock recent candidates
        const mockCandidates = [
          { id: 1, first_name: 'John', last_name: 'Smith', email: 'john.smith@example.com', phone: '+380501234567', created_at: '2025-06-10' },
          { id: 2, first_name: 'Anna', last_name: 'Johnson', email: 'anna.j@example.com', phone: '+380502345678', created_at: '2025-06-08' },
          { id: 3, first_name: 'Michael', last_name: 'Brown', email: 'michael.b@example.com', phone: '+380503456789', created_at: '2025-06-05' },
          { id: 4, first_name: 'Emma', last_name: 'Davis', email: 'emma.d@example.com', phone: '+380504567890', created_at: '2025-06-01' },
          { id: 5, first_name: 'Robert', last_name: 'Wilson', email: 'robert.w@example.com', phone: '+380505678901', created_at: '2025-05-28' }
        ];
        
        setRecentCandidates(mockCandidates);
        
        // Mock chart data
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const mockChartData = monthNames.map((month, idx) => ({
          x: month,
          y: Math.floor(Math.random() * 10) + (idx + 1)
        }));
        
        setCandidatesChartData(formatChartData(mockChartData, 'Candidates'));
        setError(null);
      } catch (err) {
        console.error('Error loading mock dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    loadMockDashboardData();
  }, []);

  if (loading) {
    return (
      <Box m="20px" display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box m="20px">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
        <Typography color="error" variant="h5" sx={{ mt: 2 }}>
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

        <Box>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box>
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          borderRadius="20px"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={stats.candidateCount.toString()}
            subtitle="Number of Candidates"
            progress="0.75"
            increase={`${stats.candidateCount > 0 ? '+' : ''}${Math.round(stats.candidateCount / 10)}%`}
            icon={
              <GroupIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          borderRadius="20px"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={stats.openPositions.toString()}
            subtitle="Open Positions"
            progress="0.50"
            increase={`${stats.openPositions > 0 ? '+' : ''}${Math.round(stats.openPositions / 5)}%`}
            icon={
              <WorkOutlineIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          borderRadius="20px"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={stats.projectCount.toString()}
            subtitle="Number of Projects"
            progress="0.30"
            increase={`${stats.projectCount > 0 ? '+' : ''}${Math.round(stats.projectCount / 2)}%`}
            icon={
              <FolderOpenIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          borderRadius="20px"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={stats.employeeCount.toString()}
            subtitle="Employees"
            progress="0.80"
            increase={`${stats.employeeCount > 0 ? '+' : ''}${Math.round(stats.employeeCount / 3)}%`}
            icon={
              <TrendingUpIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* ROW 2 */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          borderRadius="20px"
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Candidates Over Time
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                {stats.candidateCount}
              </Typography>
            </Box>
            <Box>
              <IconButton>
                <DownloadOutlinedIcon
                  sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
                />
              </IconButton>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChart isDashboard={true} customData={candidatesChartData} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          borderRadius="20px"
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Recent Candidates
            </Typography>
          </Box>
          {recentCandidates.length > 0 ? (
            recentCandidates.map((candidate, i) => (
              <Box
                key={`${candidate.id}-${i}`}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                borderBottom={`4px solid ${colors.primary[500]}`}
                p="15px"
              >
                <Box>
                  <Typography
                    color={colors.greenAccent[500]}
                    variant="h5"
                    fontWeight="600"
                  >
                    {candidate.first_name} {candidate.last_name}
                  </Typography>
                  <Typography color={colors.grey[100]}>
                    {candidate.email || 'No email'}
                  </Typography>
                </Box>
                <Box color={colors.grey[100]}>
                  {new Date(candidate.created_at || Date.now()).toLocaleDateString()}
                </Box>
                <Box
                  backgroundColor={colors.greenAccent[500]}
                  p="5px 10px"
                  borderRadius="4px"
                >
                  {candidate.phone || 'N/A'}
                </Box>
              </Box>
            ))
          ) : (
            <Box p="15px">
              <Typography color={colors.grey[100]}>No candidates found</Typography>
            </Box>
          )}
        </Box>

        {/* ROW 3 */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          borderRadius="20px"
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            Project Progress
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
            <ProgressCircle size="125" progress={stats.projectCount ? Math.min(0.75, stats.projectCount / 10) : 0.1} />
            <Typography
              variant="h5"
              color={colors.greenAccent[500]}
              sx={{ mt: "15px" }}
            >
              {stats.projectCount} active projects
            </Typography>
            <Typography>Overall project completion status</Typography>
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          borderRadius="20px"
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
            Candidates Per Month
          </Typography>
          <Box height="250px" mt="-20px">
            <BarChart isDashboard={true} customData={candidatesChartData} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          borderRadius="20px"
          padding="30px"
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ marginBottom: "15px" }}
          >
            Project Locations
          </Typography>
          <Box height="200px">
            <GeographyChart isDashboard={true} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;