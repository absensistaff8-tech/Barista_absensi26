/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/Auth/LoginPage";
import { BaristaDashboard } from "./pages/Barista/BaristaDashboard";
import { ClockInPage } from "./pages/Barista/ClockInPage";
import { ClockOutPage } from "./pages/Barista/ClockOutPage";
import { AdminDashboard } from "./pages/Admin/AdminDashboard";
import { EmployeeManagement } from "./pages/Admin/EmployeeManagement";
import { OutletSettings } from "./pages/Admin/OutletSettings";
import { ReportPage } from "./pages/Admin/ReportPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        
        {/* Barista Routes */}
        <Route path="/barista" element={<BaristaDashboard />} />
        <Route path="/barista/clock-in" element={<ClockInPage />} />
        <Route path="/barista/clock-out" element={<ClockOutPage />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />}>
          <Route path="employees" element={<EmployeeManagement />} />
          <Route path="outlets" element={<OutletSettings />} />
          <Route path="reports" element={<ReportPage />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
