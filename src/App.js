import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import ChartsPage from "./pages/ChartsPage";
import UsersPage from "./pages/UsersPage";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN */}
        <Route path="/" element={<LoginPage />} />

        {/* WRAPPED ROUTES WITH SIDEBAR */}
        <Route element={<Layout />}>

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["student", "professor", "admin"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/charts"
            element={
              <ProtectedRoute allowedRoles={["student", "professor", "admin"]}>
                <ChartsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={["professor", "admin"]}>
                <UsersPage />
              </ProtectedRoute>
            }
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;