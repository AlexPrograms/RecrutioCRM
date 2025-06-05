import { ColorModeContext, useMode } from "./theme"; 
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route, useLocation } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Contacts from "./scenes/contacts";
import Employees from "./scenes/employees"; 
import Form from "./scenes/form";
import Calendar from "./scenes/calendar";
import FAQ from "./scenes/faq";
import Login from "./scenes/authentication";
import Account from "./scenes/account";







function App() {
  const [theme, colorMode] = useMode();
  // const location = useLocation();

  // const isLogin = location.pathname === "/login";

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar />
          <main className="content">
            <Topbar/>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/team" element={<Team />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/invoices" element={<Employees />} />
              <Route path="/form" element={<Form />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/login" element={<Login />} />
              <Route path="/account" element={<Account />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
