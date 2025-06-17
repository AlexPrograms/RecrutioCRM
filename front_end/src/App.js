import { ColorModeContext, useMode } from "./theme"; 
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route, useLocation, Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from 'react';
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Contacts from "./scenes/contacts";
import Employees from "./scenes/employees"; 
import Candidates from "./scenes/candidates";
import Projects from "./scenes/projects";
import Vacancies from "./scenes/vacancies";
import Form from "./scenes/form";
import FAQ from "./scenes/faq";
import Calendar from "./scenes/calendar"; // Assuming index.jsx is the main file
import Login from "./scenes/auth/Login";
import Account from "./scenes/account";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthDebugger from "./components/AuthDebugger";

function App() {
  const [theme, colorMode] = useMode();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('access_token'));

  // Check authentication status when location changes
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsAuthenticated(!!token);
  }, [location]);

  // Layout component that includes Sidebar and Topbar
  const AppLayout = () => (
    <div className="app">
      <Sidebar />
      <main className="content">
        <Topbar />
        {/* Outlet renders the child route content here */}
        <Outlet />
      </main>
    </div>
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/" replace /> : <Login />
          } />
          
          {/* Auth Debugger - for testing login functionality */}
          <Route path="/auth-debug" element={<AuthDebugger />} />
          
          {/* Protected Routes - AppLayout provides the Outlet for child routes */}
          <Route 
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/candidates" element={<Candidates />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/vacancies" element={<Vacancies />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/form" element={<Form />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/account" element={<Account />} />
          </Route>
          
          {/* Catch all other routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
